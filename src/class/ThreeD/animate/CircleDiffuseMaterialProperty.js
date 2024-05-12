/*
 * @Description: 扩散圆效果（参考开源代码）
 * @Version: 1.0
 * @Author: Julian
 * @Date: 2022-03-03 21:51:28
 * @LastEditors: Julian
 * @LastEditTime: 2022-03-04 10:19:33
 */
import * as Cesium from 'cesium'
class CircleDiffuseMaterialProperty {
  constructor(options) {
      this._definitionChanged = new Cesium.Event();
      this._color = undefined;
      this._speed = undefined;
      this.color = options.color;
      this.speed = options.speed;
  };

  get isConstant() {
      return false;
  }

  get definitionChanged() {
      return this._definitionChanged;
  }

  getType(time) {
      return Cesium.Material.CircleDiffuseMaterialType;
  }

  getValue(time, result) {
      if (!Cesium.defined(result)) {
          result = {};
      }

      result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
      result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 10, result.speed);
      return result
  }

  equals(other) {
      return (this === other ||
          (other instanceof CircleDiffuseMaterialProperty &&
              Cesium.Property.equals(this._color, other._color) &&
              Cesium.Property.equals(this._speed, other._speed))
      )
  }
}

Object.defineProperties(CircleDiffuseMaterialProperty.prototype, {
  color: Cesium.createPropertyDescriptor('color'),
  speed: Cesium.createPropertyDescriptor('speed')
})
let ExtendedCesium = Object.assign({}, Cesium);
ExtendedCesium.CircleDiffuseMaterialProperty = CircleDiffuseMaterialProperty;
ExtendedCesium.Material.CircleDiffuseMaterialProperty = 'CircleDiffuseMaterialProperty';
ExtendedCesium.Material.CircleDiffuseMaterialType = 'CircleDiffuseMaterialType';
ExtendedCesium.Material.CircleDiffuseMaterialSource = `
                                          uniform vec4 color;
                                          uniform float speed;

                                          vec3 circlePing(float r, float innerTail,  float frontierBorder, float timeResetSeconds,  float radarPingSpeed,  float fadeDistance){
                                          float t = fract(czm_frameNumber * speed / 1000.0);
                                          float time = mod(t, timeResetSeconds) * radarPingSpeed;
                                          float circle;
                                          circle += smoothstep(time - innerTail, time, r) * smoothstep(time + frontierBorder,time, r);
                                          circle *= smoothstep(fadeDistance, 0.0, r);
                                          return vec3(circle);
                                          }

                                          czm_material czm_getMaterial(czm_materialInput materialInput){
                                          czm_material material = czm_getDefaultMaterial(materialInput);
                                          vec2 st = materialInput.st * 2.0  - 1.0 ;
                                          vec2 center = vec2(0.);
                                          float time = fract(czm_frameNumber * speed / 1000.0);
                                          vec3 flagColor;
                                          float r = length(st - center) / 4.;
                                          flagColor += circlePing(r, 0.25, 0.025, 4.0, 0.3, 1.0) * color.rgb;
                                          material.alpha = length(flagColor);
                                          material.diffuse = flagColor.rgb;
                                          return material;
                                          }

                                          `

ExtendedCesium.Material._materialCache.addMaterial(ExtendedCesium.Material.CircleDiffuseMaterialType, {
  fabric: {
      type: ExtendedCesium.Material.CircleDiffuseMaterialType,
      uniforms: {
          color: new Cesium.Color(1.0, 0.0, 0.0, 1.0),
          speed: 10.0
      },
      source: ExtendedCesium.Material.CircleDiffuseMaterialSource
  },
  translucent: function(material) {
      return true;
  }
})
export default CircleDiffuseMaterialProperty;