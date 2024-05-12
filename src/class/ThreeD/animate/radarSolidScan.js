import * as Cesium from 'cesium'

/*
 * @Description: 立体雷达扫描效果（参考开源代码）
 * @Version: 1.0
 * @Author: Julian
 * @Date: 2022-03-05 10:22:01
 * @LastEditors: Julian
 * @LastEditTime: 2022-03-05 15:04:44
 */
class radarSolidScan {
    positionArr=[]
    constructor(options){
        this.viewer = options.viewer;
        // 半径
        this._radius = options.radius;
        // 扫描扇形颜色
        this._color = options.color;
        // 扫描速度
        this._speed = options.speed;
        // 中心点坐标经纬度
        this._cenLon = options.position[0];
        this._cenLat = options.position[1];
        this.add()
    }

add(){
    let _this=this

    this.viewer.entities.add({
        position: new Cesium.Cartesian3.fromDegrees(this._cenLon, this._cenLat),
        name: "立体雷达扫描",
        ellipsoid: {
            heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, 
            radii: new Cesium.Cartesian3(this._radius, this._radius, this._radius),
            material: this._color,
            outline: true,
            outlineColor: new Cesium.Color(1.0, 1.0, 0.0, 1.0),
            outlineWidth: 1,
        }
    })
  
    let heading = 0;
    // 每一帧刷新时调用
    this.viewer.clock.onTick.addEventListener(() => {
        heading += this._speed;
        _this.positionArr = _this.calculatePane(113.9236839, 22.528061, 1000.0, heading);

    })

    // 创建1/4圆形立体墙
    setTimeout(()=>{
        let radarWall = _this.viewer.entities.add({
            wall: {
                positions: new Cesium.CallbackProperty(() => {
                    console.log(_this.positionArr)
                    return Cesium.Cartesian3.fromDegreesArrayHeights(_this.positionArr);
                }, false),
                material: _this._color,
            }
        })
        console.log(radarWall)
    },1000)

}
  // 先建立椭球体


  // 计算平面扫描范围
  calculatePane(x1, y1, radius, heading) {
    let _this=this
      var m = Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(x1, y1));
      var rx = radius * Math.cos(heading * Math.PI / 180.0);
      var ry = radius * Math.sin(heading * Math.PI / 180.0);
      var translation = Cesium.Cartesian3.fromElements(rx, ry, 0);
      var d = Cesium.Matrix4.multiplyByPoint(m, translation, new Cesium.Cartesian3());
      var c = Cesium.Cartographic.fromCartesian(d);
      var x2 = Cesium.Math.toDegrees(c.longitude);
      var y2 = Cesium.Math.toDegrees(c.latitude);
      return _this.calculateSector(x1, y1, x2, y2);
  }

  // 计算竖直扇形
   calculateSector(x1, y1, x2, y2) {
      let positionArr = [];
      positionArr.push(x1);
      positionArr.push(y1);
      positionArr.push(0);
      var radius = Cesium.Cartesian3.distance(Cesium.Cartesian3.fromDegrees(x1, y1), Cesium.Cartesian3.fromDegrees(x2, y2));
      // 扇形是1/4圆，因此角度设置为0-90
      for (let i = 0; i <= 90; i++) {
          let h = radius * Math.sin(i * Math.PI / 180.0);
          let r = Math.cos(i * Math.PI / 180.0);
          let x = (x2 - x1) * r + x1;
          let y = (y2 - y1) * r + y1;
          positionArr.push(x);
          positionArr.push(y);
          positionArr.push(h);
      }
      return positionArr;
  }
}

export default radarSolidScan;
