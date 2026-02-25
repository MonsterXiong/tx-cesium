czm_material czm_getMaterial(czm_materialInput materialInput)
{
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = repeat * materialInput.st;

    if(texture(image, vec2(0.0, 0.0)).a == 1.0){
        discard;
    }else{
        material.alpha = texture(image, vec2(1.0 - fract(time - st.s), st.t)).a * color.a;
    }

    material.diffuse = 1.5 * color.rgb;

    return material;
}
