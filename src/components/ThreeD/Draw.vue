<script setup>
import * as Cesium from 'cesium'
import {onMounted, ref} from 'vue'
import DrawAttackArrow from "../../class/ThreeD/paint/DrawAttackArrow.js"
import DrawBillboard from "../../class/ThreeD/paint/DrawBillboard.js"
import DrawCircle from "../../class/ThreeD/paint/DrawCircle.js"
import DrawPincerArrow from "../../class/ThreeD/paint/DrawPincerArrow.js"
import DrawCurve from "../../class/ThreeD/paint/DrawCurve.js"
import DrawPoint from "../../class/ThreeD/paint/DrawPoint.js"
import DrawPolygon from "../../class/ThreeD/paint/DrawPolygon.js"
import DrawPolyline from "../../class/ThreeD/paint/DrawPolyline.js"
import DrawRectangle from "../../class/ThreeD/paint/DrawRectangle.js"
import DrawstraightArrow from "../../class/ThreeD/paint/DrawstraightArrow.js"

let selectedButton,drawPoint,mmm,nnn,destroyn,drawPolyline,drawPolygon,bbb,drawRectangle,drawCircle,drawstraightArrow,drawCurve,drawBillboard,drawAttackArrow,drawPincerArrow

function selectButton(button) {
            window.viewer.scene.globe.depthTestAgainstTerrain = true
            selectedButton = button;
            switch(button) {
            case 1:
            destroy()
            if(!drawPoint){
                drawPoint =new DrawPoint({
                  Cesium:Cesium,
                  viewer:window.viewer
                })
              }
              mmm=1
              destroyn=1
              drawPoint.startCreate()
                break;
            case 2:
            destroy()
              if(! drawPolyline){
                drawPolyline   =new   DrawPolyline  ({
                  Cesium:Cesium,
                  viewer:window.viewer
                })
              }
              nnn=2
              destroyn=2
              drawPolyline.startCreate()
                break;
            case 3:
            destroy()
            if(! drawPolygon){

                drawPolygon =new  DrawPolygon     ({
                  Cesium:Cesium,
                  viewer:window.viewer
                })
              }
              bbb=3
              destroyn=3
              drawPolygon.startCreate()
              break;
              case 4:
              destroy()
              if(! drawRectangle){
                drawRectangle   =new  DrawRectangle  ({
                  Cesium:Cesium,
                  viewer:window.viewer
                })
              }

              destroyn=4
              drawRectangle.startCreate()
              break;
              case 5:
              destroy()
              if(!drawCircle){
                drawCircle =new   DrawCircle    ({
                  Cesium:Cesium,
                  viewer:window.viewer
                })
              }
              destroyn=5

              drawCircle.startCreate()
              break;
              case 6:
              destroy()
              if(! drawstraightArrow){
                drawstraightArrow  =new  DrawstraightArrow     ({
                  Cesium:Cesium,
                  viewer:window.viewer
                })
              }

              destroyn=6
              drawstraightArrow.startCreate()
              break;
              case 7:
              destroy()
              if(!drawCurve){
                drawCurve  =new        DrawCurve     ({
                  Cesium:Cesium,
                  viewer:window.viewer
                })
              }

              destroyn=7
              drawCurve.startCreate()
              break;
              case 8:
              destroy()
              if(!drawBillboard){
                drawBillboard=new DrawBillboard     ({
                  Cesium:Cesium,
                  viewer:window.viewer
                })
              }

              destroyn=8
              drawBillboard.startCreate()
              break;
              case 9:
              destroy()
              if(!drawAttackArrow){
                drawAttackArrow=new DrawAttackArrow  ({
                  Cesium:Cesium,
                  viewer:window.viewer
                })
              }

              destroyn=9
              drawAttackArrow.startCreate()
              break;
              case 10: 
              destroy()
            if(!drawPincerArrow){
                drawPincerArrow  =new   DrawPincerArrow     ({
                  Cesium:Cesium,
                  viewer:window.viewer
                })
              }
              destroyn=10
              drawPincerArrow.startCreate()
              break;
        } 

}
function destroy(){
      switch (destroyn){
        case 1:
      drawPoint.destroy()
        break;
      case 2:
      drawPolyline.destroy()
        break;
     case 3:
      drawPolygon.destroy()
      break;
      case 4:

      drawRectangle.destroy()
      break;
      case 5:
      drawCircle.destroy()
      break;
      case 6:
      drawstraightArrow.destroy()
      break;
      case 7:
      drawCurve.destroy()
      break;
      case 8:
      drawBillboard.destroy()
      break;
      case 9:
      drawAttackArrow.destroy()
      break;
      case 10:   
      drawPincerArrow.destroy()
      break;
      }
}
function clearDraw(){
      if(drawPoint){
        drawPoint.clear()
      }
      if(drawPolyline){
        drawPolyline.clear()
      }
      if(drawRectangle){
        drawRectangle.clear()
      }
      if(drawPolygon){
        drawPolygon.clear()
      }
      if(drawCircle){
        drawCircle.clear()
        drawCircle.clearPoint()
      }
      if(drawstraightArrow){
        drawstraightArrow.clear()
        drawstraightArrow.clearPoint()
      }
      if(drawPincerArrow){
        drawPincerArrow.clear()
        drawPincerArrow.clearPoint()
      }
      if(drawAttackArrow){
        drawAttackArrow.clear()
        drawAttackArrow.clearPoint()
      }
      if(drawBillboard){
        drawBillboard.clear()
      }
      if(drawCurve){
        drawCurve.clear()
      }
      destroy()
      mmm=0
      nnn=0
      bbb=0
      // if(){
        
      // }
      // if(){
        
      // }
      // if(){
        
      // }
    }
</script>

<template>
      <el-card class="box-card" id="draww">
          <div>
            <p style="text-align:center">标绘工具</p>
              <el-button type="primary" size="mini" @click="selectButton(1)"
              >点</el-button
            >
            <el-button type="primary" size="mini" @click="selectButton(2)"
              >线</el-button
            >
            <el-button type="primary" size="mini" @click="selectButton(5)"
              >圆</el-button
            >
            <el-button type="primary" size="mini" @click="selectButton(8)"
              >图标打点</el-button
            >
            <br />
              <br />
            <el-button type="primary" size="mini" @click="selectButton(4)"
              >矩形</el-button
            >
            <el-button type="primary" size="mini" @click="selectButton(3)"
              >多边形</el-button
            >
            <el-button type="primary" size="mini" @click="selectButton(7)"
              >弧线</el-button
            >
            <el-button type="primary" size="mini" @click="selectButton(1)"
              >xxx</el-button
            >
            <br />
              <br />
              <el-button type="primary" size="mini" @click="selectButton(6)"
              >径直箭头</el-button
            >
            <el-button type="primary" size="mini" @click="selectButton(9)"
              >攻击箭头</el-button
            >
            <el-button type="primary" size="mini" @click="selectButton(10)"
              >钳击箭头</el-button
            >
            <el-button
                type="primary"
                size="mini"
                @click="clearDraw"
                >清除</el-button
              >
          </div>
      </el-card>
</template>


<style scoped>
#draww{
  position: absolute;
  top: 63%;
  left: 60%;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 2%;
}
</style>

