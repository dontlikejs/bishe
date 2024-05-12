<script setup>
import {onMounted, ref} from 'vue'
import * as Cesium from 'cesium'

import ThreeForm from "../components/ThreeD/ThreeForm.vue";
import addThreeDTiles from "../class/ThreeD/addThreeDTiles.js"
import Measure from "../components/ThreeD/Measure.vue";
import Visual from "../components/ThreeD/Visual.vue";
import Weather from "../components/ThreeD/Weather.vue";
import Draw from "../components/ThreeD/Draw.vue";
import Animate from "../components/ThreeD/Animate.vue";
import useDataInfoStore from "../store/data.ts"; //引入仓库
const dataInfoStore = useDataInfoStore();

const showMeasure = ref(false);
const showVisual = ref(false);
const showWeather = ref(false);
const showDraw = ref(false);
const showAnimate = ref(false);
//cesium初始化必须写在mounted生命周期里面，否则会报错"Element with id "cesiumContainer" does not exist in the document."

onMounted(() => {

  
  const subdomains = ["0", "1", "2", "3", "4", "5", "6", "7"];
  window.viewer.imageryLayers.addImageryProvider(
      new Cesium.WebMapTileServiceImageryProvider({
        url: "http://t{s}.tianditu.gov.cn/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=a11f6f35858ae0805c519ce698dacf4f",
        subdomains: subdomains,
        layer: "tdtImgLayer",
        style: "default",
        format: "image/jpeg",
        tileMatrixSetID: "GoogleMapsCompatible", //使用谷歌的瓦片切片方式
        minimumLevel:1,
        maximumLevel:18
      })
    );
  window.viewer._cesiumWidget._creditContainer.style.display = "none"; //	鍘婚櫎鐗堟潈淇℃伅
  
  //加载建筑
  const modelPromise = addThreeDTiles('../../public/model/tileset.json',window.viewer)
  window.modelPromise = modelPromise
  modelPromise.then(tileset=> {
  })
  // window.viewer.zoomTo(modelPromise)
//   let handler=new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)
//   handler.setInputAction((click)=>{
//   let position = window.viewer.scene.pickPosition(click.position);

//   let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
//   let Lon=Cesium.Math.toDegrees(cartographic.longitude)
//   let Lat=Cesium.Math.toDegrees(cartographic.latitude)
//   let height=cartographic.height
//   console.log(Lon+","+Lat)
//       }
// ,Cesium.ScreenSpaceEventType.LEFT_CLICK)

})
const url = [`http://localhost:8080/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test%3Ashp1&maxFeatures=50&outputFormat=application%2Fjson`
,`http://localhost:8080/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test%3Ashp2&maxFeatures=50&outputFormat=application%2Fjson`
,`http://localhost:8080/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test%3Ashp3&maxFeatures=50&outputFormat=application%2Fjson`
,`http://localhost:8080/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test%3Ashp4&maxFeatures=50&outputFormat=application%2Fjson`
,`http://localhost:8080/geoserver/test/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=test%3Ashp5&maxFeatures=50&outputFormat=application%2Fjson`];

resourceShp(url[0])
resourceShp(url[1])
resourceShp(url[2])
resourceShp(url[3])
resourceShp(url[4])
function resourceShp(url){
  const resource = new Cesium.Resource({
   url: url,
});
resource.fetch().then(function(response) {
    window.viewer.scene.globe.depthTestAgainstTerrain = false
    console.log(response)

    // 假设响应对象已经是JSON格式，如果不是，可能需要调用response.json()
    if (typeof response === 'string') {
        // 如果响应是字符串，解析为JSON对象
        response = JSON.parse(response);
    }
    
    // if (response.crs && response.crs.properties.name === 'urn:ogc:def:crs:EPSG::4528') {
    //     // 假设您知道这个CRS实际上是与WGS84等效的，或者您已经将数据转换为WGS84
    //     response.crs.properties.name = 'EPSG:4326';
    // }
    Cesium.GeoJsonDataSource.load(response).then(function(dataSource) {
        // 添加数据源到window.viewer
        window.viewer.dataSources.add(dataSource);
        // 可选：调整多边形的样式
        var entities = dataSource.entities.values;
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            entity.polygon.material = Cesium.Color.RED.withAlpha(0.5); // 设置多边形颜色和透明度
            entity.polygon.outline = true; // 显示多边形轮廓
            entity.polygon.outlineColor = Cesium.Color.BLACK; // 设置多边形轮廓颜色
            // 确保没有设置clampToGround
            entity.polygon.heightReference = Cesium.HeightReference.NONE;
        }
        window.viewer.zoomTo(dataSource);
    });
}).catch(function(error) {
    // 错误处理
});
}


