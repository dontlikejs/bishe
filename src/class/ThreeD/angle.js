
import * as Cesium from 'cesium'
export default class HandleMeasureLine{
  _handler = undefined;
  _viewer = undefined;
  _activeMeasurePoints = undefined;

  _pointCollection = [];
  _labelCollection = [];

  _movePoint = undefined;
  _moveLabel = undefined;

  _lines = undefined;

  _finalLines = undefined;
  _finalLinesArr = [];

  constructor(content){
      this._viewer = content.viewer;
  }

  _createLabel(centerPoint,text)
  {
      var label = this._viewer.entities.add({
          position: centerPoint,
          label: {
              text: text,
              font: '12pt sans-serif',
              style: Cesium.LabelStyle.FILL,//label样式
              pixelOffset:new Cesium.Cartesian2(0,-50) , //偏移
              horizontalOrigin :Cesium.HorizontalOrigin.LEFT,//水平位置
              fillColor : Cesium.Color.RED,
              showBackground: true,
              backgroundColor: new Cesium.Color(0.95, 0.95, 0.95, 0.6),
              outlineColor : Cesium.Color.BLACK,
              outlineWidth : 1,
              
              // backgroundPadding: new Cesium.Cartesian2(6, 6),
          }
      });
      return label;
  }

  _drawLine(positions)
  {
      let that = this;
      return that._viewer.entities.add({
          polyline: {
              positions: positions,
              // clampToGround: true,
              height:100,
              width: 3,
              material : Cesium.Color.RED.withAlpha(0.5)
          }
      });
  }

  _createPoints(worldPosition)
  {
      // var point = this._viewer.entities.add({
      //     position: worldPosition,
      //     point: {
      //         pixelSize: 5,
      //         color: Cesium.Color.RED,
      //         outlineColor: Cesium.Color.WHITE,
      //         outlineWidth: 1,
      //         heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
      //     },
      // });
      // return point;

      var point = this._viewer.entities.add({
          position: worldPosition,
          point: {
              color: Cesium.Color.RED,
              pixelSize: 8,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          },
      });
      return point;
  }


