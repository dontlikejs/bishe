import * as Cesium from 'cesium'
import * as echarts from "echarts"
class profile{
  floatingPoint
  handler1
  constructor(options){
    this.profileChart=options.profileChart
  }
  remove(){
    _this.handler1.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
    _this.handler1.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE)
    _this.handler1.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_DOWN)
  
  }
  Profile() {
    let _this=this
_this.handler1 = new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas);
var positions = [];
var positionsCartographic = [];
var positions_Inter = [];
var poly = null;
var distance = 0;
var cartesian = null;
// var floatingPoint;
var DistanceArray = [];

var profileItem = [];

// let $menuBox = $('#SideBar');
// let outerW = $menuBox.outerWidth();
_this.handler1.setInputAction(function (movement) {
    // movement.endPosition.x = movement.endPosition.x - outerW;
    // movement.endPosition.x = movement.endPosition.x ;
    let ray1 = window.viewer.camera.getPickRay(movement.endPosition)

cartesian = window.viewer.scene.globe.pick(ray1, window.viewer.scene);
    // cartesian = window.viewer.scene.pickPosition(movement.endPosition);

    if (positions.length >= 2) {
        if (!Cesium.defined(poly)) {
          // positions.pop();
          // positions.push(cartesian);
          // console.log(positions)
            poly = new PolyLinePrimitive(positions);
        } else {
            positions.pop();
            positions.push(cartesian);
        }
    }
    // console.log(111231211)
}, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

_this.handler1.setInputAction(function (movement) {
    // movement.position.x = movement.position.x ;
    // movement.position.x = movement.position.x - outerW;
    
    // cartesian = window.viewer.scene.pickPosition(movement.position);
//     let ray = window.viewer.camera.getPickRay(movement.position)
// cartesian = window.viewer.scene.globe.pick(ray, window.viewer.scene);

let cartesian = window.viewer.scene.pickPosition(movement.position);

let cartographi = Cesium.Ellipsoid.WGS84.cartesianToCartographic(cartesian);
console.log(cartographi)
// console.log(cartographic)
// let h=Cesium.Math.toDegrees(cartographic.height)
//       console.log(h)
    if (positions.length == 0) {
        positions.push(cartesian);
    }
    positions.push(cartesian);
    if (poly) {
        //进行插值计算

        positions_Inter=   interPoints(poly.positions);
        var cartographic = Cesium.Cartographic.fromCartesian(positions_Inter[0]);


        distance = getSpaceDistance(positions_Inter);
    } else {
      // console.log(positions)
        distance = getSpaceDistance(positions);
        // console.log(distance)
    }
    var textDisance = distance + "米";
    DistanceArray.push(distance);
  _this.floatingPoint = window.viewer.entities.add({
        position: positions[positions.length - 1],
        point: {
            pixelSize: 5,
            color: Cesium.Color.RED,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 2,
            heightReference: Cesium.HeightReference.NONE
        },
        label: {
            text: textDisance,
            font: '18px sans-serif',
            fillColor: Cesium.Color.GOLD,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            outlineWidth: 2,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            pixelOffset: new Cesium.Cartesian2(20, -20),
            heightReference: Cesium.HeightReference.NONE
        }
    });
    // console.log(1111)
}, Cesium.ScreenSpaceEventType.LEFT_CLICK);

_this.handler1.setInputAction(function (movement) {
    _this.handler1.destroy();//关闭事件句柄
    positions.pop();//最后一个点无效
    _this.createProfileChart(profileItem);
}, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

var PolyLinePrimitive = (function () {
    function _(positions) {
        this.options = {
            polyline: {
                show: true,
                positions: [],
                material: Cesium.Color.CHARTREUSE,
                width: 2,
                clampToGround: true
            }
        };
        this.positions = positions;
        this._init();
    }
    _.prototype._init = function () {
        var _self = this;
        var _update = function () {
            return _self.positions;
        };
        //实时更新polyline.positions
        this.options.polyline.positions = new Cesium.CallbackProperty(_update, false);
        window.viewer.entities.add(this.options);
    };
    return _;
})();
function cartesian3ToDegrees(position){
  let p=[]
  // console.log(position)
  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(position);
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let h=cartographic.height

  p.push(Lon)
  p.push(Lat)
  p.push(h)
  // console.log(cartographic.height)
  // console.log(p)
  return p
}
function cartesian3ToDegrees2(position){
  let p=[]
  // console.log(position)
  let pp={x:position.x,y:position.y,z:position.z}
  
  let ppp=new Cesium.Cartesian3(pp.x,pp.y,pp.z)
  // console.log(ppp)
  let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(ppp);
  // console.log(cartographic)
  let Lon=Cesium.Math.toDegrees(cartographic.longitude)
  let Lat=Cesium.Math.toDegrees(cartographic.latitude)
  let h=cartographic.height
  // console.log(h)
  p.push(Lon)
  p.push(Lat)
  p.push(h)
  return p
  // console.log(p)
}
//空间两点距离计算函数
function getSpaceDistance(positions) {
  // console.log(positions)
    profileItem = [
        {
            point: cartesian3ToDegrees(positions[0]),
            distance: 0
        }
    ];
    var distance = 0;

    for (var i = 0; i < positions.length - 1; i++) {

        var point1cartographic = Cesium.Cartographic.fromCartesian(positions[i]);
        var point2cartographic = Cesium.Cartographic.fromCartesian(positions[i + 1]);
        /**根据经纬度计算出距离**/
    
        var geodesic = new Cesium.EllipsoidGeodesic();
        geodesic.setEndPoints(point1cartographic, point2cartographic);
        var s = geodesic.surfaceDistance;

        //返回两点之间的距离
        // console.log(cartesian3ToDegrees(positions[i + 1]))
        s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2cartographic.height - point1cartographic.height, 2));
        distance = distance + s;
        var m_Item = {
            point: cartesian3ToDegrees(positions[i + 1]),
            distance: distance
        };
        // console.log(cartesian3ToDegrees(positions[i + 1]))

        profileItem.push(m_Item);
    }
   
    return distance.toFixed(2);
}

