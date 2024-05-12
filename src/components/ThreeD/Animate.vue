<script setup>
import * as Cesium from 'cesium'
import {onMounted, ref} from 'vue'
// import RectangularSensorGraphics from "../../class/ThreeD/animate/xkld.js";
import CircleSpiralMaterialProperty from "../../class/ThreeD/animate/CircleSpiralMaterialProperty.js";
import CircleBlurMaterialProperty from "../../class/ThreeD/animate/CircleBlurMaterialProperty.js";
import CircleDiffuseMaterialProperty from "../../class/ThreeD/animate/CircleDiffuseMaterialProperty.js";
import CircleRippleMaterialProperty from "../../class/ThreeD/animate/CircleRippleMaterialProperty.js";
import {HexagonSpread} from "../../class/ThreeD/animate/Effect.js";
import {Scanline} from "../../class/ThreeD/animate/Effect.js";
import RadarWaveMaterialProperty from "../../class/ThreeD/animate/RadarWaveMaterialProperty.js";
import {CircleWave} from "../../class/ThreeD/animate/Effect.js";
import radarSolidScan from "../../class/ThreeD/animate/radarSolidScan.js";
let arra=[],circleWave,geo3,hexagonSpread1,geo1,geo2,geo4,  WallRegularDiffuse,scanLine1,walll,wallDataSources
let handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
function handle(){
  let handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((click)=>{
  let position = viewer.scene.pickPosition(click.position);

  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let height=cartographic.height
  console.log(Lon+","+Lat)
      }
,Cesium.ScreenSpaceEventType.LEFT_CLICK)
}
function circle1(){
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((click)=>{
  let position = viewer.scene.pickPosition(click.position);

  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let height=cartographic.height
  console.log(Lon+","+Lat)
  let circle1= window.viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(Lon,Lat),
    ellipse: {
      semiMinorAxis: 1000.0,
      semiMajorAxis: 1000.0,
      material: new CircleSpiralMaterialProperty({
        color: new Cesium.Color(1, 1, 0, 0.7),
        speed: 12.0
      })
    }
  });
  arra.push(circle1)
      }
,Cesium.ScreenSpaceEventType.LEFT_CLICK)
  // 螺旋圆特�????

    }
 function   circle2(){
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((click)=>{
  let position = viewer.scene.pickPosition(click.position);

  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let height=cartographic.height
  console.log(Lon+","+Lat)
  let circle2 = window.viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(Lon,Lat),
    name: "扩散�????",
    ellipse: {
        semiMinorAxis: 1000.0,
        semiMajorAxis: 1000.0,
        material: new CircleDiffuseMaterialProperty({
            color: new Cesium.Color(1, 1, 0, 0.7),
            speed: 12.0,
        })
    }
})
arra.push(circle2)
      }
,Cesium.ScreenSpaceEventType.LEFT_CLICK)

}
function circle3(){
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
// 模糊圆特�????
handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((click)=>{
  let position = viewer.scene.pickPosition(click.position);

  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let height=cartographic.height
  console.log(Lon+","+Lat)
  let  circle3 =window.viewer.entities.add({
   position: Cesium.Cartesian3.fromDegrees(Lon,Lat),
   name: "模糊�????",
   ellipse: {
       semiMinorAxis: 1000.0,
       semiMajorAxis: 1000.0,
       material: new CircleBlurMaterialProperty({
           color: new Cesium.Color(1, 1, 0, 0.7),
           speed: 12.0,
       })
   }
})
arra.push(circle3)
      }
,Cesium.ScreenSpaceEventType.LEFT_CLICK)

}
function circle4() {
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((click)=>{
  let position = viewer.scene.pickPosition(click.position);

  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let height=cartographic.height
  console.log(Lon+","+Lat)
  let rectangle = window.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(Lon,Lat),
        name: "波纹长方�??",
        rectangle: {
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            coordinates: Cesium.Rectangle.fromDegrees(104.2451358628085,30.54374948029245,104.22225143964215,30.577411507497928),
            material: new CircleRippleMaterialProperty({
                color: new Cesium.Color(1, 1, 0, 0.7),
                speed: 12.0,
                count: 4,
                gradient: 0.2
            })
        }
    });
    arra.push(rectangle);
      }
