// DrawCurve
/*
绘制曲线
 */
class DrawCurve {
    constructor(arg) {
        //设置唯一id 备用
        this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0));
        this.viewer = arg.viewer;
        this.Cesium = arg.Cesium;
        this.floatingPoint = null;//标识点
        this._curveline = null; //活动曲线
        this._curvelineLast = null; //最后一条曲线
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_line = [];  //脏数据
        this._curvelineData = null; //用于构造曲线数据
    }

    //返回最后活动曲线
    get curveline() {
        return this._curvelineLast;
    }

    //返回线数据用于加载线
    getData() {
        return this._curvelineData;
    }

    //加载曲线
    loadCurveline(data) {
        var $this = this;
        var points = $this.fineBezier(data);
        var polyline = this.viewer.entities.add({
            polyline: {
                positions: points,
                show: true,
                material: $this.Cesium.Color.RED,
                width: 3,
                clampToGround: true
            }
        });
        polyline.objId = this.objId;
        return polyline;
    }

    //开始创建
    startCreate() {
        var $this = this;
        this.handler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.handler.setInputAction(function (evt) { //单机开始绘制
            //屏幕坐标转地形上坐标
            var cartesian = $this.getCatesian3FromPX(evt.position);
            if ($this._positions.length == 0) {
                $this._positions.push(cartesian.clone());
                $this.floatingPoint = $this.createPoint(cartesian);
                $this.createPoint(cartesian);// 绘制点
            }
            $this._positions.push(cartesian);
        }, $this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction(function (evt) { //移动时绘制线
            if ($this._positions.length < 4) return;
            var cartesian = $this.getCatesian3FromPX(evt.endPosition);
            if (!$this.Cesium.defined($this._curveline)) {
                $this._curveline = $this.createCurveline();
            }
            $this.floatingPoint.position.setValue(cartesian);
            if ($this._curveline) {
                $this._positions.pop();
                $this._positions.push(cartesian);
            }
        }, $this.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.setInputAction(function (evt) {
            if (!$this._curveline) return;
            var cartesian = $this.getCatesian3FromPX(evt.position);
            $this._positions.pop();
            $this._positions.push(cartesian);
            $this.createPoint(cartesian);// 绘制点
            $this._curvelineData = $this._positions.concat();
            $this.viewer.entities.remove($this._curveline); //移除
            $this._curveline = null;
            $this._positions = [];
            $this.floatingPoint.position.setValue(cartesian);
            var line = $this.loadCurveline($this._curvelineData); //加载曲线
            $this._entities_line.push(line);
            $this._curvelineLast = line;
        }, $this.Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //创建点
    createPoint(cartesian) {
        var $this = this;
        var point = this.viewer.entities.add({
            position: cartesian,
            point: {
                pixelSize: 10,
                color: $this.Cesium.Color.YELLOW,
            }
        });
        point.objId = this.objId;
        $this._entities_point.push(point);
        return point;
    }

    //创建曲线
    createCurveline() {
        var $this = this;
        var polyline = this.viewer.entities.add({
            polyline: {
                //使用cesium的peoperty
                positions: new $this.Cesium.CallbackProperty(function () {
                    return $this.fineBezier($this._positions);
                }, false),
                show: true,
                material: $this.Cesium.Color.RED,
                width: 3,
                clampToGround: true
            }
        });
        polyline.objId = this.objId;
        $this._entities_line.push(polyline);
        return polyline;
    }

    //销毁
    destroy() {
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
    }

    //清空实体对象
    clear() {
        for (var i = 0; i < this._entities_point.length; i++) {
            this.viewer.entities.remove(this._entities_point[i]);
        }
        for (var i = 0; i < this._entities_line.length; i++) {
            this.viewer.entities.remove(this._entities_line[i]);
        }
        this.floatingPoint = null;//标识点
        this._curveline = null; //活动曲线
        this._curvelineLast = null; //最后一条曲线
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_line = [];  //脏数据
        this._curvelineData = null; //用于构造曲线数据
    }

    getCatesian3FromPX(px) {
        var cartesian;
        var ray = this.viewer.camera.getPickRay(px);
        if (!ray) return null;
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        return cartesian;
    }

    cartesianToLatlng(cartesian) {
        var latlng = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        var lat = this.Cesium.Math.toDegrees(latlng.latitude);
        var lng = this.Cesium.Math.toDegrees(latlng.longitude);
        return [lng, lat];
    }

    /////////////////////////////////////贝塞尔曲线实现//////////////////////////////////////

    fineBezier(points) {
        var $this = this;
        var pointNUM = 40; //个点
        var poins2D = [];
        var d = [];
        for (var i = 0; i < points.length; i++) {
            var res = $this.cartesianToLatlng(points[i]);
            var point = new Object();
            point.x = res[0];
            point.y = res[1];
            poins2D.push(point);
        }
        var cbs = $this.ComputeBezier(poins2D, pointNUM);
        for (var j = 0; j < cbs.length; j++) {
            d.push(cbs[j].x);
            d.push(cbs[j].y);
        }
        return $this.Cesium.Cartesian3.fromDegreesArray(d);
    }

    /*
 cp在此是四個元素的陣列:
 cp[0]為起始點，或上圖中的P0
 cp[1]為第一個控制點，或上圖中的P1
 cp[2]為第二個控制點，或上圖中的P2
 cp[3]為結束點，或上圖中的P3
 t為參數值，0 <= t <= 1
*/
    PointOnCubicBezier(cp, t) {
        var ax, bx, cx;
        var ay, by, cy;
        var tSquared, tCubed;
        var result = new Object();
        var length = cp.length;
        var inteval = Math.floor(length / 4);// 向下取整
        /*計算多項式係數*/
        cx = 3.0 * (cp[inteval].x - cp[0].x);
        bx = 3.0 * (cp[2 * inteval].x - cp[inteval].x) - cx;
        ax = cp[length - 1].x - cp[0].x - cx - bx;
        cy = 3.0 * (cp[inteval].y - cp[0].y);
        by = 3.0 * (cp[2 * inteval].y - cp[inteval].y) - cy;
        ay = cp[length - 1].y - cp[0].y - cy - by;
        /*計算位於參數值t的曲線點*/
        tSquared = t * t;
        tCubed = tSquared * t;
        result.x = (ax * tCubed) + (bx * tSquared) + (cx * t) + cp[0].x;
        result.y = (ay * tCubed) + (by * tSquared) + (cy * t) + cp[0].y;
        return result;
    }

    /*
 ComputeBezier以控制點cp所產生的曲線點，填入Point2D結構的陣列。
 呼叫者必須分配足夠的記憶體以供輸出結果，其為<sizeof(Point2D) numberOfPoints>
*/
    ComputeBezier(cp, numberOfPoints) {
        var $this = this;
        var dt;
        var i;
        var curve = [];
        dt = 1.0 / (numberOfPoints - 1);
        for (i = 0; i < numberOfPoints; i++) {
            curve[i] = $this.PointOnCubicBezier(cp, i * dt);
        }
        return curve
    }
}

export default DrawCurve