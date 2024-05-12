import * as Cesium from 'cesium'
export default class SplitCircle {
  handler
  constructor(options) {
      this.viewer = options.viewer;
      // this.viewer.scene.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      this.initEvents();
  }
  //����
  activate() {
      this.deactivate();
      this.clear();
      this.positions = [];
      this.tempPositions = [];
      this.registerEvents(); //ע������¼�

      //�������״̬
      this.viewer.enableCursorStyle = false;
      this.viewer._element.style.cursor = 'default';
  }

  //����
  deactivate() {
      this.unRegisterEvents();
      // this.viewer._element.style.cursor = 'pointer';
      this.viewer.enableCursorStyle = true;
  }

  //��ջ���
  clear() {
      if (this.circleEntity) {
          this.viewer.entities.remove(this.circleEntity);
          this.circleEntity = undefined;
      }
      if (this.viewEntity) {
          this.viewer.entities.remove(this.viewEntity);
          this.viewEntity = undefined;
      }

      if (this.resultPolylines) {
          this.resultPolylines.forEach((item) => {
              this.viewer.entities.remove(item);
          })
      }
  }

  //��ʼ���¼�
  initEvents() {
      this.handler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
  }

  //ע������¼�
  registerEvents() {
      this.leftClickEvent();
      this.rightClickEvent();
      this.mouseMoveEvent();
  }

