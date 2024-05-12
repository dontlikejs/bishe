/*
绘制图标
 */
import img from "/public/icon_location.png";

class DrawBillboard {
    constructor(arg) {
        this.objId = Number((new Date()).getTime() + "" + Number(Math.random() * 1000).toFixed(0));
        this.viewer = arg.viewer;
        this.Cesium = arg.Cesium;
        this._billboard = null;
        this._billboardData = null;//点数据用于构造billboard
        this._entities = [];
    }

    //返回最后活动点
    get billboard() {
        return this._billboard;
    }

    //返回点数据用于加载billboard
    getData() {
        return this._billboardData;
    }

    //加载图标
    loadBillboard(data) {
        return this.createBillboard(data);
    }

    startCreate() {
        var $this = this;
        this.handler = new this.Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.handler.setInputAction(function (evt) { //单机开始绘制
            var cartesian = $this.getCatesian3FromPX(evt.position);
            if (!cartesian) return;
            var billboard = $this.createBillboard(cartesian);
            $this._billboardData=cartesian;
            $this._billboard = billboard;
        }, $this.Cesium.ScreenSpaceEventType.LEFT_CLICK);
    }

    //创建图标
    createBillboard(cartesian) {
        var $this = this;
        var billboard = this.viewer.entities.add({
            position: cartesian,
            billboard: {
                image: img,
                scale: 1,
                horizontalOrigin: $this.Cesium.HorizontalOrigin.CENTER,
                verticalOrigin: $this.Cesium.VerticalOrigin.BOTTOM,

                disableDepthTestDistance: Number.MAX_VALUE
            }
        });
        billboard.objId = this.objId;
        $this._entities.push(billboard); //加载脏数据
        return billboard;
    }

    destroy() {
        if (this.handler) {
            this.handler.destroy();
            this.handler = null;
        }
    }

    //清空实体对象
    clear() {
        for (var i = 0; i < this._entities.length; i++) {
            this.viewer.entities.remove(this._entities[i]);
        }
        this._billboard = null;
        this._billboardData = null;
        this._entities = [];
    }
    getCatesian3FromPX(px) {
        var cartesian;
        // this.viewer.scene.globe.depthTestAgainstTerrain=false
        cartesian = this.viewer.scene.pickPosition(px);

        return cartesian;
    }
}

export default  DrawBillboard;