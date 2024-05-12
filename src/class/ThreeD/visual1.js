import * as Cesium from 'cesium'
class visual1{
  a=[]
  frustrumLabel= undefined //可视域分析中的鼠标提示
  viewPointFlag = false //是否选择了视点
  pickPositions = [] //被选中的点的坐标
  boardLines = [] //可视区域边界线
  pickPoints = [] //被选中的点
  activeLine=null //视野方向线
  j=false
  constructor(options){

  }
  setBuildFrustrumHandler(flag){
    let _this=this
    let handler=new Cesium.ScreenSpaceEventHandler(window.viewer.scene.canvas)
if(flag){
  // console.log(_this.frustrumLabel)
  handler.setInputAction(function (event) {
    _this.j=true
    let ray1 = window.viewer.camera.getPickRay(event.position)

    const earthPosition = window.viewer.scene.globe.pick(ray1, window.viewer.scene);
    // const earthPosition = window.viewer.scene.pickPosition(event.position);
    // `earthPosition` will be undefined if our mouse is not over the globe.
    if (Cesium.defined(earthPosition)) {
   
        _this.pickPoints.push(_this.createPoint(earthPosition));
        if(_this.pickPositions.length > 1){
          //进行可视化分析
          //先清除边界线
          for(let i=0;i<_this.boardLines.length;++i){
            window.viewer.entities.remove(_this.boardLines[i]);
          }
          _this.frustrumLabel.label.text = "可视域分析中...";
          //分析完毕清除鼠标事件
         _this.setBuildFrustrumHandler(false);
         flag=false
    
         handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
         handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK)
         handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
          //进行可视域分析
          _this.viewAreaAnalysis(45,_this.pickPositions[0],_this.pickPositions[1]);
        }
        _this.pickPositions.push(earthPosition);
        _this.viewPointFlag = true;
        const dynamicPositions = new Cesium.CallbackProperty(function () {
          return _this.pickPositions;
        }, false);
        _this.pickPositions.push(earthPosition);
        _this.activeLine = _this.drawLine(dynamicPositions,Cesium.Color.WHITE,Cesium.Color.WHITE);
        _this.a.push(_this.activeLine)
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  //添加鼠标移动处理事件
  handler.setInputAction(function (event) {
    // const newPosition = window.viewer.scene.pickPosition(event.endPosition);
    let ray1 = window.viewer.camera.getPickRay(event.endPosition)

const newPosition = window.viewer.scene.globe.pick(ray1, window.viewer.scene);
    // console.log(newPosition)
    if (Cesium.defined(newPosition)) {
      // console.log(_this.frustrumLabel)
      if(!_this.j){
        if(!_this.frustrumLabel){
          _this.frustrumLabel = _this.createLabel(newPosition,"点击选择视点");
        let b=  window.viewer.entities.add( _this.frustrumLabel)
          _this.a.push(b)
        }

        _this.frustrumLabel.position._value=newPosition
   
      }else{
        // console.log(_this.viewPointFlag)
        _this.frustrumLabel.position = newPosition;
          if(_this.viewPointFlag == true){
            _this.frustrumLabel.label.text = "点击视线方向";
            _this.pickPositions.pop();
            _this.pickPositions.push(newPosition);
            if(_this.boardLines.length>1){
              for(let i=0;i<_this.boardLines.length;++i){
                window.viewer.entities.remove(_this.boardLines[i]);
              }
            }
            //构建可视区域
            if(_this.pickPositions.length>1){
              _this.boardLines = _this.drawSector(_this.pickPositions[0],_this.pickPositions[1]);
            }
          }
      }
      }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}else{
  handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
}
}

//求扇形可视区域的两条边界线(视野范围)
drawSector(startPoint,endPoint){
let _this=this
let lines = [];
let leftLine = _this.rotateLine(Cesium.Math.toRadians(45),startPoint,endPoint);
let rightLine = _this.rotateLine(Cesium.Math.toRadians(-45),startPoint,endPoint);
lines.push(leftLine);
lines.push(rightLine);
return lines;
}
//画出某条直线段绕起点逆时针旋转radian(弧度)后的线段
rotateLine(radian,startPoint,endPoint){
let _this=this
let position_Cartesian3 = _this.rotatePoint(radian,startPoint,endPoint);
let LinePoints = [];
LinePoints.push(startPoint);
LinePoints.push(position_Cartesian3);
let line = _this.drawLine(LinePoints,new Cesium.PolylineDashMaterialProperty({color:Cesium.Color.YELLOW}),Cesium.Color.YELLOW);
return line;
}

//计算某一点绕另一点旋转radian后的终点坐标
rotatePoint(radian,startPoint,endPoint){
let _this=this
let startCartographic  = Cesium.Cartographic.fromCartesian(startPoint); //起点经纬度坐标
let endCartographic = Cesium.Cartographic.fromCartesian(endPoint); //终点经纬度坐标
//初始化投影坐标系
/*假设对图片上任意点a，绕一个坐标点o逆时针旋转angle角度后的新的坐标点b，有公式：
b.x = ( a.x - o.x)*cos(angle) - (a.y - o.y)*sin(angle) + o.x
b.y = (a.x - o.x)*sin(angle) + (a.y - o.y)*cos(angle) + o.y*/
let webMercatorProjection = new Cesium.WebMercatorProjection(window.viewer.scene.globe.ellipsoid);
let startMercator = webMercatorProjection.project(startCartographic); //起点墨卡托坐标
let endMercator = webMercatorProjection.project(endCartographic); //终点墨卡托坐标
//左边界线墨卡托坐标
let position_Mercator = new Cesium.Cartesian3((endMercator.x-startMercator.x)*Math.cos(radian)-(endMercator.y-startMercator.y)*Math.sin(radian)+startMercator.x,
(endMercator.x-startMercator.x)*Math.sin(radian)+(endMercator.y-startMercator.y)*Math.cos(radian)+startMercator.y,startMercator.z);
//左边界线经纬度坐标
let position_Cartographic = webMercatorProjection.unproject(position_Mercator);
//左边界线笛卡尔空间直角坐标
let position_Cartesian3 = Cesium.Cartographic.toCartesian(position_Cartographic.clone());
return position_Cartesian3
}

//绘制线
drawLine(positionData,material,depthFailMaterial)
{
  let shape;
  let _this=this
  shape = window.viewer.entities.add({
    polyline: {
      positions: positionData,
      arcType : Cesium.ArcType.NONE,
      width: 5,
      material: material,
      depthFailMaterial: depthFailMaterial, //被地形遮挡部分的颜色
    },
  });
  return shape;
}
clear(){
  let _this=this
  for(let i=0;i<_this.a.length;++i){
    window.viewer.entities.remove(_this.a[i]);
  }
  _this.pickPositions = [];
_this.boardLines = [];
_this.frustrumLabel = undefined;
_this.viewPointFlag = false;
this.setBuildFrustrumHandler(false);
}
//可视化分析
viewAreaAnalysis(degree,startPoint,endPoint){
let _this=this
for(let i=-degree;i<=degree;++i){
  let radian = Cesium.Math.toRadians(i); //角度转弧度
  let destPoint = _this.rotatePoint(radian,startPoint,endPoint);
  _this.getIntersectPoint(startPoint,destPoint);
}
window.viewer.entities.remove(_this.frustrumLabel);
window.viewer.entities.remove(_this.activeLine);
_this.pickPositions = [];
for(let i=0;i<_this.pickPoints.length;++i){
  window.viewer.entities.remove(_this.pickPoints[i]);
}
_this.pickPoints = [];
}

//计算两点连成的直线段与地形/建筑的交点，并绘制可视线
getIntersectPoint(startPoint,endPoint)
{
let _this=this
//计算两点连线的方向

let direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(endPoint,startPoint,new Cesium.Cartesian3()),new Cesium.Cartesian3());
//建立射线

let ray = new Cesium.Ray(startPoint,direction);
//计算相交点，注意，这里的相交点有可能比终点更远
let result = window.viewer.scene.pickFromRay(ray);


if(Cesium.defined(result)){
  let intesectPosition = result.position;
  //判断相交点是否比终点更远
  if(_this.distanceBetweenTwoPoints(startPoint,endPoint)>_this.distanceBetweenTwoPoints(intesectPosition,startPoint))
  {
    let aaa= _this.drawLine([startPoint,result.position],Cesium.Color.GREEN,Cesium.Color.GREEN);
    let bb=_this.drawLine([result.position,endPoint],Cesium.Color.RED,Cesium.Color.RED);
    _this.a.push(aaa)
    _this.a.push(bb)
  }else{
    let aaaa=_this.drawLine([startPoint,endPoint],Cesium.Color.GREEN,Cesium.Color.GREEN);
    _this.a.push(aaaa)
  }
}else{
 let aa= _this.drawLine([startPoint,endPoint],Cesium.Color.GREEN,Cesium.Color.GREEN);
  _this.a.push(aa)
}
}

//可视化分析（鼠标点击“可视域分析”按钮的响应事件）
visual(){
let _this=this
// window.viewer.entities.removeAll();
_this.pickPositions = [];
_this.boardLines = [];
_this.frustrumLabel = undefined;
_this.viewPointFlag = false;
this.setBuildFrustrumHandler(true);

}

createLabel(position, text) {
return new Cesium.Entity({
  position: position,
  label: {
    text: text,
    font: '16px sans-serif',
    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
    fillColor: Cesium.Color.WHITE,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 2,
    pixelOffset: new Cesium.Cartesian2(0, -25),
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    disableDepthTestDistance: Number.POSITIVE_INFINITY
  }
});
}

createPoint(position) {
return new Cesium.Entity({
  position: position,
  point: {
    pixelSize: 10,
    color: Cesium.Color.YELLOW,
    outlineColor: Cesium.Color.BLACK,
    outlineWidth: 2,
    heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
    disableDepthTestDistance: Number.POSITIVE_INFINITY
  }
});
}

distanceBetweenTwoPoints(point1, point2) {
    // 计算两点之间的距离
    return Cesium.Cartesian3.distance(point1, point2);
}
}
export default visual1;