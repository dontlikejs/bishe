import * as Cesium from 'cesium'
export default async function addThreeDTiles(url,viewer) {

  viewer.scene.globe.depthTestAgainstTerrain = true
  
  // ! 写法二：
  let tileset = {}
  if (typeof url == 'number') {
    tileset = await Cesium.Cesium3DTileset.fromIonAssetId(url);
  } else {
    tileset = await Cesium.Cesium3DTileset.fromUrl(url);
  }
  
  viewer.scene.primitives.add(tileset);

  return tileset // 返回模型对象
}
