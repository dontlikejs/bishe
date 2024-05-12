/***
 * 六边形扩散效果
 * 参考gitee开源ts代码
 * 取消import和export，整合两个类
 */
import * as Cesium from 'cesium'
let ExtendedCesium = Object.assign({}, Cesium);
// 点效果集合 父类
class Effect {
    viewer;
    id;
    duration;
    maxRadius;
    pointDraged;
    leftDownFlag;
    update_position;
    a=[]
    constructor(viewer, id) {
        this.viewer = viewer
        this.id = id
        this.duration = 1000
        this.maxRadius = 1000
        this.pointDraged = null
        this.leftDownFlag = false
    }

    change_duration(d) {
        this.duration = d
    }
    change_color(val) {
        const curEntity = this.viewer.entities.getById(this.id)
        curEntity._ellipse._material.color = new Cesium.Color.fromCssColorString(
            val
        )
    }
    change_position(p) {
        const cartesian3 = Cesium.Cartesian3.fromDegrees(
            parseFloat(p[0]),
            parseFloat(p[1]),
            parseFloat(p[2])
        )
        const curEntity = this.viewer.entities.getById(this.id)
        curEntity.position = cartesian3
    }
    del() {
        this.viewer.entities.removeById(this.id)
    }
    add(
        position,
        color,
        maxRadius,
        duration,
        isEdit = false
    ) {
        const _this = this
        this.duration = duration
        this.maxRadius = maxRadius
        if (!isEdit) {
            return
        }

        function leftDownAction(e) {
            _this.pointDraged = _this.viewer.scene.pick(e.position) // 选取当前的entity
            if (
                _this.pointDraged &&
                _this.pointDraged.id &&
                _this.pointDraged.id.id === _this.id
            ) {
                _this.leftDownFlag = true
                _this.viewer.scene.screenSpaceCameraController.enableRotate = false // 锁定相机
            }
        }

        function leftUpAction(e) {
            _this.leftDownFlag = false
            _this.pointDraged = null
            _this.viewer.scene.screenSpaceCameraController.enableRotate = true // 解锁相机
        }

        function mouseMoveAction(e) {
            if (
                _this.leftDownFlag === true &&
                _this.pointDraged !== null &&
                _this.pointDraged !== undefined
            ) {
                const ray = _this.viewer.camera.getPickRay(e.endPosition)
                const cartesian = _this.viewer.scene.globe.pick(ray, _this.viewer.scene)
                _this.pointDraged.id.position = cartesian // 此处根据具体entity来处理，也可能是pointDraged.id.position=cartesian;
                    // 这里笛卡尔坐标转 经纬度
                const ellipsoid = _this.viewer.scene.globe.ellipsoid
                const cartographic = ellipsoid.cartesianToCartographic(cartesian)
                const lat = Cesium.Math.toDegrees(cartographic.latitude)
                const lng = Cesium.Math.toDegrees(cartographic.longitude)
                let alt = cartographic.height
                alt = alt < 0 ? 0 : alt
                if (_this.update_position) {
                    _this.update_position([lng.toFixed(8), lat.toFixed(8), alt])
                }
            }
        }
        this.viewer.screenSpaceEventHandler.setInputAction(
            leftDownAction,
            Cesium.ScreenSpaceEventType.LEFT_DOWN
        )
        this.viewer.screenSpaceEventHandler.setInputAction(
            leftUpAction,
            Cesium.ScreenSpaceEventType.LEFT_UP
        )
        this.viewer.screenSpaceEventHandler.setInputAction(
            mouseMoveAction,
            Cesium.ScreenSpaceEventType.MOUSE_MOVE
        )
    }
}

/**
 * 六边形扩散材质
 * @date:2022-01-12
 */
