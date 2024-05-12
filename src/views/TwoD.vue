<template>
		<div id="mapView" class="mapView">
      <div id="chart1" ></div>
      <a-button @click="closeChart" id="chart1_button" >关闭</a-button>
      <div id="measure">
        <button class="esri-icon-globe esri-widget esri-widget--button esri-interactive" @click="toThreeD"></button>
        <button class="esri-icon-polyline esri-widget esri-widget--button esri-interactive" title="wer" @click="drawLine(view,lineLayer)"></button>
        <button class="esri-icon-polygon esri-widget esri-widget--button esri-interactive" @click="drawPolygon(view,polygonLayer)"></button>
        <button class="esri-icon-table esri-widget esri-widget--button esri-interactive" @click="showLayer"></button>
        <button class="esri-icon-media esri-widget esri-widget--button esri-interactive" @click="swipe"></button>
      </div>
  <div id="enjoy-css">
    <div id="checkFont">
      <!-- <h5>遥感影像</h5>
      <h5>局部矢�?</h5>
      <h5>整体矢量</h5> -->
      <h5>遥感</h5>
      <h5>局�?</h5>
      <h5>整体</h5>
    </div>

    <a-form  id="check">
      <!-- <a-form-item label="唐山曹妃甸经济技术开发区" id="layer1" style="margin: 0px;"> -->
      <a-form-item label="唐山经济技术开发区" id="layer1" style="margin: 0px;padding: 0px;">
        <a-checkbox name="type" id="layer11" v-model:checked="state.check11" style="margin-left: 5px;"></a-checkbox>
        <a-checkbox name="type" id="layer12" v-model:checked="state.check12" style="margin-left: 15px;"></a-checkbox>
        <a-checkbox name="type" id="layer13" v-model:checked="state.check13" style="margin-left: 15px;"></a-checkbox>
        <a-button @click="() => goToLayer([39603591.85559774,4306998.635729584,39662204.327045925,4355838.120180096],4527,view)" style="margin-left: 15px;">定位</a-button>
      </a-form-item>
      <a-form-item label="武汉经济技术开发区" id="layer2" style="margin:0px">
        <a-checkbox name="type" id="layer21" v-model:checked="state.check21" style="margin-left: 5px;"></a-checkbox>
        <a-checkbox name="type" id="layer22" v-model:checked="state.check22" style="margin-left: 15px;"></a-checkbox>
        <a-checkbox name="type" id="layer23" v-model:checked="state.check23" style="margin-left: 15px;"></a-checkbox>
        <a-button @click="() => goToLayer([38509351.349480346,3369125.9215750205,38524004.46734239,3378510.788633632],4526,view)" style="margin-left: 15px;">定位</a-button>
      </a-form-item>
      <a-form-item label="成都经济技术开发区" id="layer3">
        <a-checkbox name="type" id="layer31" v-model:checked="state.check31" style="margin-left: 5px;"></a-checkbox>
        <a-checkbox name="type" id="layer32" v-model:checked="state.check32" style="margin-left: 15px;" disabled></a-checkbox>
        <a-checkbox name="type" id="layer33" v-model:checked="state.check33" style="margin-left: 15px;" disabled></a-checkbox>
        <a-button @click="() => goToLayer([35419064.14450003,3374737.753952593,35433717.26236208,3389085.465970963],4523,view)" style="margin-left: 15px;">定位</a-button>
      </a-form-item>
      <a-form-item label="德阳经济技术开发区" id="layer4">
        <a-checkbox name="type" id="layer41" v-model:checked="state.check41" style="margin-left: 5px;"></a-checkbox>
        <a-checkbox name="type" id="layer42" v-model:checked="state.check42" style="margin-left: 15px;" disabled></a-checkbox>
        <a-checkbox name="type" id="layer43" v-model:checked="state.check43" style="margin-left: 15px;" disabled></a-checkbox>
        <a-button @click="() => goToLayer([35435288.82994539,3432745.776386071,35446849.713640206,3447398.8942481177],4523,view)" style="margin-left: 15px;">定位</a-button>
      </a-form-item>
      <a-form-item label="绵阳经济技术开发区" id="layer5">
        <a-checkbox name="type" id="layer51" v-model:checked="state.check51" style="margin-left: 5px;"></a-checkbox>
        <a-checkbox name="type" id="layer52" v-model:checked="state.check52" style="margin-left: 15px;"></a-checkbox>
        <a-checkbox name="type" id="layer53" v-model:checked="state.check53" style="margin-left: 15px;"></a-checkbox>
        <a-button @click="() => goToLayer([35474962.957825616,3470310.695158392,35485474.008932784,3484963.813020439],4523,view)" style="margin-left: 15px;">定位</a-button>
      </a-form-item>
      <a-form-item label="广元经济技术开发区" id="layer6">
        <a-checkbox name="type" id="layer61" v-model:checked="state.check61" style="margin-left: 5px;"></a-checkbox>
        <a-checkbox name="type" id="layer62" v-model:checked="state.check62" style="margin-left: 15px;" disabled></a-checkbox>
        <a-checkbox name="type" id="layer63" v-model:checked="state.check63" style="margin-left: 15px;" disabled></a-checkbox>
        <a-button @click="() => goToLayer([35558905.02649106,3573407.436581981,35585462.60962206,3602713.672306075],4523,view)" style="margin-left: 15px;">定位</a-button>
      </a-form-item>
      <a-form-item label="遂宁经济技术开发区" id="layer7">
        <a-checkbox name="type" id="layer71" v-model:checked="state.check71" style="margin-left: 5px;"></a-checkbox>
        <a-checkbox name="type" id="layer72" v-model:checked="state.check72" style="margin-left: 15px;" disabled></a-checkbox>
        <a-checkbox name="type" id="layer73" v-model:checked="state.check73" style="margin-left: 15px;" disabled></a-checkbox>
        <a-button @click="() => goToLayer([35537908.37473824,3362333.8228704324,35567214.61046233,3391105.5983680915],4523,view)" style="margin-left: 15px;">定位</a-button>
      </a-form-item>
      <!-- <a-form-item label="锦州七里河经济开发区" id="layer8"> -->
      <a-form-item label="锦州经济技术开发区" id="layer8">
        <a-checkbox name="type" id="layer81" v-model:checked="state.check81" style="margin-left: 5px;"></a-checkbox>
        <a-checkbox name="type" id="layer82" v-model:checked="state.check82" style="margin-left: 15px;"></a-checkbox>
        <a-checkbox name="type" id="layer83" v-model:checked="state.check83" style="margin-left: 15px;"></a-checkbox>
        <a-button @click="() => goToLayer([40600864.41565077,4574513.4762480585,40608190.97458179,4581038.344839429],4528,view)" style="margin-left: 15px;">定位</a-button>
      </a-form-item>
      <!-- <a-form-item label="河北迁安高新技术产业开发区" id="layer9"> -->
      <a-form-item label="迁安技术产业开发区" id="layer9">
        <a-checkbox name="type" id="layer91" v-model:checked="state.check91" style="margin-left: 5px;"></a-checkbox>
        <a-checkbox name="type" id="layer92" v-model:checked="state.check92" style="margin-left: 15px;"></a-checkbox>
        <a-checkbox name="type" id="layer93" v-model:checked="state.check93" style="margin-left: 15px;"></a-checkbox>
        <a-button @click="() => goToLayer([40386432.92831738,4425772.877103163,40397001.24302025,4440425.994965211],4528,view)" style="margin-left: 15px;">定位</a-button>
      </a-form-item>
    </a-form>
  </div>
    </div>
