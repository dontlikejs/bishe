// DrawstraightArrow
/*
绘制箭头
 */
class DrawstraightArrow {
    constructor(arg) {
        this.viewer = arg.viewer;
        this.Cesium = arg.Cesium;
        this.floatingPoint = null;//标识点
        this._straightArrow = null; //活动箭头
        this._straightArrowLast = null; //最后一个箭头
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_straightArrow = [];  //脏数据
        this._straightArrowData = null; //用于构造箭头数据
    }

    //返回箭头
    get straightArrow() {
        return this._straightArrowLast;
    }

    //返回箭头数据用于加载箭头
    getData() {
        return this._straightArrowData;
    }

    //加载箭头
    loadStraightArrow(data) {
        var $this = this;
        if (data.length < 2) {
            return null;
        }
        var length = data.length;
        var p1 = data[0];
        var p2 = data[length - 1];
        var firstPoint = $this.cartesianToLatlng(p1);
        var endPoints = $this.cartesianToLatlng(p2);
        var arrow = [];
        var res = $this.fineArrow([firstPoint[0], firstPoint[1]], [endPoints[0], endPoints[1]]);
        for (var i = 0; i < res.length; i++) {
            var cart3 = new $this.Cesium.Cartesian3(res[i].x, res[i].y, res[i].z);
            arrow.push(cart3);
        }
        var arrowEntity = $this.viewer.entities.add({
            polygon: {
                hierarchy: new $this.Cesium.PolygonHierarchy(arrow),
                show: true,
                fill: true,
                clampToGround: true,
                material: $this.Cesium.Color.AQUA.withAlpha(0.5)
            }
        });
        return arrowEntity;
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
            }
            if (!$this._straightArrow) {
                $this.createPoint(cartesian);// 绘制点
            }
            $this._positions.push(cartesian);

        }, $this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction(function (evt) { //移动时绘制面
            if ($this._positions.length < 2) return;
            var cartesian = $this.getCatesian3FromPX(evt.endPosition);
            if (!$this.Cesium.defined($this._straightArrow)) {
                $this._straightArrow = $this.createStraightArrow();
            }
            $this.floatingPoint.position.setValue(cartesian);
            if ($this._straightArrow) {
                $this._positions.pop();
                $this._positions.push(cartesian);
            }
        }, $this.Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        this.handler.setInputAction(function (evt) {
            if (!$this._straightArrow) return;
            var cartesian = $this.getCatesian3FromPX(evt.position);
            $this._positions.pop();
            $this._positions.push(cartesian);
            $this._straightArrowData = $this._positions.concat();
            $this.viewer.entities.remove($this._straightArrow); //移除
            $this._straightArrow = null;
            $this._positions = [];
            $this.floatingPoint.position.setValue(cartesian);
            var straightArrow = $this.loadStraightArrow($this._straightArrowData); //加载
            $this._entities_straightArrow.push(straightArrow);
            $this._straightArrowLast = straightArrow;
            $this.clearPoint();
        }, $this.Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //创建直线箭头
    createStraightArrow() {
        var $this = this;
        var arrowEntity = $this.viewer.entities.add({
                polygon: {
                    hierarchy: new $this.Cesium.CallbackProperty(
                        function () {
                            // return new $this.Cesium.PolygonHierarchy($this._positions);
                            var length = $this._positions.length;
                            var p1 = $this._positions[0];
                            var p2 = $this._positions[length - 1];
                            var firstPoint = $this.cartesianToLatlng(p1);
                            var endPoints = $this.cartesianToLatlng(p2);
                            var arrow = [];
                            var res = $this.fineArrow([firstPoint[0], firstPoint[1]], [endPoints[0], endPoints[1]]);
                            for (var i = 0; i < res.length; i++) {
                                var cart3 = new $this.Cesium.Cartesian3(res[i].x, res[i].y, res[i].z);
                                arrow.push(cart3);
                            }
                            return new $this.Cesium.PolygonHierarchy(arrow);

                        }, false),
                    show: true,
                    fill: true,
                    clampToGround: true,
                    material: $this.Cesium.Color.AQUA.withAlpha(0.5)
                }
            }
        )
        $this._entities_straightArrow.push(arrowEntity);
        return arrowEntity
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
        $this._entities_point.push(point);
        return point;
    }

    cartesianToLatlng(cartesian) {
        var latlng = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian);
        var lat = this.Cesium.Math.toDegrees(latlng.latitude);
        var lng = this.Cesium.Math.toDegrees(latlng.longitude);
        return [lng, lat];
    }

    //销毁
    destroy() {
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
    }

    clearPoint() {
        for (var i = 0; i < this._entities_point.length; i++) {
            this.viewer.entities.remove(this._entities_point[i]);
        }
        this._entities_point = [];  //脏数据
    }

    //清空实体对象
    clear() {
        for (var i = 0; i < this._entities_point.length; i++) {
            this.viewer.entities.remove(this._entities_point[i]);
        }
        for (var i = 0; i < this._entities_straightArrow.length; i++) {
            this.viewer.entities.remove(this._entities_straightArrow[i]);
        }

        this.floatingPoint = null;//标识点
        this._straightArrow = null; //活动箭头
        this._straightArrowLast = null; //最后一个箭头
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_straightArrow = [];  //脏数据
        this._straightArrowData = null; //用于构造箭头数据
    }

    getCatesian3FromPX(px) {
        var cartesian;
        var ray = this.viewer.camera.getPickRay(px);
        if (!ray) return null;
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        return cartesian;
    }

    ////////////////////////////////////////求取箭头坐标函数/////////////////////////////////////////////////////
    //箭头配置函数
    fineArrowDefualParam() {
        return {
            tailWidthFactor: 0.15,
            neckWidthFactor: 0.20,
            headWidthFactor: 0.25,
            headAngle: Math.PI / 8.5,
            neckAngle: Math.PI / 13
        }
    }

    fineArrow(tailPoint, headerPoint) {
        var $this = this;
        if ((tailPoint.length < 2) || (headerPoint.length < 2)) return;
        //画箭头的函数
        let tailWidthFactor = $this.fineArrowDefualParam().tailWidthFactor;
        let neckWidthFactor = $this.fineArrowDefualParam().neckWidthFactor;
        let headWidthFactor = $this.fineArrowDefualParam().headWidthFactor;
        let headAngle = $this.fineArrowDefualParam().headAngle;
        let neckAngle = $this.fineArrowDefualParam().neckAngle;
        var o = [];
        o[0] = tailPoint;
        o[1] = headerPoint;
        var e = o[0],
            r = o[1],
            n = $this.getBaseLength(o),
            g = n * tailWidthFactor,
            //尾部宽度因子
            i = n * neckWidthFactor,
            //脖子宽度银子
            s = n * headWidthFactor,
            //头部宽度因子
            a = $this.getThirdPoint(r, e, Math.PI / 2, g, !0),
            l = $this.getThirdPoint(r, e, Math.PI / 2, g, !1),
            u = $this.getThirdPoint(e, r, headAngle, s, !1),
            c = $this.getThirdPoint(e, r, headAngle, s, !0),
            p = $this.getThirdPoint(e, r, neckAngle, i, !1),
            h = $this.getThirdPoint(e, r, neckAngle, i, !0),
            d = [];
        d.push(a[0], a[1], p[0], p[1], u[0], u[1], r[0], r[1], c[0], c[1], h[0], h[1], l[0], l[1], e[0], e[1]);
        return $this.Cesium.Cartesian3.fromDegreesArray(d);
    }

    getBaseLength(t) {
        return Math.pow(this.wholeDistance(t), .99)
    }

    wholeDistance(t) {
        for (var o = 0, e = 0; e < t.length - 1; e++) o += this.distance(t[e], t[e + 1]);
        return o
    }

    distance(t, o) {
        return Math.sqrt(Math.pow(t[0] - o[0], 2) + Math.pow(t[1] - o[1], 2))
    }

    getThirdPoint(t, o, e, r, n) {
        var g = this.getAzimuth(t, o),
            i = n ? g + e : g - e,
            s = r * Math.cos(i),
            a = r * Math.sin(i);
        return [o[0] + s, o[1] + a]
    }

    getAzimuth(t, o) {
        var e, r = Math.asin(Math.abs(o[1] - t[1]) / this.distance(t, o));
        return o[1] >= t[1] && o[0] >= t[0] ? e = r + Math.PI : o[1] >= t[1] && o[0] < t[0] ? e = 2 * Math.PI - r : o[1] < t[1] && o[0] < t[0] ? e = r : o[1] < t[1] && o[0] >= t[0] && (e = Math.PI - r), e
    }
}

export default DrawstraightArrow

