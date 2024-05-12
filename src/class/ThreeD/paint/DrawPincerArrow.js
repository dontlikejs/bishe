// DrawPincerArrow
/*
绘制箭头
 */
class DrawPincerArrow {
    constructor(arg) {
        this.viewer = arg.viewer;
        this.Cesium = arg.Cesium;
        this.floatingPoint = null;//标识点
        this._PincerArrow = null; //活动箭头
        this._PincerArrowLast = null; //最后一个箭头
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_PincerArrow = [];  //脏数据
        this._PincerArrowData = null; //用于构造箭头数据
    }

    //返回箭头
    get PincerArrow() {
        return this._PincerArrowLast;
    }

    //返回箭头数据用于加载箭头
    getData() {
        return this._PincerArrowData;
    }

    //加载箭头
    loadPincerArrow(data) {
        var $this = this;
        if (data.length < 3) {
            return;
        }
        //计算面
        var lnglatArr = [];
        for (var i = 0; i < data.length; i++) {
            var lnglat = $this.cartesianToLatlng(data[i]);
            lnglatArr.push(lnglat)
        }
        var res = $this.doubleArrow(lnglatArr);
        var returnData = res.polygonalPoint;
        var arrowEntity = $this.viewer.entities.add({
                polygon: {
                    hierarchy: new $this.Cesium.PolygonHierarchy(returnData),
                    show: true,
                    fill: true,
                    clampToGround: true,
                    material: $this.Cesium.Color.AQUA.withAlpha(0.5)
                }
            }
        )
        return arrowEntity
    }