</template>



<script  lang="ts" setup name="TwoD">
import {onMounted, ref} from 'vue'
import { reactive, toRaw } from 'vue';
import type { UnwrapRef } from 'vue';
import { useRouter } from 'vue-router'
const router = useRouter()


import Map from '@arcgis/core/Map'
import MapView from '@arcgis/core/views/MapView'
import GraphicsLayer from '@arcgis/core/layers/GraphicsLayer'
import '@arcgis/core/assets/esri/themes/light/main.css'
import ScaleBar from '@arcgis/core/widgets/ScaleBar'
import Expand from '@arcgis/core/widgets/Expand'
import Editor from "@arcgis/core/widgets/Editor.js";
import Sketch from '@arcgis/core/widgets/Sketch'
import WMSLayer from "@arcgis/core/layers/WMSLayer.js";
import WFSLayer from "@arcgis/core/layers/WFSLayer.js";
import Popup from "@arcgis/core/widgets/Popup.js";
import Search from '@arcgis/core/widgets/Search'
import BasemapGallery from '@arcgis/core/widgets/BasemapGallery'
import Graphic from '@arcgis/core/Graphic';
import Draw from '@arcgis/core/views/draw/Draw';
import * as GeometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Point from '@arcgis/core/geometry/Point';
import Polyline from '@arcgis/core/geometry/Polyline';
import Polygon from '@arcgis/core/geometry/Polygon';
import Color from '@arcgis/core/Color';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import Extent from "@arcgis/core/geometry/Extent.js";
import Query from "@arcgis/core/rest/support/Query.js";
import SpatialReference from "@arcgis/core/geometry/SpatialReference.js";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer.js";
import html2canvas from "html2canvas";
import printJS from 'print-js'
import Print from "@arcgis/core/widgets/Print.js";
import Swipe from "@arcgis/core/widgets/Swipe.js";
import * as echarts from "echarts";
import * as reactiveUtils from "@arcgis/core/core/reactiveUtils.js";

