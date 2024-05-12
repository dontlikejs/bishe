// DrawCurve
/*
绘制矩形
 */
class DrawRectangle {
    constructor(arg) {
        this.viewer = arg.viewer;
        this.Cesium = arg.Cesium;
        this.callback=arg.callback;
        this.floatingPoint = null;//标识点
        this._rectangle = null; //活动矩形
        this._rectangleLast = null; //最后一个矩形
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_rectangle = [];  //脏数据
        this._rectangleData = null; //用于构造矩形数据
    }

    //返回最后图形
    get line() {
        return this._rectangleLast;
    }

    //返回矩形数据
    getData() {
        return this._rectangleData;
    }

    //加载
    loadRectangle(data) {
        var $this = this;
        var shape = this.viewer.entities.add({
            name: "rectangle",
            rectangle: {
                coordinates: $this.Cesium.Rectangle.fromCartesianArray(data),
                material: $this.Cesium.Color.RED.withAlpha(0.5)
            }
        });
        $this._entities_rectangle.push(shape);
        return shape;
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
            if ($this._positions.length < 3) return;
            var cartesian = $this.getCatesian3FromPX(evt.endPosition);
            if (!$this.Cesium.defined($this._rectangle)) {
                $this._rectangle = $this.createRectangle();
            }
            $this.floatingPoint.position.setValue(cartesian);
            if ($this._rectangle) {
                $this._positions.pop();
                $this._positions.push(cartesian);
            }
        }, $this.Cesium.ScreenSpaceEventType.MOUSE_MOVE);
        this.handler.setInputAction(function (evt) {
            if (!$this._rectangle) return;
            var cartesian = $this.getCatesian3FromPX(evt.position);
            $this._positions.pop();
            $this._positions.push(cartesian);
            $this.createPoint(cartesian);// 绘制点
            $this._rectangleData = $this._positions.concat();
            $this.viewer.entities.remove($this._rectangle); //移除
            $this._rectangle = null;
            $this._positions = [];
            $this.floatingPoint.position.setValue(cartesian);
            var rectangle = $this.loadRectangle($this._rectangleData); //加载
            $this._entities_rectangle.push(rectangle);
            $this._rectangleLast = rectangle;
            if(typeof $this.callback=="function"){
                $this.callback(rectangle);
            }
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
        $this._entities_point.push(point);
        return point;
    }

    //创建矩形
    createRectangle() {
        var $this = this;
        var shape = this.viewer.entities.add({
            name: "rectangle",
            rectangle: {
                coordinates: new $this.Cesium.CallbackProperty(function() {
                    var obj = $this.Cesium.Rectangle.fromCartesianArray($this._positions);
                    return obj;
                }, false),
                material: $this.Cesium.Color.RED.withAlpha(0.5)
            }
        });
        $this._entities_rectangle.push(shape);
        return shape;
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
        for (var i = 0; i < this._entities_rectangle.length; i++) {
            this.viewer.entities.remove(this._entities_rectangle[i]);
        }
        this.floatingPoint = null;//标识点
        this._rectangle = null; //活动矩形
        this._rectangleLast = null; //最后一个矩形
        this._positions = [];  //活动点
        this._entities_point = [];  //脏数据
        this._entities_rectangle = [];  //脏数据
        this._rectangleData = null; //用于构造矩形数据
    }

    getCatesian3FromPX(px) {
        var cartesian;
        var ray = this.viewer.camera.getPickRay(px);
        if (!ray) return null;
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene);
        return cartesian;
    }
}

export default DrawRectangle