,Cesium.ScreenSpaceEventType.LEFT_CLICK)

}
function circle5(){
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((click)=>{
  let position = viewer.scene.pickPosition(click.position);

  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let height=cartographic.height
  console.log(Lon+","+Lat)
  let circle5= window.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        Lon,Lat
      ),
      name: "轨迹球体",
      ellipsoid: {
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, 
        radii: new Cesium.Cartesian3(100.0, 100.0, 100.0),
        material: new EllipsoidTrailMaterialProperty({
          color: new Cesium.Color(1.0, 1.0, 0.0, 0.7),
          speed: 10.0,
        }),
      },
    });
    arra.push(circle5)
      }
,Cesium.ScreenSpaceEventType.LEFT_CLICK)
    // // // 轨迹球体

}
function radar1(){
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((click)=>{
  let position = viewer.scene.pickPosition(click.position);

  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let height=cartographic.height
  console.log(Lon+","+Lat)
  // 波纹雷达
  let radar1= window.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(Lon,Lat),
      name: '波纹雷达',
      ellipse: {
          semiMajorAxis: 1000.0,
          semiMinorAxis: 1000.0,
          material: new RadarWaveMaterialProperty({
              color: new Cesium.Color(1.0, 1.0, 0.0, 0.7),
              speed: 20.0
          })
      }
  })
  arra.push(radar1)
      }
,Cesium.ScreenSpaceEventType.LEFT_CLICK)

}
function radar2(){
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((click)=>{
  let position = viewer.scene.pickPosition(click.position);

  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let height=cartographic.height
  console.log(Lon+","+Lat)
  // 波纹雷达
    // // 雷达扫描
    let radar2= window.viewer.entities.add({
      position: Cesium.Cartesian3.fromDegrees(
        Lon,Lat
      ),
      name: "雷达扫描",
      ellipse: {
        semiMajorAxis: 300.0,
        semiMinorAxis: 300.0,
        material: new RadarScanMaterialProperty({
          color: new Cesium.Color(1.0, 0.0, 0.0, 0.3),
          speed: 20.0,
        }),
        height: 1,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        outline: true,
        outlineColor: new Cesium.Color(1.0, 0.0, 0.0, 0.5),
      },
    });
    arra.push(radar2)
      }
,Cesium.ScreenSpaceEventType.LEFT_CLICK)

}
function radar3(){
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((click)=>{
  let position = viewer.scene.pickPosition(click.position);

  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let height=cartographic.height
  console.log(Lon+","+Lat)
  let rader = window.viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(Lon,Lat),
    name: '扫描雷达',
    ellipse: {
        semiMajorAxis: 100.0,
        semiMinorAxis: 100.0,
        material: new ImageMaterialProperty({
            image: 'radar_white.png',
            color: new Cesium.Color(1.0, 1.0, 0.0, 0.7),
        }),
        // 不设置高度则无法渲染外框�????
        height: 20.0,
        heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
        outline: true,
        outlineColor: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
    }
});
arra.push(rader);
      }
,Cesium.ScreenSpaceEventType.LEFT_CLICK)
    // 图片雷达

// function rotateMaterial(rader.ellipse, 0, -3);

