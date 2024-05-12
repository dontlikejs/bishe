import * as Cesium from 'cesium'
export default async function addThreeDTiles(url,viewer) {

  viewer.scene.globe.depthTestAgainstTerrain = true
  
  // ! д������
  let tileset = {}
  if (typeof url == 'number') {
    tileset = await Cesium.Cesium3DTileset.fromIonAssetId(url);
  } else {
    tileset = await Cesium.Cesium3DTileset.fromUrl(url);
  }
  
  viewer.scene.primitives.add(tileset);

  return tileset // ����ģ�Ͷ���
}