import drawLine from "../class/TwoD/drawLine"
import drawPolygon from "../class/TwoD/drawPolygon"
import goToLayer from "../class/TwoD/goToLayer"





let map:any,view:any
let G131056:any
let G131056_shpv:any
let G421032:any
let G421032_shpv:any
let G511040:any
let G511040_shpv:any
let G511191:any
let G511191_shpv:any
let G511192:any
let G511192_shpv:any
let G511193:any
let G511193_shpv:any
let G511194:any
let G511194_shpv:any
let S217057:any
let S217057_shpv:any
let S138066:any
let S138066_shpv:any
const state = reactive({
  check11: true,
  check12: true,
  check13: true,

  check21: true,
  check22: true,
  check23: true,

  check31: true,
  check32: true,
  check33: true,

  check41: true,
  check42: true,
  check43: true,

  check51: true,
  check52: true,
  check53: true,

  check61: true,
  check62: true,
  check63: true,

  check71: true,
  check72: true,
  check73: true,

  check81: true,
  check82: true,
  check83: true,

  check91: true,
  check92: true,
  check93: true,
});
// const area = [14481841.441842116,7511535.580789766,9991808.539417403,1391143.286247395,9050000.000000000,1210000.000000000,3490000.000000000,4200000.000000000,10824778.160252398,2601408.432584364,3370000.000000000,910000.000000000,2365695.4716045866,663867.0667789616,2855695.4716045866,713867.0667789616,21388301.69222088,2800776.3784365905
// ]
const area = [1448,751,999,139,905,121,349,42,1082,260,337,91,236,66,285,71,2138,280]
var lineLayer = new GraphicsLayer() //缁樺埗绾垮浘�????
var polygonLayer = new GraphicsLayer() //缁樺埗闈㈠浘�????
    onMounted(() => {
        function initMap() {
            const graphicsLayer = new GraphicsLayer();
            map = new Map({
              basemap: "topo-vector",
              layers: [graphicsLayer,lineLayer,polygonLayer]
            });

            view = new MapView({ //MapView涓轰簩缁达紝SceneView涓轰笁锟????
              container: 'mapView',
              map: map,
              zoom: 4,  //缂╂斁锟????
              center: [104, 34], // 缁忓�?, 绾�?
            })
            const basemapGallery = new BasemapGallery({
                  view: view,
                  source: {
                    portal: {
                      url: "https://www.arcgis.com",
                      useVectorBasemaps: true, // Load vector tile basemaps
                    }
                  }
            });
            const basemapGalleryExpand = new Expand({
            view: view,
            content: basemapGallery,
            expandIconClass: "esri-icon-basemap" // 锟皆讹拷锟斤拷展锟斤拷图锟斤�?
            });
            const scaleBar = new ScaleBar({
              view: view,
              unit: 'metric',
            })
            const sketch = new Sketch({
              view,
              layer: graphicsLayer,
              creationMode: "update"
            });
            const sketchExpand = new Expand({
              view: view,
              content: sketch,
              expandIconClass: "esri-icon-cursor-marquee" // 锟皆讹拷锟斤拷展锟斤拷图锟斤�?
            });
            const search = new Search({
                view: view
            });
            const layers:any = {}; // 锟斤拷锟斤拷一锟斤拷锟斤拷锟斤拷锟斤拷锟芥储锟斤拷锟叫碉拷图锟斤拷
            function addWMS(name:string,bbox:number[],wkid:number){
                layers[name] = new WMSLayer({ // 使锟矫凤拷锟斤拷锟斤拷锟斤拷使锟矫憋拷锟斤拷锟斤拷为锟斤拷锟斤拷锟斤�?
                    url: 'http://localhost:8080/geoserver/wms',
                    sublayers: [
                        {
                            name: name
                        }
                    ]
                });

                map.add(layers[name]); // 锟斤拷锟接讹拷应锟斤拷图锟姐到锟斤拷图锟斤拷
                view.when(function() {
                var extent = new Extent({
                    xmin: bbox[0],
                    ymin: bbox[1],
                    xmax: bbox[2],
                    ymax: bbox[3],
                    spatialReference: { wkid:wkid }
                });
                view.goTo(extent).then(function() {
                    view.zoom = view.zoom * 1.1; // 缂╁皬鍒板師鏉ョ�?50%
                });
            });
            return layers[name]
            }
            // console.log(layers)
            G131056 = addWMS('test:G131056',[39603591.85559774,4306998.635729584,39662204.327045925,4355838.120180096],4527)        
            G131056_shpv = addWMS('test:G131056.shpv',[39603591.85559774,4306998.635729584,39662204.327045925,4355838.120180096],4527)        
            // addWMS('test:G131056_result',[39603591.85559774,4306998.635729584,39662204.327045925,4355838.120180096],4527)

            G421032 = addWMS('test:G421032',[38509351.349480346,3369125.9215750205,38524004.46734239,3378510.788633632],4526)
            G421032_shpv = addWMS('test:G421032.shpv',[38509351.349480346,3369125.9215750205,38524004.46734239,3378510.788633632],4526)
            
            G511040 = addWMS('test:G511040',[35419064.14450003,3374737.753952593,35433717.26236208,3389085.465970963],4523)
            // G511040_shpv = addWMS('test:G511040.shpv',[35419064.14450003,3374737.753952593,35433717.26236208,3389085.465970963],4523)
            
            G511191 = addWMS('test:G511191',[35435288.82994539,3432745.776386071,35446849.713640206,3447398.8942481177],4523)
            // G511191_shpv = addWMS('test:G511191.shpv',[35435288.82994539,3432745.776386071,35446849.713640206,3447398.8942481177],4523)
            
            G511192 = addWMS('test:G511192',[35474962.957825616,3470310.695158392,35485474.008932784,3484963.813020439],4523)
            G511192_shpv = addWMS('test:G511192.shpv',[35474962.957825616,3470310.695158392,35485474.008932784,3484963.813020439],4523)
            
            G511193 = addWMS('test:G511193',[35558905.02649106,3573407.436581981,35585462.60962206,3602713.672306075],4523)
            // G511193_shpv = addWMS('test:G511193.shpv',[35558905.02649106,3573407.436581981,35585462.60962206,3602713.672306075],4523)
            
            G511194 = addWMS('test:G511194',[35537908.37473824,3362333.8228704324,35567214.61046233,3391105.5983680915],4523)
            // G511194_shpv = addWMS('test:G511194.shpv',[35537908.37473824,3362333.8228704324,35567214.61046233,3391105.5983680915],4523)
            
            S217057 = addWMS('test:S217057',[40600864.41565077,4574513.4762480585,40608190.97458179,4581038.344839429],4528)
            S217057_shpv = addWMS('test:S217057.shpv',[40600864.41565077,4574513.4762480585,40608190.97458179,4581038.344839429],4528)
            
            S138066 = addWMS('test:S138066',[40386432.92831738,4425772.877103163,40397001.24302025,4440425.994965211],4528)
            S138066_shpv = addWMS('test:S138066.shpv',[40385507.16685374,4425639.262046554,40395560.1091954,4440292.379908602],4528)
            
            // console.log(a)
            // const editor = new Editor({
            //   view: view, // 锟芥换为锟斤拷锟侥碉拷图锟斤拷图
            //   layerInfos: [{
            //     layer: a,
            //   }]
            // });

            // view.ui.add(editor, 'top-right'); // 锟斤拷锟洁辑锟斤拷锟斤拷锟接碉拷 UI 锟斤�?
            // Add the widget to the view
            view.ui.move('zoom', 'bottom-right') // 娣诲姞缂╂斁鎺т欢
            view.ui.add(search, "top-right");
            view.ui.add(scaleBar, { position: 'bottom-left' }) // 娣诲姞姣斾緥�?????
            view.ui.add(sketchExpand, "top-right");
            view.ui.add(basemapGalleryExpand, { position: "top-right" });
            view.ui.components = [];
            addChangeEventListener("layer11",G131056);
            addChangeEventListener("layer12",G131056_shpv);
            addChangeEventListener("layer21",G421032);
            addChangeEventListener("layer22",G421032_shpv);
            addChangeEventListener("layer31",G511040);
            addChangeEventListener("layer32",G511040_shpv);
            addChangeEventListener("layer41",G511191);
            addChangeEventListener("layer42",G511191_shpv);
            addChangeEventListener("layer51",G511192);
            addChangeEventListener("layer52",G511192_shpv);
            addChangeEventListener("layer61",G511193);
            addChangeEventListener("layer62",G511193_shpv);
            addChangeEventListener("layer71",G511194);
            addChangeEventListener("layer72",G511194_shpv);
            addChangeEventListener("layer81",S217057);
            addChangeEventListener("layer82",S217057_shpv);
            addChangeEventListener("layer91",S138066);
            addChangeEventListener("layer92",S138066_shpv);

            var point = [{
                    "geometry": {
                      "x": 118.46203717528095,
                      "y": 39.08851358018042,
                      "spatialReference": {
                        "wkid": 4326
                      }
                    },
                    "attributes": {
                      "cxcd": "监测�?",
                      // "name": "唐山曹妃甸经济技术开发区",
                      "name": "唐山经济技术开发区",
                      "pop": "4000",
                      "x": "118.46203717528095",
                      "y": "39.08851358018042",
                      "url":"../../public/images/G131056.png",
                      "article":"中国（河北）自由贸易试验区曹妃甸片区�?2019�?8�?31日挂牌成立，是河北自贸区唯一沿海片区，总面�?33.48平方公里，东至曹妃甸新城绿珠河西岸、青裳河西岸，南至纳潮河北岸线、三号港池岸线，西至工业区高新大街，北至曹妃甸工业区北边路、曹妃甸新城新港大道。重点发展国际大宗商品贸易、港航服务、能源储配、高端装备制造等产业，建设东北亚经济合作引领区、临港经济创新示范区�?",
                      "article2":"曹妃甸片区肩负“为国家试制度、为地方谋发展”的职责使命，坚持“大胆试、大胆闯、自主改”，聚焦片区功能定位，坚持改革创新、先行先试，以制度创新为核心，积极转变政府职能，大力开展招商引资，持续推进金融开放，聚力发展优势产业，推动各项工作取得显著成效，2020�?2021�?2022年连续三年在全省四个片区中排名第一�?"
                    },
                  }, {
                    "geometry": {
                      "x": 114.17705389463079,
                      "y": 30.482969789502164,
                      "spatialReference": {
                        "wkid": 4326
                      }
                    },
                    "attributes": {
                      "cxcd": "监测�?",
                      "name": "武汉经济技术开发区",
                      "pop": "4000",
                      "x": "114.17705389463079",
                      "y": "30.482969789502164",
                      "url":"../../public/images/G421032.png",
                      "article":"武汉经开区位于武汉西南，1991�?5月动工兴建，1993�?4月经国务院批准为国家级经济技术开发区�?2000�?4月经国务院批准在经开区内设立武汉出口加工区，2018�?11月升级为武汉经开综合保税区。经�?30多年的发展，武汉经开区逐步形成�?3335”现代产业体系：汽车制造、电子电器、食品饮�?3大优势产业、新能源与智能网联汽车、新能源、新材料3大战略产业、数字经济、现代服务、大健康3大重点发展产业、高端装备、智能建造、通用航空、现代物流、高科技农业5大特色产业，成为武汉工业经济的主战场�?",
                      "article2":"经过31年发展，形成了以汽车及零部件、电子电器、食品饮料、生物医药为核心，以新能源、新材料、智能装备、通用航空为支撑，以现代服务业为补充的产业体系，年产整车近百万辆，工业产值超3460亿元，占全市五分之一，实现了从“一辆车”到“一个产业集群”，再到“一座时代新城”的转变，被称为“中国车谷”�?"
                    },
                  }, {
                    "geometry": {
                      "x": 104.23607371241113,
                      "y": 30.561850267761542,
                      "spatialReference": {
                        "wkid": 4326
                      }
                    },
                    "attributes": {
                      "cxcd": "监测�?",
                      "name": "成都经济技术开发区",
                      "pop": "4000",
                      "x": "104.23607371241113",
                      "y": "30.561850267761542"
                    },
                  }, {
                    "geometry": {
                      "x": 104.40265144128001,
                      "y": 31.09436026916168,
                      "spatialReference": {
                        "wkid": 4326
                      }
                    },
                    "attributes": {
                      "cxcd": "监测�?",
                      "name": "德阳经济技术开发区",
                      "pop": "4000",
                      "x": "104.40265144128001",
                      "y": "31.09436026916168"
                    },
                  }, {
                    "geometry": {
                      "x": 104.77409116632978,
                      "y": 31.42437256683567,
                      "spatialReference": {
                        "wkid": 4326
                      }
                    },
                    "attributes": {
                      "cxcd": "监测�?",
                      "name": "绵阳经济技术开发区",
                      "pop": "4000",
                      "x": "104.77409116632978",
                      "y": "31.42437256683567",
                      "url":"../../public/images/G511192.png",
                      "article":"绵阳经济技术开发区（简称绵阳经开区）成立�?2000�?8月，2012�?2月与绵阳科技城现代农业科技示范区整合后增挂其牌子，同年10月升级为国家级经济技术开发区。管辖塘汛街道和松垭镇，总面�?65平方公里，纳入城市控�?45平方公里，建成区面积27.32平方公里，七人普人口�?16.7万，常住人口20余万。绵阳经开区是国家级绿色工业园区、四川省优秀工业园区、四川省新型工业示范基地，拥有四川省首批化工园区、国家级连接器中小特色产业集群，正向着“加快建成千亿园区、奋力挺进全�?50强，打造西部高质量发展示范区”的目标阔步前行�?2023年，地区生产总值增�?9.8%，地方一般公共预算收入增�?10.0%，规上工业总产值增�?11.2%，全社会固定资产投资增长10.0%�?",
                      "article2":"当前，绵阳经开区正坚持以习近平新时代中国特色社会主义思想为指导，全面贯彻落实党的二十大精神和习近平总书记对四川工作系列重要指示精神，坚持稳中求进工作总基调，完整、准确、全面贯彻新发展理念，积极融入和服务构建新发展格局，坚持创新引领，深入贯彻“五市战略”，以“园区提质”“企业满园”为总牵引，加快建成千亿园区、奋力挺进全�?50强，打造西部高质量发展示范区，以一域之光为加快建设中国科技城、全力打造成渝副中心添彩�?"
                    },
                  }, {
                    "geometry": {
                      "x": 105.804480188842,
                      "y": 32.425302129477664,
                      "spatialReference": {
                        "wkid": 4326
                      }
                    },
                    "attributes": {
                      "cxcd": "监测�?",
                      "name": "广元经济技术开发区",
                      "pop": "4000",
                      "x": "105.804480188842",
                      "y": "32.425302129477664"
                    },
                  },{
                    "geometry": {
                      "x": 105.56522551350984,
                      "y": 30.51154606479028,
                      "spatialReference": {
                        "wkid": 4326
                      }
                    },
                    "attributes": {
                      "cxcd": "监测�?",
                      "name": "遂宁经济技术开发区",
                      "pop": "4000",
                      "x": "105.56522551350984",
                      "y": "30.51154606479028"
                    },
                  },{
                    "geometry": {
                      "x": 121.250387039328,
                      "y": 41.3283199341745,
                      "spatialReference": {
                        "wkid": 4326
                      }
                    },
                    "attributes": {
                      "cxcd": "监测�?",
                      // "name": "锦州七里河经济开发区",
                      "name": "锦州经济技术开发区",
                      "pop": "4000",
                      "x": "121.250387039328",
                      "y": "41.3283199341745",
                      "url":"../../public/images/S217057.png",
                      "article":"锦州七里河高新技术产业开发区�?2019�?1月经省政府批准建立的省级高新区，区域面积3.69平方公里，高新区未独立设置机构，与开发区合署办公。获得“辽宁省品牌机电装备产业基地”、“省级示范农产品加工集聚区”等称号。高新区以新发展理念为引领，推动质量变革、效率变革、动力变革，打造高新区品牌，将高新区建成创新驱动发展示范区和高质量发展的先行区。做好改造升级“老字号”、深度开发“原字号”、培育壮大“新字号”三篇大文章，建立科技型企业梯度培育体系�?",
                      "article2":"打造�?5G+工业互联网”示范园区，建设园区、企业运行大数据平台，以数字化赋能工业企业转型，实现科技型企业全部上云。做大做强开发区“三院两站两基地一平台”功能，加快企业、高校、科研机构“产学研”融合进程，推进“博士进园区进企业”，搭建高科技人才服务企业平台�?"
                    },
                  },{
                    "geometry": {
                      "x": 118.74187637441389,
                      "y": 40.02908958980425,
                      "spatialReference": {
                        "wkid": 4326
                      }
                    },
                    "attributes": {
                      "cxcd": "监测�?",
                      // "name": "河北迁安高新技术产业开发区",
                      "name": "河北迁安产业开发区",
                      "pop": "4000",
                      "x": "118.74187637441389",
                      "y": "40.02908958980425",
                      "url":"../../public/images/S138066.png",
                      "article":"河北迁安经济开发区属河北省级开发区，是迁安市重点培育的产业园区，是项目建设和招商引资的承载平台。由位于迁安市西部的经济开发区、东部的高新技术产业开发区及南部的北方钢铁物流产业聚集区三大河北省级园区整合而成�?2022�?12月经河北省政府批准成立，总规划面�?106.53平方公里，建成区面积58平方公里�?",
                      "article2":"开发区以特色化、规模化、集群化产业发展思路，大力构建现代产业体系，围绕“一区三园”科学规划产业布局，西部片区优先发展精品钢铁、装备制造、冶金建材等产业；东部片区重点发展高端装备制造、生物医药、新材料等产业；北方钢铁物流产业片区大力发展智慧物流、期货物流、超市物流和港口物流等产业。开发区已初步形成精品钢铁、高端装备制造、生物医药、现代物流、战略性新兴产业五大产业集群�?"
                    },
                  }];
                  var gras = [];
                  for (var i = 0; i < point.length; i++) {
                    gras.push(new Graphic({
                      geometry: new Point({
                        longitude: point[i].geometry.x,
                        latitude: point[i].geometry.y
                      }),
                      attributes: point[i].attributes
                    }))
                  }
                  var Symbol1 = {
                    type: "picture-marker",
                    url: 'favicon.ico', //图片地址
                    width: "110px",
                    height: "110px",
                  };
                  var renderer = {
                    type: "class-breaks",
                    field: "pop",
                    classBreakInfos: [{
                      minValue: 4000,
                      maxValue: 7000,
                      symbol: Symbol1
                    }]
                  };
                  var fields = [{
                    name: "ObjectID",
                    alias: "ObjectID",
                    type: "oid",
                  }];
    
                  for (var col in gras[0]["attributes"]) {
                    fields.push({
                      name: col,
                      alias: col,
                      type: "string"
                    })
                  }
                                //标注
                  const nameClass0 = {
                    labelPlacement: "center-along",
                    labelExpressionInfo: {
                      expression: "$feature.name"
                    },
                  };
                  var chartAction = {
                    title: "图表",//页面显示的按钮名�?
                    id: "chartAction",//按钮id
                    className: "esri-icon-chart"
                  };
                  var layerzz = new FeatureLayer({
                    source: gras,
                    renderer: renderer,
                    geometryType: "point",
                    fields: fields,
                    objectIdField: "ObjectID",
                    popupTemplate: {
                      title: "<b>{name}</b>",
                      content: [{
                        type: "text", 
                        text: "{article}"
                      },{
                      type: "media",
                      mediaInfos: [{
                        // title: "<b>{name}</b>",
                        type: "image", //图像
                        // caption: "tree species",
                        value: {
                          sourceURL: "{url}" // 使用字段表达式设置sourceURL属�?
                        }
                      }]
                    },{
                        type: "text", 
                        text: "{article2}"
                      }],
                      actions:[chartAction],
                      overwriteActions:true
                    },
                    labelingInfo: [
                        nameClass0
                    ],

                  });
                  map.add(layerzz);

                  // Event handler that fires each time an action is clicked.
                  reactiveUtils.on(
                    () => view.popup,
                    "trigger-action",
                    (event:any) => {  // Execute the measureThis() function if the measure-this action is clicked
                      if(event.action.id === "chartAction"){
                        let button=document.getElementById('chart1_button') as HTMLInputElement;
                        button.style.display='block'
                        let chart=document.getElementById('chart1') as HTMLInputElement;
                        chart.style.zIndex = '1';
                        if(view.popup.selectedFeature.attributes.name == "唐山经济技术开发区"){
                          chart1(area[0],area[1]);
                        }else if(view.popup.selectedFeature.attributes.name == "武汉经济技术开发区"){
                          chart1(area[2],area[3]);
                        }else if(view.popup.selectedFeature.attributes.name == "成都经济技术开发区"){
                          chart1(area[4],area[5]);
                        }else if(view.popup.selectedFeature.attributes.name == "德阳经济技术开发区"){
                          chart1(area[6],area[7]);
                        }else if(view.popup.selectedFeature.attributes.name == "绵阳经济技术开发区"){
                          chart1(area[8],area[9]);
                        }else if(view.popup.selectedFeature.attributes.name == "广元经济技术开发区"){
                          chart1(area[10],area[11]);
                        }else if(view.popup.selectedFeature.attributes.name == "遂宁经济技术开发区"){
                          chart1(area[12],area[13]);
                        }else if(view.popup.selectedFeature.attributes.name == "锦州经济技术开发区"){
                          chart1(area[14],area[15]);
                        }else if(view.popup.selectedFeature.attributes.name == "河北迁安产业开发区"){
                          chart1(area[16],area[17]);
                        }

                                      }
                  });
    // 添加鼠标点击事件监听�?
                view.on("click", handleMapClick);

    function handleMapClick(event:any) {
      const { mapPoint } = event; // 获取点击位置的地理坐�?
      const latitude = mapPoint.latitude; // 获取纬度
      const longitude = mapPoint.longitude; // 获取经度
      
      // 在控制台打印经纬度信�?
      console.log(latitude+','+longitude);

      
      // 在页面上显示经纬度信�?
      // showCoordinates(latitude, longitude);
    }

    // // 创建显示经纬度的元素
    // const coordinatesDiv = document.createElement("div");
    // coordinatesDiv.id = "coordinatesDiv";
    // document.body.appendChild(coordinatesDiv);

    // function showCoordinates(latitude:any, longitude:any) {
    //   // 将经纬度信息添加到元素中
    //   coordinatesDiv.innerHTML = `Latitude: ${latitude}<br>Longitude: ${longitude}`;
    // }
          };
        initMap();
    })




    //图层相关
    function addChangeEventListener(layerHTML: string, Layer: any) {
      const layer = document.getElementById(layerHTML) as HTMLInputElement;
      layer && layer.addEventListener("change", () => {
        Layer.visible = layer.checked;
      });
    }

    function showLayer() {
      var enjoyCss = document.getElementById("enjoy-css") as HTMLInputElement;
      if (enjoyCss.style.display === "none") {
        enjoyCss.style.display = "block"; // 显示 enjoy-css 元素
      } else {
        enjoyCss.style.display = "none"; // 隐藏 enjoy-css 元素
      }
    }



    function swipe(){
      let swipe = new Swipe({
          view: view,
          leadingLayers: [G131056,G421032,G511040,,G511191,G511192,G511193,G511194,S217057,S138066],
          trailingLayers: [G131056_shpv,G421032_shpv,G511040_shpv,G511191_shpv,G511192_shpv,G511193_shpv,G511194_shpv,S217057_shpv,S138066_shpv],
          direction: "vertical", // swipe widget will move from top to bottom of view
          position: 50 // position set to middle of the view (50%)
        });
        view.ui.add(swipe);
    }

    function chart1(area1:number,area2:number){
      let customTheme = {
  // 在这里定义你的主�?
  backgroundColor: 'rgba(100,206,242,0.1)', // 略微透明的蓝色背�?
  // 其他主题设置...
};
      let chart = echarts.init(document.getElementById("chart1"), customTheme);
            // 把配置和数据放这�?
            chart.setOption({
  series: [
    {
      type: 'pie',
      title: {
          text: 'ECharts 入门示例'
        },
        label: {
                normal: {
                    formatter: '{b}:{c}' + '公顷' + '\n\r' + '({d}%)',
                    show: true,
                    position: 'left'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '30',
                        fontWeight: 'bold'
                    }
                }
            },
      data: [
        {
          value: area1 - area2,
          name: '已开发面�?'
        },
        {
          value: area2,
          name: '未开发面�?'
        },
      ],
      radius: '50%'
    }
  ]
});

    }

    function closeChart(){
      let chart = echarts.getInstanceByDom(document.getElementById("chart1") as HTMLInputElement);
      let button=document.getElementById('chart1_button') as HTMLInputElement;
      button.style.display='none'
      let chart1=document.getElementById('chart1') as HTMLInputElement;
      chart1.style.zIndex = '-1';
      if (chart) {
        echarts.dispose(chart);
      }
    }

    function toThreeD(){
      router.push("./ThreeD")
    }