</script>

<template>
  <div id="cesiumContainer">
    <div @click="showMeasure = !showMeasure">
      <img id="measureButton" src="../assets/building_blue_a90.png">
      <img id="measure" src="../assets/measure.png">
      <h5 id="measureFont">测量</h5>
    </div>
    <Measure v-if="showMeasure"></Measure>
    <div @click="showVisual = !showVisual">
      <img id="analyzeButton" src="../assets/building_blue_a90.png">
      <img id="analyze" src="../assets/analyze.png">
      <h5 id="analyzeFont">分析</h5>
    </div>
    <Visual v-if="showVisual"></Visual>
    <div @click="showWeather = !showWeather">
      <img id="weatherButton" src="../assets/building_blue_a90.png">
      <img id="weather" src="../assets/weather.png">
      <h5 id="weatherFont">天气</h5>
    </div>
    <Weather v-if="showWeather"></Weather>
    <div @click="showDraw = !showDraw">
      <img id="drawButton" src="../assets/building_blue_a90.png">
      <img id="draw" src="../assets/draw.png">
      <h5 id="drawFont">标绘</h5>
    </div>
    <Draw v-if="showDraw"></Draw>
    <div @click="showAnimate = !showAnimate">
      <img id="animateButton" src="../assets/building_blue_a90.png">
      <img id="animate" src="../assets/animate.png">
      <h5 id="animateFont">特效</h5>
    </div>
    <Animate v-if="showAnimate"></Animate>
    <ThreeForm ></ThreeForm>
  </div>
</template>


<style scoped>
#cesiumContainer {
  position: relative;
  width: 100vw;
  height: 100vh;
}
#measureButton{
  position: absolute;
  top: 80px;
  right: 5px;
  width: 60px;
  height: 60px;
  z-index: 2;
  cursor: pointer;
}
#measureFont{
  position: absolute;
  top: 120px;
  right: 8px;
  width: 40px;
  height: 40px;
  z-index: 2;
  cursor: pointer;
}
#measure{
  position: absolute;
  top: 80px;
  right: 15px;
  width: 40px;
  height: 40px;
  z-index: 2;
  cursor: pointer;
}
/* #mea{
  position: absolute;
  top: 73%;
  left: 60%;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 2%;
} */
#analyzeButton{
  position: absolute;
  top: 140px;
  right: 5px;
  width: 60px;
  height: 60px;
  z-index: 2;
  cursor: pointer;
}
#analyzeFont{
  position: absolute;
  top: 180px;
  right: 8px;
  width: 40px;
  height: 40px;
  z-index: 2;
  cursor: pointer;
}
#analyze{
  position: absolute;
  top: 140px;
  right: 15px;
  width: 40px;
  height: 40px;
  z-index: 2;
  cursor: pointer;
}
#weatherButton{
  position: absolute;
  top: 200px;
  right: 5px;
  width: 60px;
  height: 60px;
  z-index: 2;
  cursor: pointer;
}
#weatherFont{
  position: absolute;
  top: 240px;
  right: 8px;
  width: 40px;
  height: 40px;
  z-index: 2;
  cursor: pointer;
}
#weather{
  position: absolute;
  top: 200px;
  right: 15px;
  width: 40px;
  height: 40px;
  z-index: 2;
  cursor: pointer;
}
#drawButton{
  position: absolute;
  top: 260px;
  right: 5px;
  width: 60px;
  height: 60px;
  z-index: 2;
  cursor: pointer;
}
#drawFont{
  position: absolute;
  top: 300px;
  right: 8px;
  width: 40px;
  height: 40px;
  z-index: 2;
  cursor: pointer;
}
#draw{
  position: absolute;
  top: 260px;
  right: 15px;
  width: 40px;
  height: 40px;
  z-index: 2;
  cursor: pointer;
}
#animateButton{
  position: absolute;
  top: 320px;
  right: 5px;
  width: 60px;
  height: 60px;
  z-index: 2;
  cursor: pointer;
}
#animateFont{
  position: absolute;
  top: 360px;
  right: 8px;
  width: 40px;
  height: 40px;
  z-index: 2;
  cursor: pointer;
}
#animate{
  position: absolute;
  top: 320px;
  right: 15px;
  width: 40px;
  height: 40px;
  z-index: 2;
  cursor: pointer;
}
</style>

