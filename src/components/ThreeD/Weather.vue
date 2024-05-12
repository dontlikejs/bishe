<script setup>
import * as Cesium from 'cesium'
import * as dat from 'dat.gui'
import {onMounted, ref} from 'vue'
import weather from "../../class/ThreeD/weather.js"

import CircleRippleMaterialProperty from "../../class/ThreeD/waterPrimitive.js";

let r=1,WEATHER,collection,HeightFog

function Rain() {
      if (r == 1) {
        WEATHER = new weather({
          viewer: window.viewer,
        });
        r++;
      }
      WEATHER.Rain();
}

function Snow() {
      if (r == 1) {
        WEATHER = new weather({
          viewer: window.viewer,
        });
        r++;
      }
      WEATHER.Snow();

}
    //雾特�????
function Fog() {
      if (r == 1) {
        WEATHER = new weather({
          viewer: window.viewer,
        });
        r++;
      }
      WEATHER.Fog();
}
function addWater(){
  let rectangle = window.viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(104.24175132307745,30.55556010862642),
        name: "波纹长方�??",
        rectangle: {
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
            coordinates: Cesium.Rectangle.fromDegrees(104.13287207187892, 28.670880909895337, 106.14287207187892, 31.680880909895337),
            material: new CircleRippleMaterialProperty({
                color: new Cesium.Color(1, 1, 0, 0.7),
                speed: 12.0,
                count: 4,
                gradient: 0.2
            })
        }
    });
}
function addSnow(){
  // Cesium.ExperimentalFeatures.enableModelExperimental = true;
  let customShader1 = new Cesium.CustomShader({
     lightingModel: Cesium.LightingModel.UNLIT,
     fragmentShaderText: `
         void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material)
         {
             vec3 normalEC = fsInput.attributes.normalEC;
             vec3 normalMC = czm_inverseNormal * normalEC;
             vec3 color = material.diffuse;
             vec3 white = vec3(1.0,.0,1.0);
             float m = dot(normalMC, vec3(0.0,0.0,1.0));
             m = pow(m,5.0);
             material.diffuse = mix(color, white, clamp(m,0.0,1.0) * 0.5);
         }
         `,
  });
  window.modelPromise.customShader = customShader1
}
function addHeightFog(){

      window.viewer.scene.globe.depthTestAgainstTerrain = true; //默认为false
      let camera = window.viewer.scene.camera
      let a = Cesium.Cartesian3.magnitude(camera.positionWC) - camera.positionCartographic.height;

      collection = window.viewer.scene.postProcessStages;
      HeightFog = new Cesium.PostProcessStage({
        fragmentShader: `
        uniform sampler2D depthTexture;
        uniform sampler2D colorTexture;
        varying vec2 v_textureCoordinates;
        uniform float earthRadius;
        void main() {
            float altitude = 0.0;
            float depth = czm_unpackDepth(texture2D(depthTexture, v_textureCoordinates));
            if (depth == 0.0) {
              altitude = czm_infinity;
            }
            vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth);
            float distance = -eyeCoordinate.z / eyeCoordinate.w;
            vec4 worldCoordinate4 = czm_inverseView * eyeCoordinate;
            vec3 worldCoordinate = worldCoordinate4.xyz / worldCoordinate4.w;
            altitude = length(worldCoordinate.xyz) - earthRadius;
            // 根据高度计算雾的颜色 
            float factor = (0. - altitude) / (0. - 40.);

            // 获取原始颜色 
            vec4 fog = vec4(.5,.5,.5,1.);

            vec4 originalColor = texture2D(colorTexture, v_textureCoordinates);
            vec4 fogColor = mix(originalColor, fog, fog.a);
            // 将雾的颜色和原始颜色混合在一起 
            
            gl_FragColor = mix(fogColor, originalColor, mix(1., factor, 1.));

        }
            `,
            uniforms : {
              scale : 1.1,
              earthRadius : a
            }
      });
      collection.add(HeightFog);
      window.viewer.scene.postUpdate.addEventListener(function () {
      a = Cesium.Cartesian3.magnitude(camera.positionWC) - camera.positionCartographic.height;
    });

  }
function clearWeather(){
  WEATHER.removeAll();
  collection.remove(HeightFog);
}
</script>

<template>
    <el-card class="box-card" id="mea">
          <div>
            <p style="text-align:center">天气效果</p>
            <el-button type="primary" size="mini" @click="Rain"
              >雨天模拟</el-button
            >
              <el-button type="primary" size="mini" @click="Snow"
              >雪天模拟</el-button
            >
            <el-button type="primary" size="mini" @click="Fog"
              >雾天模拟</el-button
            >
            <br />
            <br />
            <el-button type="primary" size="mini" @click="addWater"
              >涟漪水面</el-button
            >
            <el-button type="primary" size="mini" @click="addSnow"
              >建筑积雪</el-button
            >
            <el-button type="primary" size="mini" @click="addHeightFog"
              >高度雾气</el-button
            >
            <el-button
                type="primary"
                size="mini"
                @click="clearWeather"
                >清除</el-button
              >
          </div>
    </el-card> 
</template>


<style scoped>
#mea{
  position: absolute;
  top: 73%;
  left: 60%;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 2%;
}
</style>