    //开始创建
    startCreate() {
        var $this = this;
        this.handler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        $this.viewer.scene.globe.depthTestAgainstTerrain = false;
        this.handler.setInputAction(function (evt) { //单机开始绘制
            var cartesian = $this.getCatesian3FromPX(evt.position);
            if (!cartesian) {
                return;
            }
            if ($this._positions.length == 0) {
                $this.floatingPoint = $this.createPoint(cartesian);
            }
            if ($this._positions.length < 5) {
                $this._positions.push(cartesian);
                $this.createPoint(cartesian); // 绘制点
            }
            if ($this._positions.length == 5) {
                $this._positions[4] = cartesian;
                $this.floatingPoint.position.setValue(cartesian);
            }
        }, $this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
        this.handler.setInputAction(function (evt) { //移动时绘制面
            var cartesian = $this.getCatesian3FromPX(evt.endPosition);
            if (!cartesian) return;
            if ($this._positions.length < 2) return;
            if (!$this.Cesium.defined($this._PincerArrow)) {
                if ($this._positions.length == 2) {
                    $this._positions.push(cartesian);
                }
                $this._PincerArrow = $this.createPincerArrow();
            }
            $this.floatingPoint.position.setValue(cartesian);
            if ($this._positions.length == 3) {
                $this._positions[2] = cartesian;
            }
            if ($this._positions.length > 3) {
                $this._positions.pop();
                $this._positions.push(cartesian);
            }
            console.log($this._positions.length);
        }, $this.Cesium.ScreenSpaceEventType.MOUSE_MOVE);

        this.handler.setInputAction(function (evt) {
            if (!$this._PincerArrow) return;
            var cartesian = $this.getCatesian3FromPX(evt.position);
            if (!cartesian) return;
            $this._positions.pop();
            $this._positions.push(cartesian);
            $this._PincerArrowData = $this._positions.concat();
            $this.viewer.entities.remove($this._PincerArrow); //移除
            $this._PincerArrow = null;
            $this._positions = [];
            $this.floatingPoint.position.setValue(cartesian);
            var pincerArrow = $this.loadPincerArrow($this._PincerArrowData); //加载
            $this._entities_PincerArrow.push(pincerArrow);
            $this._PincerArrowLast = pincerArrow;
            $this.clearPoint();
        }, $this.Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    }

    //创建钳击箭头
    createPincerArrow() {
        var $this = this;
        $this._computeTempPositions();
        var arrowEntity = $this.viewer.entities.add({
                polygon: {
                    hierarchy: new $this.Cesium.CallbackProperty(
                        function () {
                            //计算面
                            var lnglatArr = [];
                            for (var i = 0; i < $this._positions.length; i++) {
                                var lnglat = $this.cartesianToLatlng($this._positions[i]);
                                lnglatArr.push(lnglat)
                            }
                            var res = $this.doubleArrow(lnglatArr);
                            var returnData = res.polygonalPoint;
                            return new $this.Cesium.PolygonHierarchy(returnData);
                        }, false),
                    show: true,
                    fill: true,
                    clampToGround: true,
                    material: $this.Cesium.Color.AQUA.withAlpha(0.5)
                }
            }
        )
        $this._entities_PincerArrow.push(arrowEntity);
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
        for (var i = 0; i < this._entities_PincerArrow.length; i++) {
            this.viewer.entities.remove(this._entities_PincerArrow[i]);
        }

        this.floatingPoint = null;//标识点
        this._PincerArrow = null; //活动箭头
        this._PincerArrowLast = null; //最后一个箭头
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_PincerArrow = [];  //脏数据
        this._PincerArrowData = null; //用于构造箭头数据
    }

    getCatesian3FromPX(px) {
        var cartesian;
        var ray = this.viewer.camera.getPickRay(px);
        if (!ray) return null;
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        return cartesian;
    }

    _computeTempPositions() {
        var _this = this;

        var pnts = [].concat(_this._positions);
        var num = pnts.length;
        var first = pnts[0];
        var last = pnts[num - 1];
        if (_this._isSimpleXYZ(first, last) == false) {
            pnts.push(first);
            num += 1;
        }
        _this.tempPositions = [];
        for (var i = 1; i < num; i++) {
            var p1 = pnts[i - 1];
            var p2 = pnts[i];
            var cp = _this._computeCenterPotition(p1, p2);
            _this.tempPositions.push(p1);
            _this.tempPositions.push(cp);
        }
    }

    _isSimpleXYZ(p1, p2) {
        if (p1.x == p2.x && p1.y == p2.y && p1.z == p2.z) {
            return true;
        }
        return false;
    }

    _computeCenterPotition(p1, p2) {
        var _this = this;
        var c1 = _this.viewer.scene.globe.ellipsoid.cartesianToCartographic(p1);
        var c2 = _this.viewer.scene.globe.ellipsoid.cartesianToCartographic(p2);
        var cm = new _this.Cesium.EllipsoidGeodesic(c1, c2).interpolateUsingFraction(0.5);
        var cp = _this.viewer.scene.globe.ellipsoid.cartographicToCartesian(cm);
        return cp;
    }

    ////////////////////////////////////////求取箭头坐标函数/////////////////////////////////////////////////////
    //箭头配置函数
    doubleArrow(inputPoint) {
        var $this = this;
        this.connPoint = null;
        this.tempPoint4 = null;
        this.points = inputPoint;
        var result = {
            controlPoint: null,
            polygonalPoint: null
        };
        //获取已经点击的坐标数
        var t = inputPoint.length;
        if (!(2 > t)) {
            if (2 == t) return inputPoint;
            var o = this.points[0],    //第一个点
                e = this.points[1],        //第二个点
                r = this.points[2],        //第三个点
                t = inputPoint.length; //获取已经点击的坐标数
            //下面的是移动点位后的坐标
            3 == t ? this.tempPoint4 = $this.getTempPoint4(o, e, r) : this.tempPoint4 = this.points[3],
                3 == t || 4 == t ? this.connPoint = $this.mid(o, e) : this.connPoint = this.points[4];
            var n, g;
            $this.isClockWise(o, e, r) ? (n = $this.getArrowPoints(o, this.connPoint, this.tempPoint4, !1), g = $this.getArrowPoints(this.connPoint, e, r, !0)) : (n = $this.getArrowPoints(e, this.connPoint, r, !1), g = $this.getArrowPoints(this.connPoint, o, this.tempPoint4, !0));
            var i = n.length,
                s = (i - 5) / 2,
                a = n.slice(0, s),
                l = n.slice(s, s + 5),
                u = n.slice(s + 5, i),
                c = g.slice(0, s),
                p = g.slice(s, s + 5),
                h = g.slice(s + 5, i);
            c = $this.getBezierPoints(c);
            var d = $this.getBezierPoints(h.concat(a.slice(1)));
            u = $this.getBezierPoints(u);
            var f = c.concat(p, d, l, u);
            var newArray = $this.array2Dto1D(f);
            result.controlPoint = [o, e, r, this.tempPoint4, this.connPoint];
            result.polygonalPoint = $this.Cesium.Cartesian3.fromDegreesArray(newArray);
        }
        return result;
    }

    getTempPoint4(t, o, e) {
        var $this = this;
        var r, n, g, i, s = $this.mid(t, o),
            a = $this.distance(s, e),
            l = $this.getAngleOfThreePoints(t, s, e);
        return l < Math.PI / 2 ? (n = a * Math.sin(l), g = a * Math.cos(l), i = $this.getThirdPoint(t, s, Math.PI / 2, n, !1), r = $this.getThirdPoint(s, i, Math.PI / 2, g, !0)) : l >= Math.PI / 2 && l < Math.PI ? (n = a * Math.sin(Math.PI - l), g = a * Math.cos(Math.PI - l), i = $this.getThirdPoint(t, s, Math.PI / 2, n, !1), r = $this.getThirdPoint(s, i, Math.PI / 2, g, !1)) : l >= Math.PI && l < 1.5 * Math.PI ? (n = a * Math.sin(l - Math.PI), g = a * Math.cos(l - Math.PI), i = $this.getThirdPoint(t, s, Math.PI / 2, n, !0), r = $this.getThirdPoint(s, i, Math.PI / 2, g, !0)) : (n = a * Math.sin(2 * Math.PI - l), g = a * Math.cos(2 * Math.PI - l), i = $this.getThirdPoint(t, s, Math.PI / 2, n, !0), r = $this.getThirdPoint(s, i, Math.PI / 2, g, !1)),
            r
    }

    mid(t, o) {
        return [(t[0] + o[0]) / 2, (t[1] + o[1]) / 2]
    }

    isClockWise(t, o, e) {
        return (e[1] - t[1]) * (o[0] - t[0]) > (o[1] - t[1]) * (e[0] - t[0])
    }

    getArrowPoints(t, o, e, r) {
        var $this = this;
        var doubleArrowDefualParam = {
            type: "doublearrow",
            headHeightFactor: .25,
            headWidthFactor: .3,
            neckHeightFactor: .85,
            fixPointCount: 4,
            neckWidthFactor: .15
        }
        this.type = doubleArrowDefualParam.type,
            this.headHeightFactor = doubleArrowDefualParam.headHeightFactor,
            this.headWidthFactor = doubleArrowDefualParam.headWidthFactor,
            this.neckHeightFactor = doubleArrowDefualParam.neckHeightFactor,
            this.neckWidthFactor = doubleArrowDefualParam.neckWidthFactor;
        var n = $this.mid(t, o),
            g = $this.distance(n, e),
            i = $this.getThirdPoint(e, n, 0, .3 * g, !0),
            s = $this.getThirdPoint(e, n, 0, .5 * g, !0);
        i = $this.getThirdPoint(n, i, Math.PI / 2, g / 5, r),
            s = $this.getThirdPoint(n, s, Math.PI / 2, g / 4, r);
        var a = [n, i, s, e],
            l = $this.getArrowHeadPoints(a, this.headHeightFactor, this.headWidthFactor, this.neckHeightFactor, this.neckWidthFactor),
            u = l[0],
            c = l[4],
            p = $this.distance(t, o) / $this.getBaseLength(a) / 2,
            h = $this.getArrowBodyPoints(a, u, c, p),
            d = h.length,
            f = h.slice(0, d / 2),
            E = h.slice(d / 2, d);
        return f.push(u),
            E.push(c),
            f = f.reverse(),
            f.push(o),
            E = E.reverse(),
            E.push(t),
            f.reverse().concat(l, E)
    }

    getArrowHeadPoints(t, o, e) {
        var $this = this;
        var doubleArrowDefualParam = {
            type: "doublearrow",
            headHeightFactor: .25,
            headWidthFactor: .3,
            neckHeightFactor: .85,
            fixPointCount: 4,
            neckWidthFactor: .15
        }
        this.type = doubleArrowDefualParam.type,
            this.headHeightFactor = doubleArrowDefualParam.headHeightFactor,
            this.headWidthFactor = doubleArrowDefualParam.headWidthFactor,
            this.neckHeightFactor = doubleArrowDefualParam.neckHeightFactor,
            this.neckWidthFactor = doubleArrowDefualParam.neckWidthFactor;
        var r = $this.getBaseLength(t),
            n = r * this.headHeightFactor,
            g = t[t.length - 1],
            i = ($this.distance(o, e), n * this.headWidthFactor),
            s = n * this.neckWidthFactor,
            a = n * this.neckHeightFactor,
            l = $this.getThirdPoint(t[t.length - 2], g, 0, n, !0),
            u = $this.getThirdPoint(t[t.length - 2], g, 0, a, !0),
            c = $this.getThirdPoint(g, l, Math.PI / 2, i, !1),
            p = $this.getThirdPoint(g, l, Math.PI / 2, i, !0),
            h = $this.getThirdPoint(g, u, Math.PI / 2, s, !1),
            d = $this.getThirdPoint(g, u, Math.PI / 2, s, !0);
        return [h, c, g, p, d];
    }

    getArrowBodyPoints(t, o, e, r) {
        var $this = this;
        for (var n = $this.wholeDistance(t), g = $this.getBaseLength(t), i = g * r, s = $this.distance(o, e), a = (i - s) / 2, l = 0, u = [], c = [], p = 1; p < t.length - 1; p++) {
            var h = $this.getAngleOfThreePoints(t[p - 1], t[p], t[p + 1]) / 2;
            l += $this.distance(t[p - 1], t[p]);
            var d = (i / 2 - l / n * a) / Math.sin(h),
                f = $this.getThirdPoint(t[p - 1], t[p], Math.PI - h, d, !0),
                E = $this.getThirdPoint(t[p - 1], t[p], h, d, !1);
            u.push(f), c.push(E)
        }
        return u.concat(c)
    }

    getBezierPoints(t) {
        if (t.length <= 2) return t;
        for (var o = [], e = t.length - 1, r = 0; 1 >= r; r += .01) {
            for (var n = 0, y = 0, g = 0; e >= g; g++) {
                var i = this.getBinomialFactor(e, g),
                    s = Math.pow(r, g),
                    a = Math.pow(1 - r, e - g);
                n += i * s * a * t[g][0], y += i * s * a * t[g][1]
            }
            o.push([n, y])
        }
        return o.push(t[e]), o
    }

    getBaseLength(t) {
        return Math.pow(this.wholeDistance(t), .99)
    }

    wholeDistance(t) {
        for (var o = 0, e = 0; e < t.length - 1; e++) o += this.distance(t[e], t[e + 1]);
        return o
    }

    getBinomialFactor(t, o) {
        return this.getFactorial(t) / (this.getFactorial(o) * this.getFactorial(t - o))
    }

    getFactorial(t) {
        if (1 >= t) return 1;
        if (2 == t) return 2;
        if (3 == t) return 6;
        if (4 == t) return 24;
        if (5 == t) return 120;
        for (var o = 1, e = 1; t >= e; e++) o *= e;
        return o
    }

    array2Dto1D(array) {
        var newArray = [];
        array.forEach(function (elt) {
            newArray.push(elt[0]);
            newArray.push(elt[1]);
        });
        return newArray;
    }

    distance(t, o) {
        return Math.sqrt(Math.pow(t[0] - o[0], 2) + Math.pow(t[1] - o[1], 2))
    }

    getAngleOfThreePoints(t, o, e) {
        var r = this.getAzimuth(o, t) - this.getAzimuth(o, e);
        return 0 > r ? r + 2 * Math.PI : r
    }

    getAzimuth(t, o) {
        var e, r = Math.asin(Math.abs(o[1] - t[1]) / this.distance(t, o));
        return o[1] >= t[1] && o[0] >= t[0] ? e = r + Math.PI : o[1] >= t[1] && o[0] < t[0] ? e = 2 * Math.PI - r : o[1] < t[1] && o[0] < t[0] ? e = r : o[1] < t[1] && o[0] >= t[0] && (e = Math.PI - r), e
    }

    getThirdPoint(t, o, e, r, n) {
        var g = this.getAzimuth(t, o),
            i = n ? g + e : g - e,
            s = r * Math.cos(i),
            a = r * Math.sin(i);
        return [o[0] + s, o[1] + a]
    }

}

export default DrawPincerArrow