  leftClickEvent() {
      //��������������
      this.handler.setInputAction(e => {
          this.viewer._element.style.cursor = 'default';
          let position = this.viewer.scene.pickPosition(e.position);
          if (!position) {
              position = this.viewer.scene.camera.pickEllipsoid(e.position, this.viewer.scene.globe.ellipsoid);
          }
          if (!position) return;
          this.positions.push(position);
          if (this.positions.length == 1) {
              this.tempPositions.push(position);
              this.handleFirstPosition();
          } else { //����ʱ����
              this.drawEnd();
          }
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }

  //�����һ����
  handleFirstPosition() {
      this.generateView();
      this.generateCircle();
  }

  //�����߶���
  generateCircle() {
      this.circleEntity = this.viewer.entities.add({
          name: 'generate_',
          position: this.positions[0],
          ellipse: {
              semiMinorAxis: new Cesium.CallbackProperty(e => {
                  return this.getRadius();
              }, false),
              semiMajorAxis: new Cesium.CallbackProperty(e => {
                  return this.getRadius();
              }, false),
              material: Cesium.Color.RED.withAlpha(0.6),
              classificationType: Cesium.ClassificationType.BOTH
          }
      })
  }

  //Բ�뾶
  getRadius() {
      let p1 = this.tempPositions[0];
      let p2 = this.tempPositions[0];
      if (this.tempPositions.length > 1) p2 = this.tempPositions[1];
      let distance = Cesium.Cartesian3.distance(p1, p2);
      return distance == 0 ? 0.000001 : distance;
  }

  //��ӹ۲��
  generateView() {
      this.viewEntity = this.viewer.entities.add({
          name: 'generate_text',
          position: this.positions[0],
          label: {
              text: '�۲�λ��',
              fillColor: Cesium.Color.WHITE,
              scale: 0.5,
              font: 'normal 34px MicroSoft YaHei',
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000),
              scaleByDistance: new Cesium.NearFarScalar(500, 1, 1500, 0.4),
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              pixelOffset: new Cesium.Cartesian2(0, -20),
              outlineWidth: 3,
              outlineColor: Cesium.Color.BLACK
          },
          point: {
              color: Cesium.Color.DODGERBLUE,
              pixelSize: 5,
              outlineColor: Cesium.Color.WHITE,
              outlineWidth: 2,
              scaleByDistance: new Cesium.NearFarScalar(1000, 1, 4200, 0.4),
              disableDepthTestDistance: 500
          }
      })
  }

  //����ƶ��¼�
  mouseMoveEvent() {
      this.handler.setInputAction(e => {
          this.viewer._element.style.cursor = 'default'; //��������ƶ�ʱ Cesium��Ĭ�Ͻ������ʽ�޸�Ϊ�ֱ� �����ƶ�ʱ�ֶ����û���
          let position = this.viewer.scene.pickPosition(e.endPosition);
          if (!position) {
              position = this.viewer.scene.camera.pickEllipsoid(e.startPosition, this.viewer.scene.globe.ellipsoid);
          }
          if (!position) return;
          if (!this.circleEntity) return;
          this.tempPositions = this.positions.concat([position]);
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  }

  rightClickEvent() {
      this.handler.setInputAction(e => {
          if (!this.circleEntity) {
              this.deactivate()
              return;
          }
          if (this.positions.length < 2) {
              this.clear();
              this.deactivate();
              return;
          }
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
  }

  //�������¼�
  unRegisterEvents() {
      this.handler.removeInputAction(Cesium.ScreenSpaceEventType.RIGHT_CLICK);
      this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
      this.handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
      this.handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  }

  //���ƽ��� ���������¼�
  drawEnd() {
      this.startnalysis();
      this.viewer.entities.remove(this.circleEntity);
      this.deactivate();
  }

  //��ʼ����
  startnalysis() {
    function getCirclePoint(lon, lat, angle, radius) {
      let dx = radius * Math.sin(angle * Math.PI / 180.0);
      let dy = radius * Math.cos(angle * Math.PI / 180.0);
      let ec = 6356725 + (6378137 - 6356725) * (90.0 - lat) / 90.0;
      let ed = ec * Math.cos(lat * Math.PI / 180);
      let newLon = (dx / ed + lon * Math.PI / 180.0) * 180.0 / Math.PI;
      let newLat = (dy / ec + lat * Math.PI / 180.0) * 180.0 / Math.PI;
      return [newLon, newLat];
  }
   function  generateCirclePoints(center, radius, steps) {
      let points = [];
      steps = steps || 360;
      let num = parseInt(360 / steps);
      for (let i = 0; i <= 360; i += num) {
          points.push(getCirclePoint(center[0], center[1], i, radius))
      }
      return points;
  }
      const c = Cesium.Cartographic.fromCartesian(this.positions[0]);
      const center = [Cesium.Math.toDegrees(c.longitude), Cesium.Math.toDegrees(c.latitude)]
      let circlePoints = generateCirclePoints(center, this.getRadius());
      let targetPositions = this.point2dToPoint3d(circlePoints);
      this.resultPolylines = [];
      let direction, ray, result, lines;
      for (let i = 0; i < targetPositions.length; i++) {
          // �������ߵķ���Ŀ���left �����right
          direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(targetPositions[i], this.positions[0], new Cesium.Cartesian3()), new Cesium.Cartesian3());
          // ��������
          ray = new Cesium.Ray(this.positions[0], direction);
          result = this.viewer.scene.pickFromRay(ray, [this.viewEntity, this.targetEntity]); // ���㽻���㣬���ص�һ��
          lines = this.showIntersection(result, targetPositions[i], this.positions[0]);
          this.resultPolylines = this.resultPolylines.concat(lines);
      }
  }

  //��ά��ת��ά��
  point2dToPoint3d(point2ds) {
      let point3ds = [];
      for (let i = 0; i < point2ds.length; i++) {
          const item = point2ds[i];
          const cartesian3 = Cesium.Cartesian3.fromDegrees(item[0], item[1], 0); //û�и߶ȵĵѿ����������
          const c = this.viewer.scene.clampToHeight(cartesian3);
          point3ds.push(c);
      }
      return point3ds;
  }

  // ��������
  showIntersection(result, destPoint, viewPoint) {
      let resultPolylines = [];
      let resultLine;
      // ����ǳ���ģ�͵Ľ����㣬�ų��������ǵ������
      if (Cesium.defined(result) && Cesium.defined(result.object)) {
          resultLine = this.drawResultLine(result.position, viewPoint, Cesium.Color.CHARTREUSE); // ��������
          resultPolylines.push(resultLine);
          resultLine = this.drawResultLine(result.position, destPoint, Cesium.Color.RED); // ����������
          resultPolylines.push(resultLine);
      } else {
          resultLine = this.drawResultLine(viewPoint, destPoint, Cesium.Color.CHARTREUSE);
          resultPolylines.push(resultLine);
      }
      return resultPolylines;
  }

  // ���ƽ����
  drawResultLine(leftPoint, secPoint, color) {
      return this.viewer.entities.add({
          name: 'generate_line',
          polyline: {
              positions: [leftPoint, secPoint],
              width: 2,
              material: color,
              // depthFailMaterial: color
          }
      })
  }

}