function HexagonSpreadMaterialProperty(color) {
    this._definitionChanged = new Cesium.Event()
    this._color = undefined
    this._colorSubscription = undefined
    this.color = color
    this._time = new Date().getTime()
}
Object.defineProperties(HexagonSpreadMaterialProperty.prototype, {
    isConstant: {
        get: function() {
            return false
        },
    },
    definitionChanged: {
        get: function() {
            return this._definitionChanged
        },
    },
    color: Cesium.createPropertyDescriptor('color'),
})
HexagonSpreadMaterialProperty.prototype.getType = function(_time) {
    return Cesium.Material.HexagonSpreadMaterialType
}
HexagonSpreadMaterialProperty.prototype.getValue = function(
    time,
    result
) {
    if (!Cesium.defined(result)) {
        result = {}
    }
    result.color = Cesium.Property.getValueOrClonedDefault(
        this._color,
        time,
        Cesium.Color.WHITE,
        result.color
    )
    result.image = Cesium.Material.HexagonSpreadMaterialImage
    return result
}
HexagonSpreadMaterialProperty.prototype.equals = function(other) {
    const reData = (
        this === other ||
        (other instanceof HexagonSpreadMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
    )
    return reData
}

ExtendedCesium.HexagonSpreadMaterialProperty = HexagonSpreadMaterialProperty
ExtendedCesium.Material.HexagonSpreadMaterialType = 'HexagonSpreadMaterial'
ExtendedCesium.Material.HexagonSpreadMaterialImage = 'hexagon.png'
ExtendedCesium.Material.HexagonSpreadSource = `
  czm_material czm_getMaterial(czm_materialInput materialInput)
  {
       czm_material material = czm_getDefaultMaterial(materialInput);
       vec2 st = materialInput.st;
       vec4 colorImage = texture2D(image,  vec2(st));
       material.alpha = colorImage.a * color.a * 0.5;
       material.diffuse =  1.8 * color.rgb  ;
       return material;
   }
   `
ExtendedCesium.Material._materialCache.addMaterial(
    ExtendedCesium.Material.HexagonSpreadMaterialType, {
        fabric: {
            type: ExtendedCesium.Material.HexagonSpreadMaterialType,
            uniforms: {
                color: new Cesium.Color(1, 0, 0, 0.5),
                image: ExtendedCesium.Material.HexagonSpreadMaterialImage,
            },
            source: ExtendedCesium.Material.HexagonSpreadSource,
        },
        translucent: function(material) {
            return true
        },
    }
)

// 六边形扩散效果
class HexagonSpread extends Effect {
    a=[]
    constructor(viewer, id) {
        super(viewer, id)
    }
    remove(){
        
        for (let i = 0; i < this.a.length; i++) {
            this.viewer.entities.remove(this.a[i])
          }
    }
    add(position, color, maxRadius, duration, isedit = false) {
        super.add(position, color, maxRadius, duration, isedit)
        const _this = this
        let currentRadius = 1
       let aa= this.viewer.entities.add({
            id: _this.id,
            position: Cesium.Cartesian3.fromDegrees(
                position[0],
                position[1],
                position[2]
            ),
            ellipse: {
                semiMajorAxis: new Cesium.CallbackProperty(function(n) {
                    currentRadius += (1000 / _this.duration) * 50
                    if (currentRadius > _this.maxRadius) {
                        currentRadius = 1
                    }
                    return currentRadius
                }, false),
                semiMinorAxis: new Cesium.CallbackProperty(function(n) {
                    return currentRadius
                }, false),
                material: new Cesium.HexagonSpreadMaterialProperty(
                    new Cesium.Color.fromCssColorString(color)
                ),
            },
        })
        this.a.push(aa)
    }
}

/**
 * 水波纹扩散材质
 * 
 * 
 * @param {*} color  颜色
 * @param {*} duration 持续时间 毫秒
 * @param {*} count  波浪数量
 * @param {*} gradient 渐变曲率
 */
function CircleWaveMaterialProperty(ob) {
    this._definitionChanged = new Cesium.Event()
    this._color = undefined
    this._colorSubscription = undefined
    this.color = ob.color
    this.duration = Cesium.defaultValue(ob.duration, 1000)
    this.count = Cesium.defaultValue(ob.count, 2)
    if (this.count <= 0) {
        this.count = 1
    }
    this.gradient = Cesium.defaultValue(ob.gradient, 0.1)
    if (this.gradient === 0) {
        this.gradient = 0
    }
    if (this.gradient > 1) {
        this.gradient = 1
    }
    this._time = new Date().getTime()
}
Object.defineProperties(CircleWaveMaterialProperty.prototype, {
    isConstant: {
        get: function() {
            return false
        },
    },
    definitionChanged: {
        get: function() {
            return this._definitionChanged
        },
    },
    color: Cesium.createPropertyDescriptor('color'),
    duration: Cesium.createPropertyDescriptor('duration'),
    count: Cesium.createPropertyDescriptor('count'),
})
CircleWaveMaterialProperty.prototype.getType = function(_time) {
    return Cesium.Material.CircleWaveMaterialType
}
CircleWaveMaterialProperty.prototype.getValue = function(
    time,
    result
) {
    if (!Cesium.defined(result)) {
        result = {}
    }
    result.color = Cesium.Property.getValueOrClonedDefault(
        this._color,
        time,
        Cesium.Color.WHITE,
        result.color
    )
    result.time =
        ((new Date().getTime() - this._time) % this.duration) / this.duration
    result.count = this.count
    result.gradient = 1 + 10 * (1 - this.gradient)
    return result
}
CircleWaveMaterialProperty.prototype.equals = function(other) {
    const reData = (
        this === other ||
        (other instanceof CircleWaveMaterialProperty &&
            Cesium.Property.equals(this._color, other._color))
    )
    return reData
}
ExtendedCesium.CircleWaveMaterialProperty = CircleWaveMaterialProperty
ExtendedCesium.Material.CircleWaveMaterialType = 'CircleWaveMaterial'
ExtendedCesium.Material.CircleWaveSource = `
                                    czm_material czm_getMaterial(czm_materialInput materialInput) {
                                      czm_material material = czm_getDefaultMaterial(materialInput);
                                      material.diffuse = 1.5 * color.rgb;
                                      vec2 st = materialInput.st;
                                      vec3 str = materialInput.str;
                                      float dis = distance(st, vec2(0.5, 0.5));
                                      float per = fract(time);
                                      if (abs(str.z) > 0.001) {
                                        discard;
                                      }
                                      if (dis > 0.5) {
                                        discard;
                                      } else {
                                        float perDis = 0.5 / count;
                                        float disNum;
                                        float bl = .0;
                                        for (int i = 0; i <= 9; i++) {
                                          if (float(i) <= count) {
                                            disNum = perDis *float(i) - dis + per / count;
                                            if (disNum > 0.0) {
                                              if (disNum < perDis) {
                                                bl = 1.0 - disNum / perDis;
                                              } else if(disNum - perDis < perDis) {
                                                bl = 1.0 - abs(1.0 - disNum / perDis);
                                              }
                                              material.alpha = pow(bl, gradient);
                                            }
                                          }
                                        }
                                      }
                                      return material;
                                    }
                                    `
ExtendedCesium.Material._materialCache.addMaterial(
    ExtendedCesium.Material.CircleWaveMaterialType, {
        fabric: {
            type: ExtendedCesium.Material.CircleWaveMaterialType,
            uniforms: {
                color: new Cesium.Color(1, 0, 0, 1),
                time: 1,
                count: 1,
                gradient: 0.1,
            },
            source: ExtendedCesium.Material.CircleWaveSource,
        },
        translucent: function(material) {
            return true
        },
    }
)

// 水波纹
class CircleWave extends Effect {
    count;
    a=[]
    constructor(viewer, id) {
        super(viewer, id)
    }
    remove(){
        
        for (let i = 0; i < this.a.length; i++) {
            this.viewer.entities.remove(this.a[i])
          }
    }
    change_duration(d) {
        super.change_duration(d)
        const curEntity = this.viewer.entities.getById(this.id)
        curEntity._ellipse._material.duration = d
    }
    change_waveCount(d) {
        const curEntity = this.viewer.entities.getById(this.id)
        curEntity._ellipse._material.count = d
    }
    add(position, color, maxRadius, duration, isedit = false, count = 3) {
        super.add(position, color, maxRadius, duration, isedit)
        const _this = this
        this.count = count
      let bb=  this.viewer.entities.add({
            id: _this.id,
            position: Cesium.Cartesian3.fromDegrees(
                position[0],
                position[1],
                position[2]
            ),
            ellipse: {
                // height: position[2],
                semiMinorAxis: new Cesium.CallbackProperty(function(n) {
                    return _this.maxRadius
                }, false),
                semiMajorAxis: new Cesium.CallbackProperty(function(n) {
                    return _this.maxRadius
                }, false),
                material: new Cesium.CircleWaveMaterialProperty({
                    duration: duration,
                    gradient: 0,
                    color: new Cesium.Color.fromCssColorString(color),
                    count: count,
                }),
            },
        })
        this.a.push(bb)
    }
}


/**
 * 线圈发光效果
 * 包括发光材质scanlineMaterialProperty和类scanline.js
 */

// 线圈发光扩散效果
class Scanline extends Effect {
    a=[]
    constructor(viewer, id) {
        super(viewer, id)
    }
    remove(){
        
        for (let i = 0; i < this.a.length; i++) {
            this.viewer.entities.remove(this.a[i])
          }
    }
    change_duration(d) {
        super.change_duration(d)
        const curEntity = this.viewer.entities.getById(this.id)
        curEntity._ellipse._material.speed = d
    }
    add(position, color, maxRadius, speed, isedit = false) {
        super.add(position, color, maxRadius, speed, isedit)
        const _this = this
       let cc= this.viewer.entities.add({
            id: _this.id,
            position: Cesium.Cartesian3.fromDegrees(
                position[0],
                position[1],
                position[2]
            ),
            ellipse: {
                semiMinorAxis: new Cesium.CallbackProperty(function(n) {
                    return _this.maxRadius
                }, false),
                semiMajorAxis: new Cesium.CallbackProperty(function(n) {
                    return _this.maxRadius
                }, false),
                material: new Cesium.ScanlineMaterialProperty(
                    new Cesium.Color.fromCssColorString(color),
                    speed
                ),
                classificationType: Cesium.ClassificationType.BOTH,
            },
        })
        this.a.push(cc)
    }
}


function ScanlineMaterialProperty(color, speed) {
    this._definitionChanged = new Cesium.Event()
    this.color = color || Cesium.Color.YELLOW
    this.speed = speed || 10
}

Object.defineProperties(ScanlineMaterialProperty.prototype, {
    isConstant: {
        get: function() {
            return false
        },
    },
    definitionChanged: {
        get: function() {
            return this._definitionChanged
        },
    },
    color: Cesium.createPropertyDescriptor('color'),
    speed: Cesium.createPropertyDescriptor('speed'),
})

ScanlineMaterialProperty.prototype.getType = function(_time) {
    return Cesium.Material.ScanlineType
}
ScanlineMaterialProperty.prototype.getValue = function(
    time,
    result
) {
    if (!Cesium.defined(result)) {
        result = {}
    }
    result.color = Cesium.Property.getValueOrClonedDefault(
        this._color,
        time,
        Cesium.Color.WHITE,
        result.color
    )
    result.speed = this.speed
    return result
}

ScanlineMaterialProperty.prototype.equals = function(other) {
    const reData =
        this === other ||
        (other instanceof ScanlineMaterialProperty &&
            Cesium.Property.equals(this.color, other.color) &&
            Cesium.Property.equals(this.speed, other.speed))
    return reData
}

ExtendedCesium.ScanlineMaterialProperty = ScanlineMaterialProperty
ExtendedCesium.Material.ScanlineType = 'Scanline'
ExtendedCesium.Material.ScanlineSource = `
  uniform vec4 color;
  uniform float speed;
  float circle(vec2 uv, float r, float blur) {
    float d = length(uv) * 1.0; /* 2.0 */
    float c = smoothstep(r+blur, r, d);
    return c;
  }
  czm_material czm_getMaterial(czm_materialInput materialInput)
  {
    czm_material material = czm_getDefaultMaterial(materialInput);
    vec2 st = materialInput.st - 0.5;
    material.diffuse = 2.8 * color.rgb;
    material.emission = vec3(0);
    float t = fract(czm_frameNumber * (11000.0 - speed) / 500000.0);
    float s = 0.3;
    float radius1 = smoothstep(.0, s, t) * 0.5;
    float alpha1 = circle(st, radius1, 0.01) * circle(st, radius1, -0.01);
    float alpha2 = circle(st, radius1, 0.01 - radius1) * circle(st, radius1, 0.01);
    float radius2 = 0.5 + smoothstep(s, 1.0, t) * 0.5;
    float alpha3 = circle(st, radius1, radius2 + 0.01 - radius1) * circle(st, radius1, -0.01);
    material.alpha = smoothstep(1.0, s, t) * (alpha1 + alpha2*0.1 + alpha3*0.1);
    material.alpha *= color.a ;
    return material;
  }
  `
ExtendedCesium.Material._materialCache.addMaterial(ExtendedCesium.Material.ScanlineType, {
    fabric: {
        type: ExtendedCesium.Material.ScanlineType,
        uniforms: {
            color: new Cesium.Color(1, 0, 0, 0.5),
            time: 0,
            speed: 10,
        },
        source: ExtendedCesium.Material.ScanlineSource,
    },
    translucent: function(t) {
        return true
    },
})

export  {HexagonSpread,CircleWave,Scanline};
