---
name: ""
overview: ""
todos:
  - id: todo-1770692864151-of9c4ik1h
    content: 创建public/static/config.js文件，包含一些全局配置，打包之后给客户可以直接修改里面的内容，自定义配置
    status: pending
  - id: todo-1770692910230-vzv9wvwh2
    content: 配置包含baseApi后端地址，systemName系统名称，cesium影像配置等等
    status: pending
  - id: todo-1770692975556-qthgi9agr
    content: 项目读取该config，且跟环境变量合并，如果config为undefined则优先读取环境变量，生产环境优先config配置，开发环境优先环境变量
    status: pending
  - id: todo-1770693167245-s51c8whuw
    content: 内部创建一个config文件，带有代码提示，其它地方引入例如services/api后端地址改成config.baseApi的形式
    status: pending
isProject: false
---

创建内网环境下config.js配置，支持用户自定义修改config文件来修改软件暴露的一些自定义项