</script>

<style  lang="less">

.mapView {
  width: 100vw;
  height: 100vh;
  top: 0; 
  bottom: 0;
	left: 0;
	right: 0;
  position: fixed;
}
#measure{
  top: 140px; 
  bottom: 0;
	right: 14px;
  position: absolute;
}



#enjoy-css {
  position: absolute;
  top: 160px; 
  bottom: 0;
	right: 0px;
  width: 350px;
  height: 330px;
  margin: 46px;
  border: 2px solid rgba(0, 0, 0, 0.91);
  -webkit-border-radius: 14px;
  border-radius: 14px;
  font: normal 14px/1 "Times New Roman", Times, serif;
  color: rgba(0,0,0,1);
  background-color: rgb(255, 255, 255);
  #checkFont {
    left: 150px;
    top: 5px;
    position: absolute;
    display: flex;
    justify-content: space-between;
    gap: 9px;
    font-style: initial;
}
  #check{
    left: 10px;
    top: 10px;
    position: absolute;
  }
  
}
#chart1_button {
    left: 340px;
    top: 25px;
    position: absolute;
    z-index: 5;
    display: none;
}

#chart1{
  display: "";
  position: absolute;
  z-index: -1;
  width: 375px;
  height: 250px;
  top:4%;
  left: 2%;
}

#check .ant-form-item {
    margin-bottom: 3px;
}
</style>../class/twod/drawLine../class/twod/drawPolygon../class/TwoD/drawLine../class/TwoD/drawPolygon