// function rotateMaterial(instance, _stRotation, _amount) {
//     instance.stRotation = new Cesium.CallbackProperty(function() {
//         _stRotation += _amount;
//         if (_stRotation >= 360 || _stRotation <= -360) {
//             _stRotation = 0;
//         }
//         return Cesium.Math.toRadians(_stRotation);
//     }, false)
// }
}
function radar4(){

}
function spread1(){

if(geo3==1){
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((click)=>{
  let position = viewer.scene.pickPosition(click.position);

  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let height=cartographic.height
  console.log(Lon+","+Lat)
//  水波纹扩�????
circleWave = new CircleWave(window.viewer, "cirCleWave1");
 circleWave.add([Lon,Lat, 0], '#1FA8E3', 500, 10000);
      }
,Cesium.ScreenSpaceEventType.LEFT_CLICK)
    
}
geo3=0


}
function spread2(){
  
    // 正多边形扩散
    if(geo4==1){
      handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
      handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((click)=>{
  let position = viewer.scene.pickPosition(click.position);

  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let height=cartographic.height
  console.log(Lon+","+Lat)
  WallRegularDiffuse= new WallRegularDiffuse({
      viewer: window.viewer,
      center: [Lon,Lat],
      radius: 200.0,
      edge: 10,
      height: 800,
      speed: 10.0,
      minRadius: 0,
    });
}
,Cesium.ScreenSpaceEventType.LEFT_CLICK)

    }

    geo4=0
}
function spread3(){
   // 六边形扩�????
if(geo1==1){
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((click)=>{
  let position = viewer.scene.pickPosition(click.position);

  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let height=cartographic.height
  console.log(Lon+","+Lat)
  hexagonSpread1 = new HexagonSpread(window.viewer, "hexagonSpred1");
hexagonSpread1.add([Lon,Lat, 0], '#0099BF', 1000, 7500)

}
,Cesium.ScreenSpaceEventType.LEFT_CLICK)

}
geo1=0

}
function spread4(){
  if(geo2==1){
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  //   // 线圈发光扩散
  handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((click)=>{
  let position = viewer.scene.pickPosition(click.position);

  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let height=cartographic.height
  console.log(Lon+","+Lat)
  scanLine1 = new Scanline(window.viewer, "scanLine1");
scanLine1.add([Lon,Lat, 0], "#CE1374", 1200, 5005);
  
}
,Cesium.ScreenSpaceEventType.LEFT_CLICK)

}

geo2=0
}
function wall1(){
  if(walll==1){
    handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
    handler=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
  handler.setInputAction((click)=>{
  let position = viewer.scene.pickPosition(click.position);

  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let height=cartographic.height
  console.log(Lon+","+Lat)
  let positions = [
          104.13916825826567, 30.677270997243266, 104.138853044895086,
          30.677358411114799, 104.139724051870857, 30.678262597230248,
          104.139906999831865, 30.678349681457433, 104.140443131180064,
          30.678496483236284, 104.140738874568939, 30.677793186223067,
          104.13916825826567, 30.677270997243266,
        ];
        positions = Cesium.Cartesian3.fromDegreesArray(positions);
        wallDataSources = new Cesium.CustomDataSource("wallDataSources");
        window.viewer.dataSources.add(wallDataSources);
        const wallDs = wallDataSources.entities;
        wallDs.add({

          name: "立体墙效�????",
          wall: {
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, 
            positions: positions,
            // 设置高度
            maximumHeights: new Array(positions.length).fill(550),
            minimunHeights: new Array(positions.length).fill(500),
            material: new DynamicWallMaterialProperty({
              viewer: window.viewer,
              color: Cesium.Color.fromBytes(255, 0, 0).withAlpha(0.7),
              duration: 1000,
            }),
          },
        });
}
,Cesium.ScreenSpaceEventType.LEFT_CLICK)

  }
  walll=0
  // //立体墙效�????

}
function removeGeo(){
  if(scanLine1){
    scanLine1.remove()
  }
  if(hexagonSpread1){
    hexagonSpread1.remove()
  }
  if(WallRegularDiffuse){
    WallRegularDiffuse.remove()
  }  
  if(circleWave){
    circleWave.remove()
  }
  window.viewer.dataSources.remove(wallDataSources);
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
  walll=1
geo1=1
geo2=1
geo3=1
geo4=1
  for (let i = 0; i < arra.length; i++) {
        window.viewer.entities.remove(arra[i])
      }
}

</script>

<template>
      <el-card class="box-card" id="ani">
          <div>
            <p style="text-align:center">特效图形</p>
            <el-button type="primary" size="mini" @click="circle1"
              >螺旋圆</el-button
            >
            <el-button
                type="primary"
                size="mini"
                @click="circle2"
                >扩散圆</el-button
              >
            <el-button
                type="primary"
                size="mini"
                @click="circle3"
                >模糊圆</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="circle4"
                >波纹圆</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="spread1"
                >水波纹扩</el-button
              >
              <br />
              <br />
              <el-button
                type="primary"
                size="mini"
                @click="spread2"
                >正多边形扩散</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="spread3"
                >六边形扩散</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="spread4"
                >线圈发光扩散</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="radar1"
                >波纹雷达</el-button
              >
              <br />
              <br />
              <el-button
                type="primary"
                size="mini"
                @click="radar2"
                >全覆盖雷达</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="radar3"
                >扫描雷达</el-button
              >

              <el-button type="primary" size="mini" @click="circle5"
              >轨迹球体</el-button
            >
            <el-button type="primary" size="mini" @click="wall1"
              >立体多边形</el-button
            >
            <el-button
                type="primary"
                size="mini"
                @click="removeGeo"
                >清除</el-button
              >
          </div>
      </el-card>
</template>


<style scoped>
#ani{
  position: absolute;
  top: 66%;
  left: 53%;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 2%;
}
</style>

