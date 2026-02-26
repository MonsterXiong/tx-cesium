---
name: OSM台湾3DTiles生成方案
overview: 基于 Geofabrik 的 OpenStreetMap 台湾数据，通过开源工具链生成台湾地区 3D Tiles 建筑图层，部署到内网供 CesiumJS 加载。
todos:
  - id: download-osm
    content: 从 Geofabrik 下载台湾 OSM PBF 数据文件
    status: pending
  - id: setup-postgis
    content: Docker 启动 PostGIS，安装 osm2pgsql / ogr2ogr / py3dtilers
    status: pending
  - id: import-osm
    content: 编写 buildings.lua，用 osm2pgsql 导入建筑数据到 PostGIS
    status: pending
  - id: export-geojson
    content: 用 ogr2ogr 导出建筑 GeoJSON（可按区域裁剪）
    status: pending
  - id: generate-3dtiles
    content: 用 py3dtilers geojson_tiler 生成 3D Tiles
    status: pending
  - id: deploy-load
    content: 部署到内网静态服务器，修改项目中 tileset.json 路径
    status: pending
isProject: false
---

# 基于 OSM 生成台湾 3D Tiles 建筑图层 — 完整方案

## 可行性结论

**完全可行。** 你目前项目已在加载本地 `/public/taipei/tileset.json`，只需将自建的 3D Tiles 替换即可，代码几乎无需改动。

## 整体流程概览

```mermaid
flowchart LR
    A["Geofabrik\ntaiwan.osm.pbf"] --> B["osm2pgsql\n导入PostGIS"]
    B --> C["ogr2ogr\n导出GeoJSON"]
    C --> D["py3dtilers/\nosm-cesium-3d-tiles\n生成3DTiles"]
    D --> E["Nginx/内网\n静态托管"]
    E --> F["CesiumJS\n加载tileset.json"]
```



## 方案对比：两条可选路线

### 路线 A：osm-cesium-3d-tiles（Docker 一体化，推荐）

**优点**：一站式，从 OSM PBF 直接到 3D Tiles，Docker 封装好  
**缺点**：项目维护不太活跃（84 stars），依赖较多 Java 组件  
**仓库**：[https://github.com/kiselev-dv/osm-cesium-3d-tiles](https://github.com/kiselev-dv/osm-cesium-3d-tiles)

**步骤**：

1. 下载数据：`taiwan-latest.osm.pbf`（约 313MB）
2. Docker build 镜像
3. 运行 `scripts/convert.sh`，一步出 3D Tiles

### 路线 B：osm2pgsql + PostGIS + py3dtilers（灵活可控，推荐生产环境）

**优点**：每一步可控、数据可清洗过滤、工具都是主流维护中  
**缺点**：步骤较多，需要安装 PostGIS

---

## 路线 B 详细步骤（推荐）

### Step 1：下载台湾 OSM 数据

从 [Geofabrik](https://download.geofabrik.de/asia/taiwan.html) 下载最新数据：

```bash
wget https://download.geofabrik.de/asia/taiwan-latest.osm.pbf
# 文件约 313MB，包含台湾所有 OSM 数据
```

### Step 2：安装依赖环境

推荐使用 Docker 避免环境问题：

```bash
# PostgreSQL + PostGIS
docker run -d --name postgis \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=osmtw \
  -p 5432:5432 \
  postgis/postgis:16-3.4

# 安装 osm2pgsql（macOS）
brew install osm2pgsql

# 安装 GDAL（含 ogr2ogr）
brew install gdal

# 安装 py3dtilers
pip install py3dtilers
```

### Step 3：导入 OSM 数据到 PostGIS

编写 Lua 配置文件 `buildings.lua`，仅提取建筑物：

```lua
local tables = {}

tables.buildings = osm2pgsql.define_area_table('buildings', {
    { column = 'name', type = 'text' },
    { column = 'height', type = 'real' },
    { column = 'building_levels', type = 'int' },
    { column = 'building', type = 'text' },
    { column = 'geom', type = 'polygon', projection = 4326 },
})

function is_building(tags)
    return tags.building and tags.building ~= 'no'
end

function get_height(tags)
    local h = tonumber(tags.height)
    if h and h > 0 and h < 900 then return h end
    local levels = tonumber(tags['building:levels'])
    if levels and levels > 0 then return levels * 3.5 end
    return 10  -- 默认高度 10m
end

function osm2pgsql.process_way(object)
    if not is_building(object.tags) then return end
    if not object.is_closed then return end
    tables.buildings:insert({
        name = object.tags.name or '',
        height = get_height(object.tags),
        building_levels = tonumber(object.tags['building:levels']) or 0,
        building = object.tags.building,
        geom = object:as_polygon()
    })
end

function osm2pgsql.process_relation(object)
    if not is_building(object.tags) then return end
    if object.tags.type ~= 'multipolygon' then return end
    tables.buildings:insert({
        name = object.tags.name or '',
        height = get_height(object.tags),
        building_levels = tonumber(object.tags['building:levels']) or 0,
        building = object.tags.building,
        geom = object:as_multipolygon()
    })
end
```

执行导入：

```bash
osm2pgsql -d postgresql://postgres:postgres@localhost:5432/osmtw \
  -O flex -S buildings.lua \
  taiwan-latest.osm.pbf
```

### Step 4：导出建筑数据为 GeoJSON

```bash
ogr2ogr -f "GeoJSON" taiwan_buildings.geojson \
  PG:"host=localhost dbname=osmtw user=postgres password=postgres" \
  -sql "SELECT name, height, building, geom FROM buildings"
```

> 注意：台湾全岛建筑数据量可能很大（几十万到上百万建筑），可以按区域分片导出，如只导出台北市范围：

```bash
ogr2ogr -f "GeoJSON" taipei_buildings.geojson \
  PG:"host=localhost dbname=osmtw user=postgres password=postgres" \
  -sql "SELECT name, height, building, geom FROM buildings
        WHERE ST_Intersects(geom,
          ST_MakeEnvelope(121.45, 24.95, 121.65, 25.15, 4326))"
```

### Step 5：生成 3D Tiles

使用 py3dtilers 的 GeoJSON Tiler：

```bash
geojson_tiler --path taiwan_buildings.geojson \
  --height height \
  --output taiwan_3dtiles
```

输出目录结构：

```
taiwan_3dtiles/
├── tileset.json        <-- CesiumJS 入口
├── r.b3dm
├── r0.b3dm
├── r1.b3dm
├── ...
```

### Step 6：部署到内网

将生成的 `taiwan_3dtiles/` 目录复制到你的内网静态文件服务器（Nginx）或直接放到项目的 `public/` 目录下。

### Step 7：在项目中加载

你的项目代码几乎不需要改动，当前 [cesium-view/index.tsx](src/pages/cesium-view/index.tsx) 第 22 行已经在加载本地 tileset：

```typescript
// 只需修改路径指向新的数据
Cesium.Cesium3DTileset.fromUrl('/public/taiwan-buildings/tileset.json', {
  // 保持现有配置不变...
})
```

## 注意事项

- **数据量**：台湾全岛 OSM 建筑约数十万栋，生成的 3D Tiles 可能有数百 MB 到几 GB
- **建筑高度**：OSM 中大量建筑没有 `height` 标签，Lua 脚本中设置了默认高度 10m，可根据需要调整
- **按区域分片**：如果只关注台北等特定城市，建议按区域裁剪，减少数据量
- **不需要地形**：你已有内网地形数据，3D Tiles 可以独立加载，不影响
- **数据许可**：OSM 数据采用 ODbL 1.0 协议，内网商用需保留归属标注