  _measurePolyLine()
  {
      let that = this;
      that._activeMeasurePoints = [];
      that._handler = new Cesium.ScreenSpaceEventHandler(that._viewer.scene.canvas);
      that._handler.setInputAction(function(evt){
          var ray = that._viewer.camera.getPickRay(evt.position);
          if(!ray) return;
          var cartesian = that._viewer.scene.globe.pick(ray,that._viewer.scene);
          if (Cesium.defined(cartesian)){
              if (that._activeMeasurePoints.length == 0) 
              {
                  let point = that._createPoints(cartesian);
                  that._pointCollection.push(point);
                  that._activeMeasurePoints.push(cartesian);
                  var dynamicPositions = new Cesium.CallbackProperty(function () {
                      // if (that._drawingMode === "polygon") {
                      //     return new Cesium.PolygonHierarchy(that._activeMeasurePoints);
                      // }
                      return that._activeMeasurePoints;
                  }, false);

                  that._lines = that._drawLine(dynamicPositions);
              }
              if (that._activeMeasurePoints.length >= 2) 
              {
                  let inde = that._activeMeasurePoints.length;
                  var centerPoint = Cesium.Cartesian3.midpoint(that._activeMeasurePoints[inde-2], that._activeMeasurePoints[inde-1], new Cesium.Cartesian3());
                  // var lengthText = "距离：" + that._getLengthText(that._activeMeasurePoints[inde-2], that._activeMeasurePoints[inde-1]);
                  let dis = that._getLengthText(that._activeMeasurePoints[inde-2], that._activeMeasurePoints[inde-1]);
                  // var lengthText = "距离：" + that._getLengthText(that._activeMeasurePoints[inde-2], that._activeMeasurePoints[inde-1]);
                  let angleTxt = that.getAngle(that._activeMeasurePoints[inde-2], that._activeMeasurePoints[inde-1]);
                  let lengthText = `距离：${dis}\n角度：${angleTxt.toFixed(2)}`;

                  let labelEntitys = that._createLabel(centerPoint, lengthText);
                  let temple = that._createPoints(cartesian);
                  that._labelCollection.push(labelEntitys);
                  that._pointCollection.push(temple);
              }
              that._activeMeasurePoints.push(cartesian);
          }
          
      },Cesium.ScreenSpaceEventType.LEFT_CLICK);
      that._handler.setInputAction(function(evt){
          if(that._activeMeasurePoints.length < 1) return;
          var ray = that._viewer.camera.getPickRay(evt.endPosition);
          if(!ray) return;
          var cartesian = that._viewer.scene.globe.pick(ray,that._viewer.scene);
          if (Cesium.defined(cartesian)){
              if(that._activeMeasurePoints.length >= 2)
              {
                  that._activeMeasurePoints.pop();
                  that._activeMeasurePoints.push(cartesian);
  
                  let inde = that._activeMeasurePoints.length;
                  var centerPoint = Cesium.Cartesian3.midpoint(that._activeMeasurePoints[inde-2], that._activeMeasurePoints[inde-1], new Cesium.Cartesian3());
                  let dis = that._getLengthText(that._activeMeasurePoints[inde-2], that._activeMeasurePoints[inde-1]);
                  // var lengthText = "距离：" + that._getLengthText(that._activeMeasurePoints[inde-2], that._activeMeasurePoints[inde-1]);
                  let angleTxt = that.getAngle(that._activeMeasurePoints[inde-2], that._activeMeasurePoints[inde-1]);
                  let lengthText = `距离：${dis}\n角度：${angleTxt.toFixed(2)}`;
                  // console.log("SSSSSSSSSSSSSSS",angleTxt)
                  if (that._moveLabel) {
                      that._moveLabel.position.setValue(centerPoint);
                      that._moveLabel.label.text = lengthText;
                  }else{
                      that._moveLabel = that._createLabel(centerPoint, lengthText);
                      that._labelCollection.push(that._moveLabel);
                  }
                  if (that._movePoint) {
                      that._movePoint.position.setValue(cartesian);
                  }else{
                      that._movePoint = that._createPoints(cartesian);
                  }
              }
          }
          
      },Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      that._handler.setInputAction(function (event) {
          that._terminateShape();
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

  }

  getDistance(){
      let that = this;
      let inde = that._activeMeasurePoints.length;
      var length = Cesium.Cartesian3.distance(that._activeMeasurePoints[inde-2], that._activeMeasurePoints[inde-1]);
      return length;
  }

  getAngle(position1,position2){
      // if(this._activeMeasurePoints.length!==2){
      //     return 'Nan'
      // }
      const startC=Cesium.Cartographic.fromCartesian(position1)
      const endC=Cesium.Cartographic.fromCartesian(position2)
      const distance = this.getDistance();
      
      if(startC&&endC){
          const l = parseFloat(this.getDistance())//边长
          const topPoint=Cesium.Cartesian3.fromRadians(//北上点的Cartesian3
              Cesium.Cartographic.fromCartesian(position1).longitude,
              Cesium.Cartographic.fromCartesian(position1).latitude+distance/111000*(Math.PI / 180.0),
              Cesium.Cartographic.fromCartesian(position1).height
          )
          const newPoint =Cesium.Cartesian3.fromRadians(
              Cesium.Cartographic.fromCartesian(position2).longitude,
              Cesium.Cartographic.fromCartesian(position2).latitude,
              Cesium.Cartographic.fromCartesian(position2).height
          )
          const d = Cesium.Cartesian3.distance(topPoint,newPoint);
          // console.log(Math.acos((2*l*l-d*d)/(2*l*l)))
          // console.log(l)
          // console.log(d)
          return Cesium.Cartographic.fromCartesian(position2).longitude>Cesium.Cartographic.fromCartesian(position1).longitude?
          Math.acos((2*l*l-d*d)/(2*l*l))*(180.0 / Math.PI):-Math.acos((2*l*l-d*d)/(2*l*l))*(180.0 / Math.PI) + 360
      }else{
          return 'NaN'
      }
  }

  _getLengthText(firstPoint, secondPoint)
  {
      var length = Cesium.Cartesian3.distance(firstPoint, secondPoint);
      if (length > 1000) {
          length = (length / 1000).toFixed(2) + " 公里";
      } else {
          length = length.toFixed(2) + " 米";
      }
      return length;
  }

  _terminateShape()
  {
      let that = this;
      that._activeMeasurePoints.pop();
      let finalLines = that._drawLine(that._activeMeasurePoints);
      that._finalLinesArr.push(finalLines);
      that._viewer.entities.remove(that._lines);
      // that._removeEntity();
      that._viewer.entities.remove(that._moveLabel);
      that._viewer.entities.remove(that._movePoint);
      that._handler.destroy();
      that._handler = undefined;
  }

  _removeEntity()
  {
      let that =this;
      if (that._pointCollection.length > 0) {
          for (let index = 0; index < that._pointCollection.length; index++) {
              that._viewer.entities.remove(that._pointCollection[index]);
              
          }
          that._pointCollection = [];
      }
      if (that._labelCollection.length > 0) {
          for (let index = 0; index < that._labelCollection.length; index++) {
              that._viewer.entities.remove(that._labelCollection[index]);
              
          }
          that._labelCollection = [];
      }
      if (that._lines != undefined) {
          that._viewer.entities.remove(that._lines);
          that._lines = undefined
      }
      if (that._finalLinesArr.length > 0) {
          for (let index = 0; index < that._finalLinesArr.length; index++) {
              that._viewer.entities.remove(that._finalLinesArr[index]);
              
          }
          that._finalLinesArr = [];
      }
  }

}