<script setup>
import * as Cesium from 'cesium'
import * as dat from 'dat.gui'
import {onMounted, ref} from 'vue'
import Visual1 from "../../class/ThreeD/visual1.js"
import ViewShedStage from "../../class/ThreeD/ViewShedStage.js";
import SplitCircle from "../../class/ThreeD/splitCircle.js";
import heightLimit from "../../class/ThreeD/heightLimit.js";
import measure from "../../class/ThreeD/measure.js";
let handler1,ViewShed,visual1,splitCircle,mnb=1,heightL
let profileChart
let proJudge=true
let measureTool
let skylineAnayStages,silhouette
onMounted(()=>{
  console.log(window.viewer)
  profileChart=document.getElementById('profileChart')
  measureTool = new measure({
  viewer: window.viewer,
  profileChart,
  proJudge:proJudge
});
})
function visual(){
          let kkk=1
          let viewPosition
          viewer.scene.globe.depthTestAgainstTerrain = true
          handler1=new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
          handler1.setInputAction((click)=>{
          let position = viewer.scene.pickPosition(click.position);
          let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
          if(ViewShed){
            ViewShed.clear()
          }
        if(kkk==1){
          viewPosition=position
        }
        if(kkk==2){
          let  viewPositionEnd=position
          const options={
              viewPosition,
              viewPositionEnd
            }
          ViewShed= new ViewShedStage(viewer,options)
          kkk=0
          handler1.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
        }
        kkk+=1

              }
        ,Cesium.ScreenSpaceEventType.LEFT_CLICK)

         

   
              
}
function visual3(){
    //     if(visual1){
    //   visual1.clear()
    // }
    visual1= new Visual1({
      viewer:viewer
    })
    visual1.visual()

}
function visual2(){
    //     if(splitCircle){
    //   splitCircle.clear()
    // }
    splitCircle= new SplitCircle({
      viewer:viewer
    })

    splitCircle.activate()
}
function hLimit(){
        if(mnb==1){
        var controlers = {
          height: 0,
        };
        var gui = new dat.GUI();
        let ee=document.getElementById('guiContainer1')
        ee.appendChild(gui.domElement);
        var folder = gui.addFolder("菜单");
        var heightparam = folder.add(controlers, "height", 0, 120);
        heightparam.onChange((param) => {
          let a= Number(param)
          if(heightL){
            // heightL.setHeight(a)
            heightL.remove()
            heightL.addPrimitive(a)
          }
        });
        mnb++
        folder.open();
      }
      let ee=document.getElementById('guiContainer1')
      ee.style.display='block'
      heightL= new heightLimit({
        viewer: viewer,
        data: [
        104.25867664106855,30.564192735754133,104.22643723828317,30.575762522994133,104.2149102138529,30.555152180460134,104.24673860613925,30.541602500426077
        ],
        style: {
          color: 'pink',
          alpha: 0.5,
        }
      })
      heightL.addPrimitive(0)
}
function Profile(){
    alert('左键选取点，右键结束');
    measureTool.changeP();
    measureTool.distance(0);
}
function skyAna(){
      skylineAnayStages = window.viewer.scene.postProcessStages;
      const edgeFs = `
        uniform sampler2D depthTexture;
        uniform float length;
        uniform vec4 color;
        uniform float customWidth;
        
        varying vec2 v_textureCoordinates;
        
        void main(void)
        {
            float directions[3];
            directions[0] = -1.0;
            directions[1] = 0.0;
            directions[2] = 1.0;
        
            float scalars[3];
            scalars[0] = 3.0;
            scalars[1] = 10.0;
            scalars[2] = 3.0;
            float czm_pixelRatio_width = float(customWidth);
            float padx = czm_pixelRatio_width / czm_viewport.z;
            float pady = czm_pixelRatio_width / czm_viewport.w;
        
        #ifdef CZM_SELECTED_FEATURE
            bool selected = false;
            for (int i = 0; i < 3; ++i)
            {
                float dir = directions[i];
                selected = selected || czm_selected(vec2(-padx, dir * pady));
                selected = selected || czm_selected(vec2(padx, dir * pady));
                selected = selected || czm_selected(vec2(dir * padx, -pady));
                selected = selected || czm_selected(vec2(dir * padx, pady));
                if (selected)
                {
                    break;
                }
            }
            if (!selected)
            {
                gl_FragColor = vec4(color.rgb, 0.0);
                return;
            }
        #endif
        
            float horizEdge = 0.0;
            float vertEdge = 0.0;
        
            for (int i = 0; i < 3; ++i)
            {
                float dir = directions[i];
                float scale = scalars[i];
                // 左侧
                horizEdge -= texture2D(depthTexture, v_textureCoordinates + vec2(-padx, dir * pady)).x * scale;
                // 右侧
                horizEdge += texture2D(depthTexture, v_textureCoordinates + vec2(padx, dir * pady)).x * scale;
                
                vertEdge -= texture2D(depthTexture, v_textureCoordinates + vec2(dir * padx, -pady)).x * scale;
                vertEdge += texture2D(depthTexture, v_textureCoordinates + vec2(dir * padx, pady)).x * scale;
            }
        
            float len = sqrt(horizEdge * horizEdge + vertEdge * vertEdge);
            gl_FragColor = vec4(color.rgb, len > length ? color.a : 0.0);
      }`
      const myOwnEdgeDetection = new Cesium.PostProcessStage({
        name:'skt',
        fragmentShader: edgeFs,
        uniforms: {
          length: 0.5,
          color: Cesium.Color.BLACK,
          customWidth: 2.0,
        }
      })
      const postProccessStage = new Cesium.PostProcessStage({
        //unform着色器对象 textureScale
        fragmentShader: 'uniform sampler2D colorTexture;' +
            'uniform sampler2D depthTexture;' +
            'varying vec2 v_textureCoordinates;' +
            'void main(void)' +
            '{' +
            'float depth = czm_readDepth(depthTexture, v_textureCoordinates);' +
            'vec4 color = texture2D(colorTexture, v_textureCoordinates);' +
            'if(depth<1.0 - 0.000001){' +
            'gl_FragColor = color;' +
            '}' +
            'else{' +
            'gl_FragColor = vec4(1.0,0.0,0.0,1.0);' +
            '}' +
            '}'
      });
      const postProccesStage_1 = new Cesium.PostProcessStage({
        fragmentShader: 'uniform sampler2D colorTexture;' +
            'uniform sampler2D redTexture;' +
            'uniform sampler2D silhouetteTexture;' +
            'varying vec2 v_textureCoordinates;' +
            'void main(void)' +
            '{' +
            'vec4 redcolor=texture2D(redTexture, v_textureCoordinates);' +
            'vec4 silhouetteColor = texture2D(silhouetteTexture, v_textureCoordinates);' +
            'vec4 color = texture2D(colorTexture, v_textureCoordinates);' +
            'if(redcolor.r == 1.0){' +
            'gl_FragColor = mix(color, vec4(5.0,0.0,0.0,1.0), silhouetteColor.a);' +
            '}' +
            'else{' +
            'gl_FragColor = color;' +
            '}' +
            '}',
        //uniform着色器对象
        uniforms: {
          redTexture:  postProccessStage.name,
          silhouetteTexture: myOwnEdgeDetection.name
        }
      });
      silhouette = new Cesium.PostProcessStageComposite({
        stages: [myOwnEdgeDetection, postProccessStage, postProccesStage_1],
        inputPreviousStageTexture: false,
        uniforms: myOwnEdgeDetection.uniforms
      })
      skylineAnayStages.add(silhouette);
}
function clearVisual(){
      if(ViewShed){
        ViewShed.clear()
      }
      if(splitCircle){
        splitCircle.clear()
      }
      if(visual1){
        visual1.clear()
      }
      let ee=document.getElementById('guiContainer1')
      ee.style.display = "none"
      if(heightL){
        heightL.remove()
      }
      measureTool.clearAll()
      profileChart.style.zIndex = -1;
      if(skylineAnayStages){
        skylineAnayStages.remove(silhouette);
      }
}
</script>

<template>
    <div ref="guiContainer1" class="guiContainer1" id="guiContainer1"></div>
    <div ref="profileChart" id="profileChart"></div>
    <el-card class="box-card" id="mea">
          <div>
            <p style="text-align:center">分析工具</p>
            <el-button type="primary" size="mini" @click="visual"
              >建筑通视</el-button
            >
              <el-button type="primary" size="mini" @click="visual3"
              >地形通视</el-button
            >
            <el-button type="primary" size="mini" @click="visual2"
              >圆形通视</el-button
            >
            <br />
            <br />
            <el-button type="primary" size="mini" @click="hLimit"
              >高程分析</el-button
            >
            <el-button type="primary" size="mini" @click="Profile"
              >剖面分析</el-button
            >
            <el-button type="primary" size="mini" @click="skyAna"
              >天际线分析</el-button
            >
            <el-button
                type="primary"
                size="mini"
                @click="clearVisual"
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
#guiContainer1{
  position: absolute;
  z-index: 50;
  top: 0.5%;
  left: 77.5%;
  display: none;
}
#profileChart{
  position: absolute;
  z-index: -1;
  top: 40.5%;
  left: 16.3%;
  width: 500px;
  height: 310px;
}
</style>

