import * as Cesium from 'cesium'
import * as echarts from "echarts"
import { helpers, area, random, bbox, tin } from "@turf/turf";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon"

class measure {
  profileItem = [];
  a=[]
  b=[]
  constructor(options) {
    this.profileChart=options.profileChart
    this.proJudge=options.proJudge
    this._distance_handler = null;
    //���ߵı���
    this._lineParams = {
      lineDataSource: null,
      vertexCollection: [], //�洢�����߶�����Ϣ
      mousePos: null,
      lastLine: null,
      totalLength: 0,
    };
    this._lineParams1 = {
      lineDataSource: null,
      vertexCollection: [], //�洢�����߶�����Ϣ
      mousePos: null,
      lastLine: null,
      totalLength: 0,
    };
    this._area_handler = null;
    //����ı���
    this._areaParams = {
      //����ı���
      areaDataSource: null,
      vertexCollection: [],
      lastArea: null,
      mousePos: null,
    };
    this._areaParams1 = {
      //����ı���
      areaDataSource: null,
      vertexCollection: [],
      lastArea: null,
      mousePos: null,
    };
    this.entityCollection = [];
    
  }

  /**
   * ���
   * @param type 0-�ռ� 1 ����
   */
  distance(type) {

    let _this=this
    type = type === undefined ? 0 : type;
  if(type==0){
    window.viewer.scene.globe.depthTestAgainstTerrain = true; //������Ȳ���
    //Ĭ�ϲ�ռ�

    this._reset1();
    this._lineParams.lineDataSource = new Cesium.CustomDataSource(
      "lineDataSource"
    );
      this.b.push(this._lineParams.lineDataSource)
    window.viewer.dataSources.add(this._lineParams.lineDataSource);
    this._distance_handler = new Cesium.ScreenSpaceEventHandler(
      window.viewer.canvas
    );
    //���������¼�
    //���Թ�������ķ����ó��������������Ҳ���this���󡣡�����Ե�����԰�
    this._distance_handler.setInputAction((e) => {
      let pos = window.viewer.scene.pickPosition(e.position); //�ѿ�������
      if (pos) {
        this._lineParams.vertexCollection.push(pos);
      }
      //������
      let currentLine
      if (type == 0) {
        currentLine = this._lineParams.lineDataSource.entities.add({
          polyline: {
            positions: new Cesium.CallbackProperty(() => {
              let c = Array.from(this._lineParams.vertexCollection);
              if (this._lineParams.mousePos) {
                c.push(this._lineParams.mousePos);

              }

              return c;
            }, false),
        
            width: 3,
            material: new Cesium.PolylineOutlineMaterialProperty({
              color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
              outlineColor: new Cesium.Color(
                255 / 255,
                180 / 255,
                115 / 255,
                1.0
              ),
              outlineWidth: 2,
            }),
          },
        });
        if (this._lineParams.vertexCollection.length >= 2) {
          this._lineParams.totalLength += this._surfaceDistance(
            this._lineParams.vertexCollection[
              this._lineParams.vertexCollection.length - 2
            ],
            pos
          );
          this._lineParams.totalLength = parseFloat(
            this._lineParams.totalLength.toFixed(2)
          );
        }
        this._addDistancePoint(pos, this._lineParams.totalLength,type);
        let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pos);
        let Lon=Cesium.Math.toDegrees(cartographic.longitude)
        let Lat=Cesium.Math.toDegrees(cartographic.latitude)
        let height=cartographic.height
        var m_Item = {
          height:height,
          distance: this._lineParams.totalLength
      };
      _this.profileItem.push(m_Item);
      } else {
        currentLine = this._lineParams.lineDataSource.entities.add({
          polyline: {
            positions: new Cesium.CallbackProperty(() => {
              let c = Array.from(this._lineParams.vertexCollection);
              if (this._lineParams.mousePos) {
                c.push(this._lineParams.mousePos);
              }
           
              return c;
            }, false),
            clampToGround: true,
            width: 3,
            material: new Cesium.PolylineOutlineMaterialProperty({
              color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
              outlineColor: new Cesium.Color(
                255 / 255,
                180 / 255,
                115 / 255,
                1.0
              ),
              outlineWidth: 2,
            }),
          },
        });
        if (this._lineParams.vertexCollection.length == 1) {
          this._addDistancePoint(pos, this._lineParams.totalLength,type);
        } else {
          let left =
            this._lineParams.vertexCollection[
              this._lineParams.vertexCollection.length - 2
            ];
          let right = pos;
          //�����������ֱ�߾��룬�����жϲ�ֵ����
          let t = Cesium.Cartesian3.distance(left, right);
    
          let vertexLength = this._terrianDistance(
            this._lineParams.vertexCollection[
              this._lineParams.vertexCollection.length - 2
            ],
            pos,
            t
          );
          this._lineParams.totalLength += vertexLength;
          this._lineParams.totalLength = parseFloat(
            this._lineParams.totalLength.toFixed(2)
          );
          this._addDistancePoint(pos, this._lineParams.totalLength,type);
        }
      }
      if (this._lineParams.lastLine) {
        this._lineParams.lineDataSource.entities.remove(
          this._lineParams.lastLine
        );
      }
      this._lineParams.lastLine = currentLine;
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //����ƶ��¼�
    this._distance_handler.setInputAction((e) => {
      let endPosition = e.endPosition;
      let endPos = window.viewer.scene.pickPosition(endPosition);
      if (endPos) {
        //����Ƴ�����,undifined
        this._lineParams.mousePos = endPos;
        //entity polyline ��ʹ����Cesium CallbackProperty ��ȥ�ƶ��ٻ���
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    this._distance_handler.setInputAction((e) => {
      if(this.proJudge){
        this.profileChart.style.zIndex = 3;
      }
      let endPostion = e.position;
      let endPos = window.viewer.scene.pickPosition(endPostion);
      if(this.proJudge){
        _this.ProfileChart()
      }
      if (endPos) {
        this.cancel();
        // vertexCollection.push(endPos);
        // if(type==0){
        //     totalLength+=this._surfaceDistance(vertexCollection[vertexCollection.length-2],endPos);
        //     this._addDistancePoint(endPos,totalLength);
        // }else{
        //     let left = vertexCollection[vertexCollection.length-2];
        //     let right = endPos;
        //     //�����������ֱ�߾��룬�����жϲ�ֵ����
        //     let t = Cesium.Cartesian3.distance(left,right);
        //     let vertexLength = this._terrianDistance(vertexCollection[vertexCollection.length-2],endPos,t);
        //     totalLength+=vertexLength;
        //     this._addDistancePoint(endPos,totalLength);
        // }
        if(type==0){

          this._lineParams.lineDataSource.entities.add({
            polyline: {
              positions: this._lineParams.vertexCollection,
              width: 3,
              material: new Cesium.PolylineOutlineMaterialProperty({
                color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
                outlineColor: new Cesium.Color(
                  255 / 255,
                  180 / 255,
                  115 / 255,
                  1.0
                ),
                outlineWidth: 2,
              }),
            },
          });
          }else{
                this._lineParams.lineDataSource.entities.add({
            polyline: {
              clampToGround: true,
              positions: this._lineParams.vertexCollection,
              width: 3,
              material: new Cesium.PolylineOutlineMaterialProperty({
                color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
                outlineColor: new Cesium.Color(
                  255 / 255,
                  180 / 255,
                  115 / 255,
                  1.0
                ),
     
                outlineWidth: 2,
              }),
            },
          });
          }

        if (this._lineParams.lastLine) {
          this._lineParams.lineDataSource.entities.remove(
            this._lineParams.lastLine
          );
        }
        this._lineParams.vertexCollection = [];
        this._lineParams.mousePos = null;
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }else{
    window.viewer.scene.globe.depthTestAgainstTerrain = true; //������Ȳ���
    //Ĭ�ϲ�ռ�

    this._reset2();
    this._lineParams1.lineDataSource = new Cesium.CustomDataSource(
      "lineDataSource"
    );
    this.b.push(this._lineParams1.lineDataSource)
    window.viewer.dataSources.add(this._lineParams1.lineDataSource);
    this._distance_handler = new Cesium.ScreenSpaceEventHandler(
      window.viewer.canvas
    );
    //���������¼�
    //���Թ�������ķ����ó��������������Ҳ���this���󡣡�����Ե�����԰�
    this._distance_handler.setInputAction((e) => {
      let pos = window.viewer.scene.pickPosition(e.position); //�ѿ�������
      if (pos) {
        this._lineParams1.vertexCollection.push(pos);
      }
      //������
      let currentLine
      if (type == 0) {
        currentLine = this._lineParams1.lineDataSource.entities.add({
          polyline: {
            positions: new Cesium.CallbackProperty(() => {
              let c = Array.from(this._lineParams1.vertexCollection);
              if (this._lineParams1.mousePos) {
                c.push(this._lineParams1.mousePos);
              }
  
              return c;
            }, false),
        
            width: 3,
            material: new Cesium.PolylineOutlineMaterialProperty({
              color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
              outlineColor: new Cesium.Color(
                255 / 255,
                180 / 255,
                115 / 255,
                1.0
              ),
              outlineWidth: 2,
            }),
          },
        });
        if (this._lineParams1.vertexCollection.length >= 2) {
          this._lineParams1.totalLength += this._surfaceDistance(
            this._lineParams1.vertexCollection[
              this._lineParams1.vertexCollection.length - 2
            ],
            pos
          );
          this._lineParams1.totalLength = parseFloat(
            this._lineParams1.totalLength.toFixed(2)
          );
        }
        this._addDistancePoint(pos, this._lineParams1.totalLength,type);
        let cartographic = Cesium.Ellipsoid.WGS84.cartesianToCartographic(pos);
        let Lon=Cesium.Math.toDegrees(cartographic.longitude)
        let Lat=Cesium.Math.toDegrees(cartographic.latitude)
        let height=cartographic.height
        var m_Item = {
          height:height,
          distance: this._lineParams1.totalLength
      };
      _this.profileItem.push(m_Item);
      } else {
        currentLine = this._lineParams1.lineDataSource.entities.add({
          polyline: {
            positions: new Cesium.CallbackProperty(() => {
              let c = Array.from(this._lineParams1.vertexCollection);
              if (this._lineParams1.mousePos) {
                c.push(this._lineParams1.mousePos);
              }
              return c;
            }, false),
            clampToGround: true,
            width: 3,
            material: new Cesium.PolylineOutlineMaterialProperty({
              color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
              outlineColor: new Cesium.Color(
                255 / 255,
                180 / 255,
                115 / 255,
                1.0
              ),
              outlineWidth: 2,
            }),
          },
        });
        if (this._lineParams1.vertexCollection.length == 1) {
          this._addDistancePoint(pos, this._lineParams1.totalLength,type);
        } else {
          let left =
            this._lineParams1.vertexCollection[
              this._lineParams1.vertexCollection.length - 2
            ];
          let right = pos;
          //�����������ֱ�߾��룬�����жϲ�ֵ����
          let t = Cesium.Cartesian3.distance(left, right);
      
          let vertexLength = this._terrianDistance(
            this._lineParams1.vertexCollection[
              this._lineParams1.vertexCollection.length - 2
            ],
            pos,
            t
          );
          this._lineParams1.totalLength += vertexLength;
          this._lineParams1.totalLength = parseFloat(
            this._lineParams1.totalLength.toFixed(2)
          );
          this._addDistancePoint(pos, this._lineParams1.totalLength,type);
        }
      }
      if (this._lineParams1.lastLine) {
        this._lineParams1.lineDataSource.entities.remove(
          this._lineParams1.lastLine
        );
      }
      this._lineParams1.lastLine = currentLine;
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    //����ƶ��¼�
    this._distance_handler.setInputAction((e) => {
      let endPosition = e.endPosition;
      let endPos = window.viewer.scene.pickPosition(endPosition);
      if (endPos) {
        //����Ƴ�����,undifined
        this._lineParams1.mousePos = endPos;
        //entity polyline ��ʹ����Cesium CallbackProperty ��ȥ�ƶ��ٻ���
      }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    //����Ҽ��¼����Ҽ�ȡ���������ӵ�������
    this._distance_handler.setInputAction((e) => {
      if(this.proJudge){
        this.profileChart.style.zIndex = 3;
      }

      let endPostion = e.position;
      let endPos = window.viewer.scene.pickPosition(endPostion);
      if(this.proJudge){
        _this.ProfileChart()
      }

      if (endPos) {
        this.cancel();

        // vertexCollection.push(endPos);
        // if(type==0){
        //     totalLength+=this._surfaceDistance(vertexCollection[vertexCollection.length-2],endPos);
        //     this._addDistancePoint(endPos,totalLength);
        // }else{
        //     let left = vertexCollection[vertexCollection.length-2];
        //     let right = endPos;
        //     //�����������ֱ�߾��룬�����жϲ�ֵ����
        //     let t = Cesium.Cartesian3.distance(left,right);
        //     let vertexLength = this._terrianDistance(vertexCollection[vertexCollection.length-2],endPos,t);
        //     totalLength+=vertexLength;
        //     this._addDistancePoint(endPos,totalLength);
        // }
        if(type==0){
          this._lineParams1.lineDataSource.entities.add({
            polyline: {
              positions: this._lineParams1.vertexCollection,
              width: 3,
              material: new Cesium.PolylineOutlineMaterialProperty({
                color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
                outlineColor: new Cesium.Color(
                  255 / 255,
                  180 / 255,
                  115 / 255,
                  1.0
                ),
                outlineWidth: 2,
              }),
            },
          });
          }else{
                this._lineParams1.lineDataSource.entities.add({
            polyline: {
              clampToGround: true,
              positions: this._lineParams1.vertexCollection,
              width: 3,
              material: new Cesium.PolylineOutlineMaterialProperty({
                color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
                outlineColor: new Cesium.Color(
                  255 / 255,
                  180 / 255,
                  115 / 255,
                  1.0
                ),
     
                outlineWidth: 2,
              }),
            },
          });
          }

        if (this._lineParams1.lastLine) {
          this._lineParams1.lineDataSource.entities.remove(
            this._lineParams1.lastLine
          );
        }
        this._lineParams1.vertexCollection = [];
        this._lineParams1.mousePos = null;
      }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }
  }

  ProfileChart(){
    let _this=this
    _this.createProfileChart(_this.profileItem)
  }
  createProfileChart(Positions) {
    let _this=this
// console.log(Positions);
// console.log(x_Range);
var ProfileData = [];
var ProfileData_Lon = [];

var y_Min = 100000000;
for (let index = 0; index < Positions.length; index++) {
    const element = Positions[index];

    var m_distance = element.distance.toFixed(2);
    var m_height = element.height.toFixed(2);
    if (m_height < y_Min) {
        y_Min = m_height;
    }
    var m_data = [m_distance, m_height];
    // console.log(m_data)
    ProfileData.push(m_data);
    // ProfileData_Lon.push([m_Lon, m_Lat]);
}

var lineChart = echarts.init(_this.profileChart);
// background: rgba(255, 255, 255, 1);
var lineoption = {
    title: {
        text: '�������'
    },
    tooltip: {
        trigger: 'axis',
        formatter(params) {
            // console.log(params[0].data[1]);
            return "��ǰ�߶ȣ�" + params[0].data[1];
            // return "��ǰ�߶ȣ�" ;
        }
    },
    legend: {
        data: ['������']
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
            name: '������',
            type: 'line',
            data: ProfileData,
            markPoint: {
                data: [
                    { type: 'max', name: '��ߵ�' },
                    { type: 'min', name: '��͵�' }
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
  /**
   * �ռ�������
   * @param start
   * @param end
   * @returns {number}
   * @private
   */

  _surfaceDistance(start, end) {
    //����ߣ������Ͼ��룩
    // let geodesic = new Cesium.EllipsoidGeodesic();
    // let startGeodesic = Cesium.Cartographic.fromCartesian(start); //�ѿ���ϵת��γ��
    // let endGeodesic = Cesium.Cartographic.fromCartesian(end);
    // geodesic.setEndPoints(startGeodesic, endGeodesic);
    // let lengthInMeters = geodesic.surfaceDistance;
    let distance = Cesium.Cartesian3.distance(start, end);
    return parseFloat(distance);
    // return parseFloat(lengthInMeters);
  }
  //���Ҳ�ǿռ���룬���������˵�������ʺͱ���
  // _surfaceDistance(start, end, t) {
  //   let geodesic = new Cesium.EllipsoidGeodesic();
  //   let startGeodesic = Cesium.Cartographic.fromCartesian(start); //�ѿ���ϵת��γ��
  //   let endGeodesic = Cesium.Cartographic.fromCartesian(end);
  //   geodesic.setEndPoints(startGeodesic, endGeodesic);
  //   let lengthInMeters = geodesic.surfaceDistance;

  //   return parseFloat(lengthInMeters);
  // }
  /**
   * �������
   * @param start
   * @param end
   * @param t
   * @private
   */

  _terrianDistance(start, end, t) {
    let level = Math.ceil(Math.log10(t));
    let count = level * 10;
    let lerp = [];
    let vertexLength = 0;
    //�����˵����count����ֵ��
    for (let i = 0; i <= count + 1; i++) {
      let pt = Cesium.Cartesian3.lerp(
        start,
        end,
        i / (count + 1),
        new Cesium.Cartesian3()
      ); //��ֵ��
      let samplePt = window.viewer.scene.clampToHeight(pt); //�߶Ȳ�����
      lerp.push(samplePt);
    }
    //�������߳���
    for (let j = 1; j < lerp.length; j++) {
      let left = lerp[j - 1];
      let right = lerp[j];
      let length = Cesium.Cartesian3.distance(left, right);
      vertexLength += length;
    }
    vertexLength = vertexLength / 1;
    return vertexLength;
  }

  /**
   * ���Ӷ��㳤����Ϣ��
   * @param pos
   * @param totalLength
   * @private
   */
  getLengthText(length) {
    // �������

    if (length > 1000) {
      length = (length / 1000).toFixed(4) + " ����";
    } else {
      length = length + " ��";
    }
    return length;
  }

  _addDistancePoint(pos, totalLength,type) {
    if(type==0){
      this._lineParams.lineDataSource.entities.add({
        position: pos,
        point: {
          color: new Cesium.Color(93 / 255, 0 / 255, 205 / 255, 1.0),
          pixelSize: 10,
          heightReference: Cesium.CLAMP_TO_GROUND,
          disableDepthTestDistance: 15000000,
        },
        label: {
          text: this.getLengthText(totalLength),
          fillColor: Cesium.Color.RED,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          pixelOffset: new Cesium.Cartesian2(10, -10),
          font: "normal 16px",
          disableDepthTestDistance: 15000000,
        },
      });
    }else{
      this._lineParams1.lineDataSource.entities.add({
        position: pos,
        point: {
          color: new Cesium.Color(93 / 255, 0 / 255, 205 / 255, 1.0),
          pixelSize: 10,
          heightReference: Cesium.CLAMP_TO_GROUND,
          disableDepthTestDistance: 15000000,
        },
        label: {
          text: this.getLengthText(totalLength),
          fillColor: Cesium.Color.RED,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          pixelOffset: new Cesium.Cartesian2(10, -10),
          font: "normal 16px",
          disableDepthTestDistance: 15000000,
        },
      });
    }

  }

  /**
   * ����
   * @param type 0-�ռ� 1 ����
   */
  area(type) {

    //Ĭ�ϲ�ռ�
    type = type === undefined ? 0 : type;
    if(type==0){
      this._reset3()
      this._areaParams.areaDataSource = new Cesium.CustomDataSource(
        "areaDataSource"
      );
      this.b.push(this._areaParams.lineDataSource)
      window.viewer.dataSources.add(this._areaParams.areaDataSource);
      window.viewer.scene.globe.depthTestAgainstTerrain = true;
      this._area_handler = new Cesium.ScreenSpaceEventHandler(window.viewer.canvas);
      //����������¼�
      this._area_handler.setInputAction((e) => {
        let pos = window.viewer.scene.pickPosition(e.position);
        let current;
        if (pos) {
          this._areaParams.vertexCollection.push(pos);
        }
     
        if (this._areaParams.vertexCollection.length == 1) {
          //һ����������ƶ���
          current = this._areaParams.areaDataSource.entities.add({
            polyline: {
              // clampToGround: true,
              positions: new Cesium.CallbackProperty(() => {
                let c = Array.from(this._areaParams.vertexCollection);
                if (this._areaParams.mousePos) {
                  c.push(this._areaParams.mousePos);
                }
                return c;
              }, false),
              width: 3,
              material: new Cesium.PolylineOutlineMaterialProperty({
                color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
                outlineColor: new Cesium.Color(
                  255 / 255,
                  180 / 255,
                  115 / 255,
                  1.0
                ),
                outlineWidth: 2,
              }),
            },
          });
        } else {
          // let positions = Array.from(this._areaParams.vertexCollection);
          // positions.push(this._areaParams.mousePos);
    
          // // // ������εĶ���ת��Ϊ��ƽ���ϵ�ͶӰ��
          // let tangentPlane = Cesium.EllipsoidTangentPlane.fromPoints(
          //   positions,
          //   Cesium.Ellipsoid.WGS84
          // );
      
          // let projectedPoints = positions.map((position) => {
          //   let projectedPoint = new Cesium.Cartesian3();
          //   tangentPlane.projectPointOntoPlane(position, projectedPoint);
          //   return Cesium.Cartesian3.clone(projectedPoint);
          // });

          // �������ζ���˳��ȷ����������泯��۲���
          // let windingOrder = Cesium.PolygonPipeline.computeWindingOrder2D(projectedPoints);
          // if (windingOrder === Cesium.WindingOrder.CLOCKWISE) {
          //   projectedPoints.reverse();
          // }

          // return new Cesium.PolygonHierarchy(projectedPoints);
          //2����������ƶ���
          current = this._areaParams.areaDataSource.entities.add({
            polygon: {
              hierarchy: new Cesium.CallbackProperty(() => {


                let positions = Array.from(this._areaParams.vertexCollection);
                positions.push(this._areaParams.mousePos);
    
                return new Cesium.PolygonHierarchy(positions);
              }, false),
              material: new Cesium.Color(255 / 255, 208 / 255, 115 / 255, 0.5),
              // height: 600, // ���ö���θ߶�
              perPositionHeight: true, // ����ÿ������ĸ߶�
              outline: true,
              outlineColor: new Cesium.Color(
                255 / 255,
                180 / 255,
                115 / 255,
                1.0
              ),
              outlineWidth: 1,
            },
            polyline: {
              // clampToGround: true,
              positions: new Cesium.CallbackProperty(() => {
                let c = Array.from(this._areaParams.vertexCollection);
                if (this._areaParams.mousePos) {
                  c.push(this._areaParams.mousePos);
                }
                c.push(this._areaParams.vertexCollection[0]);
                return c;
              }, false),
              width: 3,
              material: new Cesium.PolylineOutlineMaterialProperty({
                color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
                outlineColor: new Cesium.Color(
                  255 / 255,
                  180 / 255,
                  115 / 255,
                  1.0
                ),
                outlineWidth: 2,
              }),
            },
          });
        }
        if (this._areaParams.lastArea) {
          this._areaParams.areaDataSource.entities.remove(
            this._areaParams.lastArea
          );
        }
        this._areaParams.lastArea = current;
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //����ƶ��¼�
      this._area_handler.setInputAction((e) => {
        let endPosition = e.endPosition;
        let endPos = window.viewer.scene.pickPosition(endPosition);
        if (endPos) {
          //����Ƴ�����,undifined
          this._areaParams.mousePos = endPos;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      //����Ҽ��¼�
      this._area_handler.setInputAction((e) => {
  
        let endPosition = e.position;
        let endPos = window.viewer.scene.pickPosition(endPosition);
        if (endPos) {
          this.cancel();
   
          this._areaParams.vertexCollection.push(endPos);
          let area = this._surfaceArea(this._areaParams.vertexCollection);
     
          if (type == 0) {
            this._addAreaPoint(endPos, area);
          } else {
            // this._terrianArea(this._areaParams.vertexCollection, area);
            this.calculateSurfaceAreaNew(this._areaParams1.vertexCollection);
           
          }
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }else{
      this._reset4();
      this._areaParams1.areaDataSource = new Cesium.CustomDataSource(
        "areaDataSource"
      );
      this.b.push(this._areaParams1.lineDataSource)
      window.viewer.dataSources.add(this._areaParams1.areaDataSource);
      window.viewer.scene.globe.depthTestAgainstTerrain = true;
      this._area_handler = new Cesium.ScreenSpaceEventHandler(window.viewer.canvas);
      //����������¼�
      this._area_handler.setInputAction((e) => {
        let pos = window.viewer.scene.pickPosition(e.position);
        let current;
        if (pos) {
          this._areaParams1.vertexCollection.push(pos);
        }
        if (this._areaParams1.vertexCollection.length == 1) {
          //һ����������ƶ���
          current = this._areaParams1.areaDataSource.entities.add({
            polyline: {
              clampToGround: true,
              positions: new Cesium.CallbackProperty(() => {
                let c = Array.from(this._areaParams1.vertexCollection);
                if (this._areaParams1.mousePos) {
                  c.push(this._areaParams1.mousePos);
                }
                return c;
              }, false),
              width: 3,
              material: new Cesium.PolylineOutlineMaterialProperty({
                color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
                outlineColor: new Cesium.Color(
                  255 / 255,
                  180 / 255,
                  115 / 255,
                  1.0
                ),
                outlineWidth: 2,
              }),
            },
          });
        } else {
          //2����������ƶ���
          current = this._areaParams1.areaDataSource.entities.add({
            polygon: {
              hierarchy: new Cesium.CallbackProperty(() => {
                let positions = Array.from(this._areaParams1.vertexCollection);
                positions.push(this._areaParams1.mousePos);
                return new Cesium.PolygonHierarchy(positions);
              }, false),
              material: new Cesium.Color(255 / 255, 208 / 255, 115 / 255, 0.5),
              extrudedHeightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              outline: true,
              outlineColor: new Cesium.Color(
                255 / 255,
                180 / 255,
                115 / 255,
                1.0
              ),
              outlineWidth: 1,
            },
            polyline: {
              clampToGround: true,
              positions: new Cesium.CallbackProperty(() => {
                let c = Array.from(this._areaParams1.vertexCollection);
                if (this._areaParams1.mousePos) {
                  c.push(this._areaParams1.mousePos);
                }
                c.push(this._areaParams1.vertexCollection[0]);
                return c;
              }, false),
              width: 3,
              material: new Cesium.PolylineOutlineMaterialProperty({
                color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
                outlineColor: new Cesium.Color(
                  255 / 255,
                  180 / 255,
                  115 / 255,
                  1.0
                ),
                outlineWidth: 2,
              }),
            },
          });
        }
        if (this._areaParams1.lastArea) {
          this._areaParams1.areaDataSource.entities.remove(
            this._areaParams1.lastArea
          );
        }
        this._areaParams1.lastArea = current;
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      //����ƶ��¼�
      this._area_handler.setInputAction((e) => {
        let endPosition = e.endPosition;
        let endPos = window.viewer.scene.pickPosition(endPosition);
        if (endPos) {
          //����Ƴ�����,undifined
          this._areaParams1.mousePos = endPos;
        }
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      //����Ҽ��¼�
      this._area_handler.setInputAction((e) => {
  
        let endPosition = e.position;
        let endPos = window.viewer.scene.pickPosition(endPosition);
        if (endPos) {
          this.cancel();
   
          this._areaParams1.vertexCollection.push(endPos);
          let area = this._surfaceArea(this._areaParams1.vertexCollection);
     
          if (type == 0) {
            this._addAreaPoint(endPos, area);
          } else {
            this.calculateSurfaceAreaNew(this._areaParams1.vertexCollection);
   
            // this._terrianArea(this._areaParams1.vertexCollection, area);
          }
        }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }
  }
  /**
   * ������ռ����
   * @param vertexCollection
   * @private
   */
  _surfaceArea(vertexCollection) {
    let rings = [];
    vertexCollection.map((vertex) => {
      //�ѿ���ת����
      let carto_pt = Cesium.Cartographic.fromCartesian(vertex);
      //����ת��γ��
      rings.push([
        Cesium.Math.toDegrees(carto_pt.longitude),
        Cesium.Math.toDegrees(carto_pt.latitude),
      ]);
    });
    rings.push(rings[0]);
    //ת��feature Polygon
    let polygon_json = helpers.polygon([rings]);
    //�������
    let surface = area(polygon_json);
    surface = parseFloat(surface);
    return surface;
  }
  /**
   * ���������ע
   * @param pos
   * @param area
   * @private
   */
  getAreaText(area) {
    if (area < 1000000) {
      area = Math.abs(area).toFixed(4) + " ƽ����";
    } else {
      area = Math.abs((area / 1000000.0).toFixed(4)) + " ƽ������";
    }
    return area;
  }

  _addAreaPoint(pos, area) {

      this._areaParams.areaDataSource.entities.add({
        //���㣬�Լ�������Ϣ
       
        position: pos,
        point: {
          color: new Cesium.Color(93 / 255, 200 / 255, 205 / 255, 1.0),
          pixelSize: 10,
          // heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND
          heightReference: Cesium.CLAMP_TO_GROUND,
          disableDepthTestDistance: 15000000,
        },
        label: {
          text: this.getAreaText(area),
          fillColor: Cesium.Color.RED,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 2,
          pixelOffset: new Cesium.Cartesian2(10, -10),
          font: "normal 16px",
          disableDepthTestDistance: 15000000,
        },
      });
    

  }
  _addAreaPoint1(pos, area) {

    this._areaParams1.areaDataSource.entities.add({
      //���㣬�Լ�������Ϣ
     
      position: pos,
      point: {
        color: new Cesium.Color(93 / 255, 200 / 255, 205 / 255, 1.0),
        pixelSize: 10,
        // heightReference:Cesium.HeightReference.RELATIVE_TO_GROUND
        heightReference: Cesium.CLAMP_TO_GROUND,
        disableDepthTestDistance: 15000000,
      },
      label: {
        text: this.getAreaText(area),
        fillColor: Cesium.Color.RED,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        pixelOffset: new Cesium.Cartesian2(10, -10),
        font: "normal 16px",
        disableDepthTestDistance: 15000000,
      },
    });
  

}
  /**
   * �����������
   * @param vertexCollection
   * @param surface_area
   * @private
   */
  _terrianArea(vertexCollection, surface_area) {
    let rings = [];
    let totalArea = 0;
    let level = Math.ceil(Math.log10(surface_area));
    let count = 0;
    if (level < 1) {
      count = 30;
    } else {
      count = 40 * level;
    }
    let random_pt = {
      features: [],
    };
    vertexCollection.map((vertex) => {
      //ת����
      let carto_pt = Cesium.Cartographic.fromCartesian(vertex);
      //ת��γ��
      rings.push([
        Cesium.Math.toDegrees(carto_pt.longitude),
        Cesium.Math.toDegrees(carto_pt.latitude),
      ]);
    });
    rings.push(rings[0]);
    let polygon_json = helpers.polygon([rings]);
    //��ȡ�������߽��ڵ������
    let bbox_random_pt = random.randomPoint(count, {
      bbox: bbox(polygon_json),
    });
    bbox_random_pt.features.map((pt) => {
      //��ȡ������ڵ������
      let coordinates = pt.geometry.coordinates;
      let turf_pt = helpers.point([coordinates[0], coordinates[1]]);

      if (booleanPointInPolygon(turf_pt, polygon_json)) {
        random_pt.features.push(pt);
      }
    });
    let random_tin = tin(random_pt); //����������
    //���и߶Ȳ������������������
    random_tin.features.map((tin) => {
      let [point_1, point_2, point_3] = [
        tin.geometry.coordinates[0][0],
        tin.geometry.coordinates[0][1],
        tin.geometry.coordinates[0][2],
      ];
      let sample_pt1 = this._sampleHeightFromCoordinate(point_1);
      let sample_pt2 = this._sampleHeightFromCoordinate(point_2);
      let sample_pt3 = this._sampleHeightFromCoordinate(point_3);
      let distance_1 = Cesium.Cartesian3.distance(sample_pt1, sample_pt2);
      let distance_2 = Cesium.Cartesian3.distance(sample_pt2, sample_pt3);
      let distance_3 = Cesium.Cartesian3.distance(sample_pt1, sample_pt3);
      let p = (distance_1 + distance_2 + distance_3) / 2;
      let tin_area = Math.sqrt(
        p * (p - distance_1) * (p - distance_2) * (p - distance_3)
      );
      this._areaParams1.areaDataSource.entities.add({
        polyline: {
          clampToGround: true,
          positions: [sample_pt1, sample_pt2, sample_pt3],
          width: 3,
          material: new Cesium.PolylineOutlineMaterialProperty({
            color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
            outlineColor: new Cesium.Color(
              255 / 255,
              180 / 255,
              115 / 255,
              1.0
            ),
            outlineWidth: 2,
          }),
        },
      });
      totalArea += tin_area;
    });

    // totalArea = parseFloat((totalArea / 1000000).toFixed(3));
    this._addAreaPoint1(
      window.viewer.scene.clampToHeight(this._areaParams1.vertexCollection[0]),
      totalArea
    );
  }
  calculateSurfaceAreaNew(positions) {
    let totalArea = 0;
    let i0, i1, i2;
    let cartographic;
    let bottomP1, bottomP2, bottomP3;
    let granularity = Math.PI / Math.pow(2, 11);
    granularity = granularity / 64;
    const polygonGeometry = Cesium.PolygonGeometry.fromPositions({
      positions: positions,
      vertexFormat: Cesium.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
      granularity: granularity,
    });
    const scratchCartesian1 = new Cesium.Cartesian3();
    const scratchCartesian2 = new Cesium.Cartesian3();
    const scratchCartesian3 = new Cesium.Cartesian3();
    let subTrianglePositions;
    const geom = Cesium.PolygonGeometry.createGeometry(polygonGeometry);
    for (let i = 0; i < geom.indices.length; i += 3) {
      i0 = geom.indices[i];
      i1 = geom.indices[i + 1];
      i2 = geom.indices[i + 2];
  
      subTrianglePositions = geom.attributes.position.values;
      if (subTrianglePositions) {
        scratchCartesian1.x = subTrianglePositions[i0 * 3];
        scratchCartesian1.y = subTrianglePositions[i0 * 3 + 1];
        scratchCartesian1.z = subTrianglePositions[i0 * 3 + 2];
      }
  
      cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian1);
      const height = window.viewer.scene.globe.getHeight(cartographic);
      bottomP1 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height);
  
      if (subTrianglePositions) {
        scratchCartesian2.x = subTrianglePositions[i1 * 3];
        scratchCartesian2.y = subTrianglePositions[i1 * 3 + 1];
        scratchCartesian2.z = subTrianglePositions[i1 * 3 + 2];
      }
      cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian2);
      const height1 = window.viewer.scene.globe.getHeight(cartographic);
      bottomP2 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height1);
  
      if (subTrianglePositions) {
        scratchCartesian3.x = subTrianglePositions[i2 * 3];
        scratchCartesian3.y = subTrianglePositions[i2 * 3 + 1];
        scratchCartesian3.z = subTrianglePositions[i2 * 3 + 2];
      }
      cartographic = Cesium.Cartographic.fromCartesian(scratchCartesian3);
      const height2 = window.viewer.scene.globe.getHeight(cartographic);
      bottomP3 = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, height2);
  
      totalArea += this.computeAreaOfTriangle(bottomP1, bottomP2, bottomP3);
    }
    this._addAreaPoint1(
      window.viewer.scene.clampToHeight(this._areaParams1.vertexCollection[0]),
      totalArea
    );
    return totalArea;
  }
  
  computeAreaOfTriangle(pos1, pos2, pos3) {
    const a = Cesium.Cartesian3.distance(pos1, pos2);
    const b = Cesium.Cartesian3.distance(pos2, pos3);
    const c = Cesium.Cartesian3.distance(pos3, pos1);
  
    const s = (a + b + c) / 2;
  
    return Math.sqrt(s * (s - a) * (s - b) * (s - c));
  }
  /**
   * �����θ߶�
   * @param coordinate
   * @returns {Cartesian3}
   * @private
   */
  _sampleHeightFromCoordinate(coordinate) {
    let c3_pt = Cesium.Cartesian3.fromDegrees(coordinate[0], coordinate[1]);
    let sample_pt = window.viewer.scene.clampToHeight(c3_pt);
    return sample_pt;
  }

  /**
   * ���ӱ�ǩ
   * @param position
   * @param text
   */
  addLabel(centerPoint, text) {
    return window.viewer.entities.add(
      new Cesium.Entity({
        position: centerPoint,
        label: {
          text: text,
          font: "14px sans-serif",
          style: Cesium.LabelStyle.FILL_AND_OUTLINE, //FILL  FILL_AND_OUTLINE OUTLINE
          fillColor: Cesium.Color.YELLOW,
          showBackground: true, //ָ����ǩ���汳���Ŀɼ���
          backgroundColor: new Cesium.Color(0.165, 0.165, 0.165, 0.8), // ������ɫ
          backgroundPadding: new Cesium.Cartesian2(6, 6), //ָ��������Ϊ��λ��ˮƽ�ʹ�ֱ�������padding
          pixelOffset: new Cesium.Cartesian2(0, -25),
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
        },
      })
    );
  }

  /**
   * �����߶ȣ����ǲ���
   */
  getLengthTextHeight(firstPoint, secondPoint) {
    // �������
    var length = Cesium.Cartesian3.distance(firstPoint, secondPoint);
    if (length > 1000) {
      length = (length / 1000).toFixed(2) + " ����";
    } else {
      length = length.toFixed(2) + " ��";
    }
    return length;
  }

  measureHeight(callback) {
    var positions = [];
    var labelEntity_1 = null; // ��ǩʵ��
    var labelEntity_2 = null; // ��ǩʵ��
    var labelEntity_3 = null; // ��ǩʵ��
            window.viewer.scene.globe.depthTestAgainstTerrain=true
    // ע���������¼�
    window.viewer.screenSpaceEventHandler.setInputAction((clickEvent) => {
      var cartesian = window.viewer.scene.pickPosition(clickEvent.position); // ����
      // �洢��һ����

      if (positions.length == 0) {
        if (!cartesian) {
          return false;
        }
        let line1={
          vertexCollection:[],
          mousePos: null,
        }
        let line2={
          vertexCollection:[],
          mousePos: null,
        }
        let line3={
          vertexCollection:[],
          mousePos: null,
          firstPos:null,
        }
        line2.vertexCollection.push(cartesian)
        line1.vertexCollection.push(cartesian)
        positions.push(cartesian.clone());
        let a=  window.viewer.entities.add({
          polyline: {
            positions: new Cesium.CallbackProperty(() => {
              let c = Array.from(line1.vertexCollection);
              if (line1.mousePos) {
                c.push(line1.mousePos);
              }
              return c;
            }, false),

            width: 3,
            material: new Cesium.PolylineOutlineMaterialProperty({
              color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
              outlineColor: new Cesium.Color(
                255 / 255,
                180 / 255,
                115 / 255,
                1.0
              ),
              outlineWidth: 2,
            }),
          },
        });
        this.a.push(a)
        let b= window.viewer.entities.add({
          polyline: {
            positions: new Cesium.CallbackProperty(() => {
              let c = Array.from(line2.vertexCollection);
              if (line2.mousePos) {
                c.push(line2.mousePos);
              }
              return c;
            }, false),

            width: 3,
            material: new Cesium.PolylineOutlineMaterialProperty({
              color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
              outlineColor: new Cesium.Color(
                255 / 255,
                180 / 255,
                115 / 255,
                1.0
              ),
              outlineWidth: 2,
            }),
          },
        });
        this.a.push(b)
        let c= window.viewer.entities.add({
          polyline: {
            positions: new Cesium.CallbackProperty(() => {
              let c = Array.from(line3.vertexCollection);
              if (line3.mousePos) {
                c.push(line3.mousePos);
              }
              if (line3.firstPos) {
                c.push(line3.firstPos);
              }
              return c;
            }, false),

            width: 3,
            material: new Cesium.PolylineOutlineMaterialProperty({
              color: new Cesium.Color(255 / 255, 118 / 255, 0 / 255, 1.0),
              outlineColor: new Cesium.Color(
                255 / 255,
                180 / 255,
                115 / 255,
                1.0
              ),
              outlineWidth: 2,
            }),
          },
        });
        this.a.push(c)
        window.viewer.screenSpaceEventHandler.setInputAction((moveEvent) => {
          var movePosition = window.viewer.scene.pickPosition(
            moveEvent.endPosition
          ); 

          if (movePosition) {
            //����Ƴ�����,undifined
            line1.mousePos=movePosition
            //entity polyline ��ʹ����Cesium CallbackProperty ��ȥ�ƶ��ٻ���
          }

          if (!movePosition) {
            return false;
          }

          if (positions.length >= 2) {
            positions.pop();
            positions.pop();
            positions.pop();

            var cartographic = Cesium.Cartographic.fromCartesian(movePosition);
            var height = Cesium.Cartographic.fromCartesian(positions[0]).height;

            var verticalPoint = Cesium.Cartesian3.fromDegrees(
              Cesium.Math.toDegrees(cartographic.longitude),
              Cesium.Math.toDegrees(cartographic.latitude),
              height
            );
            positions.push(verticalPoint);
            positions.push(movePosition);
            positions.push(positions[0]);
            // ����label
            if (labelEntity_1) {
              window.viewer.entities.remove(labelEntity_1);
              this.entityCollection.splice(
                this.entityCollection.indexOf(labelEntity_1),
                1
              );
              window.viewer.entities.remove(labelEntity_2);
              this.entityCollection.splice(
                this.entityCollection.indexOf(labelEntity_2),
                1
              );
              window.viewer.entities.remove(labelEntity_3);
              this.entityCollection.splice(
                this.entityCollection.indexOf(labelEntity_3),
                1
              );
            }
            // �����е�
            var centerPoint_1 = Cesium.Cartesian3.midpoint(
              positions[0],
              positions[1],
              new Cesium.Cartesian3()
            );
            // �������
            var lengthText_1 =
              "ˮƽ���룺" +
              this.getLengthTextHeight(positions[0], positions[1]);

            labelEntity_1 = this.addLabel(centerPoint_1, lengthText_1);
            this.entityCollection.push(labelEntity_1);
            if (positions[1]) {
              //����Ƴ�����,undifined
              line2.mousePos=positions[1]
  
            }
            if (positions[1]) {
              //����Ƴ�����,undifined
              line3.mousePos=positions[1]
              line3.firstPos=positions[2]
            }
            // �����е�
            var centerPoint_2 = Cesium.Cartesian3.midpoint(
              positions[1],
              positions[2],
              new Cesium.Cartesian3()
            );
            // �������
            var lengthText_2 =
              "��ֱ���룺" +
              this.getLengthTextHeight(positions[1], positions[2]);
            labelEntity_2 = this.addLabel(centerPoint_2, lengthText_2);
            this.entityCollection.push(labelEntity_2);
            
            // �����е�
            var centerPoint_3 = Cesium.Cartesian3.midpoint(
              positions[2],
              positions[3],
              new Cesium.Cartesian3()
            );
            // �������
            var lengthText_3 =
              "ֱ�߾��룺" +
              this.getLengthTextHeight(positions[2], positions[3]);

            labelEntity_3 = this.addLabel(centerPoint_3, lengthText_3);
            this.entityCollection.push(labelEntity_3);
          } else {
            var verticalPoint = new Cesium.Cartesian3(
              movePosition.x,
              movePosition.y,
              positions[0].z
            );
            positions.push(verticalPoint);
            positions.push(movePosition);
            positions.push(positions[0]);
            
          }
        }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      } else {
        // �洢�ڶ�����
        positions.pop();
        positions.pop();
        positions.pop();
        var cartographic = Cesium.Cartographic.fromCartesian(cartesian);
        var height = Cesium.Cartographic.fromCartesian(positions[0]).height;

        var verticalPoint = Cesium.Cartesian3.fromDegrees(
          Cesium.Math.toDegrees(cartographic.longitude),
          Cesium.Math.toDegrees(cartographic.latitude),
          height
        );
        positions.push(verticalPoint);
        positions.push(cartesian);
        positions.push(positions[0]);
        
        let d= window.viewer.entities.add({
          position: cartesian,
          point: {
            color: new Cesium.Color(93 / 255, 200 / 255, 205 / 255, 1.0),
            pixelSize: 10,
            // heightReference: Cesium.CLAMP_TO_GROUND,
            // disableDepthTestDistance: 15000000,
          },
        });
        this.a.push(d)
        window.viewer.screenSpaceEventHandler.removeInputAction(
          Cesium.ScreenSpaceEventType.LEFT_CLICK
        );
        window.viewer.screenSpaceEventHandler.removeInputAction(
          Cesium.ScreenSpaceEventType.MOUSE_MOVE
        );

        if (callback) {
          callback();
        }
      }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  /**
   * �Ƴ������¼�
   */
  cancel() {
    this.profileItem = []
    if(this._area_handler){
      this._area_handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOWN)
    }

    this._distance_handler &&
      (this._distance_handler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOWN
      ),
      this._distance_handler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      ),
      this._distance_handler.removeInputAction(
        Cesium.ScreenSpaceEventType.RIGHT_DOWN
      ),
      this._distance_handler.destroy(),
      (this._distance_handler = null));
    this._area_handler &&
      (this._area_handler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOWN
      ),
      this._area_handler.removeInputAction(
        Cesium.ScreenSpaceEventType.MOUSE_MOVE
      ),
      this._area_handler.removeInputAction(
        Cesium.ScreenSpaceEventType.RIGHT_DOWN
      ),
      this._area_handler.destroy(),
      (this._area_handler = null));
  }

  /**
   * ����
   * @private
   */
  changeP(){
    this.proJudge=true
  }
  changeP1(){
    this.proJudge=false
  }
  _reset1() {
    this._lineParams = {
      //���ߵı���

      vertexCollection: [], //�洢�����߶�����Ϣ
      mousePos: null,
      lastLine: null,
      totalLength: 0,
    };
  }
  _reset2() {
    this._lineParams1 = {
      //���ߵı���

      vertexCollection: [], //�洢�����߶�����Ϣ
      mousePos: null,
      lastLine: null,
      totalLength: 0,
    };

  }
  _reset3() {
    this._areaParams.vertexCollection = [];
    if (this._areaParams.lastArea) {
      this._areaParams.areaDataSource.entities.remove(this._areaParams.lastArea);
      this._areaParams.areaDataSource.entities.removeAll();
      this._areaParams.lastArea = null;
    }
  }
  _reset4() {

    this._areaParams1.vertexCollection = [];

    if (this._areaParams1.lastArea) {
      this._areaParams1.areaDataSource.entities.removeAll();
      this._areaParams1.areaDataSource.entities.remove(this._areaParams1.lastArea);
      this._areaParams1.lastArea = null;
    }
  }

  /**
   * ���
   */
  clearAll() {

    if (this._lineParams.lineDataSource != null) {
      for (let i = 0; i < this.b.length; i++) {
        window.viewer.dataSources.remove(this.b[i])
        }

      this._lineParams.lineDataSource.entities.removeAll();
      window.viewer.dataSources.remove(this._lineParams.lineDataSource);
    }
    // if (this._areaParams.areaDataSource != null) {
    //   for (let i = 0; i < this.b.length; i++) {
    //     window.viewer.dataSources.remove(this.b[i])
       
    //     }
       
    //   this._areaParams.areaDataSource.entities.removeAll();
    //   window.viewer.dataSources.remove(this._areaParams.areaDataSource);
    // }
    if (this._lineParams1.lineDataSource != null) {
      for (let i = 0; i < this.b.length; i++) {
        window.viewer.dataSources.remove(this.b[i])
        }
      this._lineParams1.lineDataSource.entities.removeAll();
      window.viewer.dataSources.remove(this._lineParams1.lineDataSource);
    }

    this.cancel();
    this._reset1();
    this._reset2();
    this._reset3();
    this._reset4();
    for (let i = 0; i < this.a.length; i++) {
      window.viewer.entities.remove(this.a[i])
      window.viewer.entities.remove(this.entityCollection[i])
      }
  }
}
export default measure;