//线段插值点
function interPoints(positions) {
    positionsCartographic = [];
    var terrainSamplePositions = [];
    for (let index = 0; index < positions.length - 1; index++) {
        const element = positions[index];
        // console.log( element.x)
        // var ellipsoid = window.viewer.scene.globe.ellipsoid;
        var cartographic = cartesian3ToDegrees2(element);

        positionsCartographic.push(cartographic);
    }

    for (let i = 0; i < positionsCartographic.length; i++) {
        const m_Cartographic0 = positionsCartographic[i];
        const m_Cartographic1 = positionsCartographic[i + 1];
        if (m_Cartographic1) {
            var a = Math.abs(m_Cartographic0[0] - m_Cartographic1[0]) * 10000000;
            var b = Math.abs(m_Cartographic0[1] - m_Cartographic1[1]) * 10000000;
            //等距采样
            if (a > b) {
              b = a;
            }

            var length = parseInt(b / 2);
            if (length > 1000){
              length = 1000;

            } 
            if (length < 2) {   
                  length = 2;
            }
     
            // var length = 4;//等分采样
  
            for (var j = 0; j < length; j++) {

                terrainSamplePositions.push(
                    new Cesium.Cartographic(
                        Cesium.Math.lerp(m_Cartographic0[0],  m_Cartographic1[0], j / (length - 1)),
                        Cesium.Math.lerp(m_Cartographic0[1] , m_Cartographic1[1], j / (length - 1)),
                        Cesium.Math.lerp(m_Cartographic0[2] , m_Cartographic1[2], j / (length - 1))
                    )
                );

            }
  
            terrainSamplePositions.pop();
        } else {
            terrainSamplePositions.push(m_Cartographic0);
        }
    }
    positions_Inter = [];

    terrainSamplePositions.pop()
    for (var n = 0; n < terrainSamplePositions.length; n++) {
        //地理坐标（弧度）转经纬度坐标
        var m_cartographic = terrainSamplePositions[n];
        // var height = window.viewer.scene.globe.getHeight(m_cartographic);
   
        // console.log(m_cartographic.longitude / Math.PI * 180)
        var point = Cesium.Cartesian3.fromDegrees(m_cartographic.longitude, m_cartographic.latitude,  m_cartographic.height);
        positions_Inter.push(point);
    }

    return positions_Inter
}
}
//Echart绘制剖面图
/******************************************* **
调用分析结果createProfileChart()方法绘制剖面图
** ****************************************** */
  createProfileChart(Positions) {
    let _this=this
// console.log(Positions);
var x_Range = parseInt(Positions[Positions.length - 1].distance);
// console.log(x_Range);
var ProfileData = [];
var ProfileData_Lon = [];

var y_Min = 100000000;
for (let index = 0; index < Positions.length; index++) {
    const element = Positions[index];
    var m_distance = element.distance.toFixed(2);
    var m_Lon = element.point[0].toFixed(5);
    var m_Lat = element.point[1].toFixed(5);
    var m_height = element.point[2].toFixed(2);
    if (m_height < y_Min) {
        y_Min = m_height;
    }
    var m_data = [m_distance, m_height];
    // console.log(m_data)
    ProfileData.push(m_data);
    ProfileData_Lon.push([m_Lon, m_Lat]);
}

var lineChart = echarts.init(_this.profileChart);
// background: rgba(255, 255, 255, 1);
var lineoption = {
    title: {
        text: '剖面分析'
    },
    tooltip: {
        trigger: 'axis',
        formatter(params) {
            // console.log(params[0].data[1]);
            return "当前高度：" + params[0].data[1];
            // return "当前高度：" ;
        }
    },
    legend: {
        data: ['剖面线']
    },
    grid: {
        x: 40,
        x2: 40,
        y2: 24
    },
    calculable: true,
    xAxis: [
        {
            type: 'value',
            max: 'dataMax',
            scale: true
        }
    ],
    yAxis: [
        {
            type: 'value',
            min: y_Min,
            scale: true
        }
    ],
    series: [
        {
            name: '剖面线',
            type: 'line',
            data: ProfileData,
            markPoint: {
                data: [
                    { type: 'max', name: '最高点' },
                    { type: 'min', name: '最低点' }
                ]
            }
        }
    ]
};
lineChart.setOption(lineoption);

_this.profileChart.style.backgroundColor = 'rgba(255, 255, 255, 1)';
_this.profileChart.style.visibility = 'visible';
// $(window).resize(lineChart.resize);
} 
}
export default profile;
