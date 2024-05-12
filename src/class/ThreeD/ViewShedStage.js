
import * as Cesium from 'cesium'
/**
 * ????¡ì??????????????
 *
 * @author Helsing
 * @date 2020/08/28
 * @alias ViewShedStage
 * @class
 * @param {Cesium.Viewer} viewer Cesium???????¡ì????????
 * @param {Object} options ¨¦??¨¦??????
 * @param {Cesium.Cartesian3} options.viewPosition ?¡ì?????????????????
 * @param {Cesium.Cartesian3} options.viewPositionEnd ???????¡ì????????????????????????????????¡ì?????¡¦??????????????????¡ì??????????????????????
 * @param {Number} options.viewDistance ?¡ì?????¡¦?????????????`???`???¨¦????¡è????100???????
 * @param {Number} options.viewHeading ???????¡ì??????????`???`???¨¦????¡è????0???????
 * @param {Number} options.viewPitch ?????¡ã?¡ì??????????`???`???¨¦????¡è????0???????
 * @param {Number} options.horizontalViewAngle ????¡ì?????¡ã?????¡è??¡ì??????????`???`???¨¦????¡è????90???????
 * @param {Number} options.verticalViewAngle ????¡ì???????????¡è??¡ì??????????`???`???¨¦????¡è????60???????
 * @param {Cesium.Color} options.visibleAreaColor ????¡ì???????¨¦????????¨¦????¡è???`??????`???????
 * @param {Cesium.Color} options.invisibleAreaColor ???????¡ì???????¨¦????????¨¦????¡è???`??????`???????
 * @param {Boolean} options.enabled ¨¦??????????????????????¡§????
 * @param {Boolean} options.softShadows ???????????¡§??????¨¦?????????
 * @param {Boolean} options.size ??????¨¦???????????????¡è¡ì?¡ã?????
 */
class ViewShedStage {
 
  constructor(viewer, options) {
      this.viewer = viewer;
      this.viewPosition = options.viewPosition;
      this.viewPositionEnd = options.viewPositionEnd;
      this.viewDistance = this.viewPositionEnd ? Cesium.Cartesian3.distance(this.viewPosition, this.viewPositionEnd) : (options.viewDistance || 100.0);
      this.viewHeading = this.viewPositionEnd ? this.getHeading(this.viewPosition, this.viewPositionEnd) : (options.viewHeading || 0.0);
      this.viewPitch = this.viewPositionEnd ? this.getPitch(this.viewPosition, this.viewPositionEnd) : (options.viewPitch || 0.0);
      this.horizontalViewAngle = options.horizontalViewAngle || 90.0;
      this.verticalViewAngle = options.verticalViewAngle || 60.0;
      this.visibleAreaColor = options.visibleAreaColor || Cesium.Color.GREEN;
      this.invisibleAreaColor = options.invisibleAreaColor || Cesium.Color.RED;
      this.enabled = (typeof options.enabled === "boolean") ? options.enabled : true;
      this.softShadows = (typeof options.softShadows === "boolean") ? options.softShadows : true;
      this.size = options.size || 2048;

      this.update();
  }
  createLightCamera() {
    this.lightCamera = new Cesium.Camera(this.viewer.scene);
    this.lightCamera.position = this.viewPosition;
    // if (this.viewPositionEnd) {
    //     let direction = Cesium.Cartesian3.normalize(Cesium.Cartesian3.subtract(this.viewPositionEnd, this.viewPosition, new Cesium.Cartesian3()), new Cesium.Cartesian3());
    //     this.lightCamera.direction = direction; // direction?????????¨¦??????????????
    // }
    this.lightCamera.frustum.near = this.viewDistance * 0.001;
    this.lightCamera.frustum.far = this.viewDistance;
    const hr = Cesium.Math.toRadians(90);
    const vr = Cesium.Math.toRadians(this.verticalViewAngle);
    const aspectRatio =
        (this.viewDistance * Math.tan(hr / 2) * 2) /
        (this.viewDistance * Math.tan(vr / 2) * 2);
    this.lightCamera.frustum.aspectRatio = aspectRatio;
    if (hr > vr) {
        this.lightCamera.frustum.fov = hr;
    } else {
        this.lightCamera.frustum.fov = vr;
    }
    this.lightCamera.setView({
        destination: this.viewPosition,
        orientation: {
            heading: Cesium.Math.toRadians(this.viewHeading || 0),
            pitch: Cesium.Math.toRadians(this.viewPitch || 0),
            roll: 0
        }
    });
}
createShadowMap() {
  this.shadowMap = new Cesium.ShadowMap({
      context: (this.viewer.scene).context,
      lightCamera: this.lightCamera,
      enabled: this.enabled,
      isPointLight: true,
      pointLightRadius: this.viewDistance,
      cascadesEnabled: false,
      size: this.size,
      softShadows: this.softShadows,
      normalOffset: false,
      fromLightSource: false
  });
  this.viewer.scene.shadowMap = this.shadowMap;
}
createPostStage() {
  const fs =  `
  #define USE_CUBE_MAP_SHADOW true
  uniform sampler2D colorTexture;
  uniform sampler2D depthTexture;
  varying vec2 v_textureCoordinates;
  uniform mat4 camera_projection_matrix;
  uniform mat4 camera_view_matrix;
  uniform samplerCube shadowMap_textureCube;
  uniform mat4 shadowMap_matrix;
  uniform vec4 shadowMap_lightPositionEC;
  uniform vec4 shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness;
  uniform vec4 shadowMap_texelSizeDepthBiasAndNormalShadingSmooth;
  uniform float helsing_viewDistance; 
  uniform vec4 helsing_visibleAreaColor;
  uniform vec4 helsing_invisibleAreaColor;
  struct zx_shadowParameters
  {
      vec3 texCoords;
      float depthBias;
      float depth;
      float nDotL;
      vec2 texelStepSize;
      float normalShadingSmooth;
      float darkness;
  };
  float czm_shadowVisibility(samplerCube shadowMap, zx_shadowParameters shadowParameters)
  {
      float depthBias = shadowParameters.depthBias;
      float depth = shadowParameters.depth;
      float nDotL = shadowParameters.nDotL;
      float normalShadingSmooth = shadowParameters.normalShadingSmooth;
      float darkness = shadowParameters.darkness;
      vec3 uvw = shadowParameters.texCoords;
      depth -= depthBias;
      float visibility = czm_shadowDepthCompare(shadowMap, uvw, depth);
      return czm_private_shadowVisibility(visibility, nDotL, normalShadingSmooth, darkness);
  }
  vec4 getPositionEC(){
      return czm_windowToEyeCoordinates(gl_FragCoord);
  }
  vec3 getNormalEC(){
      return vec3(1.);
  }
  vec4 toEye(in vec2 uv,in float depth){
      vec2 xy=vec2((uv.x*2.-1.),(uv.y*2.-1.));
      vec4 posInCamera=czm_inverseProjection*vec4(xy,depth,1.);
      posInCamera=posInCamera/posInCamera.w;
      return posInCamera;
  }
  vec3 pointProjectOnPlane(in vec3 planeNormal,in vec3 planeOrigin,in vec3 point){
      vec3 v01=point-planeOrigin;
      float d=dot(planeNormal,v01);
      return(point-planeNormal*d);
  }
  float getDepth(in vec4 depth){
      float z_window=czm_unpackDepth(depth);
      z_window=czm_reverseLogDepth(z_window);
      float n_range=czm_depthRange.near;
      float f_range=czm_depthRange.far;
      return(2.*z_window-n_range-f_range)/(f_range-n_range);
  }
  float shadow(in vec4 positionEC){
      vec3 normalEC=getNormalEC();
      zx_shadowParameters shadowParameters;
      shadowParameters.texelStepSize=shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.xy;
      shadowParameters.depthBias=shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.z;
      shadowParameters.normalShadingSmooth=shadowMap_texelSizeDepthBiasAndNormalShadingSmooth.w;
      shadowParameters.darkness=shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness.w;
      vec3 directionEC=positionEC.xyz-shadowMap_lightPositionEC.xyz;
      float distance=length(directionEC);
      directionEC=normalize(directionEC);
      float radius=shadowMap_lightPositionEC.w;
      if(distance>radius)
      {
          return 2.0;
      }
      vec3 directionWC=czm_inverseViewRotation*directionEC;
      shadowParameters.depth=distance/radius-0.0003;
      shadowParameters.nDotL=clamp(dot(normalEC,-directionEC),0.,1.);
      shadowParameters.texCoords=directionWC;
      float visibility=czm_shadowVisibility(shadowMap_textureCube,shadowParameters);
      return visibility;
  }
  bool visible(in vec4 result)
  {
      result.x/=result.w;
      result.y/=result.w;
      result.z/=result.w;
      return result.x>=-1.&&result.x<=1.
      &&result.y>=-1.&&result.y<=1.
      &&result.z>=-1.&&result.z<=1.;
  }
  void main(){
      // ¨¦????? = ????????????(¨¦???????????, ????????????)
      gl_FragColor = texture2D(colorTexture, v_textureCoordinates);
      // ?¡¦???? = ??¡¦????¡¦????(????????????(?¡¦??????????, ????????????))
      float depth = getDepth(texture2D(depthTexture, v_textureCoordinates));
      // ?¡ì??¡ì? = (????????????, ?¡¦????)
      vec4 viewPos = toEye(v_textureCoordinates, depth);
      // ????????????
      vec4 wordPos = czm_inverseView * viewPos;
      // ??????????????????????
      vec4 vcPos = camera_view_matrix * wordPos;
      float near = .001 * helsing_viewDistance;
      float dis = length(vcPos.xyz);
      if(dis > near && dis < helsing_viewDistance){
          // ¨¦???¡ì???????
          vec4 posInEye = camera_projection_matrix * vcPos;
          // ????¡ì????¨¦??????
          // vec4 helsing_visibleAreaColor=vec4(0.,1.,0.,.5);
          // vec4 helsing_invisibleAreaColor=vec4(1.,0.,0.,.5);
          if(visible(posInEye)){
              float vis = shadow(viewPos);
              if(vis > 0.3){
                  gl_FragColor = mix(gl_FragColor,helsing_visibleAreaColor,.5);
              } else{
                  gl_FragColor = mix(gl_FragColor,helsing_invisibleAreaColor,.5);
              }
          }
      }
  }`;
  const postStage = new Cesium.PostProcessStage({
      fragmentShader: fs,
      uniforms: {
          shadowMap_textureCube: () => {
              this.shadowMap.update(Reflect.get(this.viewer.scene, "_frameState"));
              return Reflect.get(this.shadowMap, "_shadowMapTexture");
          },
          shadowMap_matrix: () => {
              this.shadowMap.update(Reflect.get(this.viewer.scene, "_frameState"));
              return Reflect.get(this.shadowMap, "_shadowMapMatrix");
          },
          shadowMap_lightPositionEC: () => {
              this.shadowMap.update(Reflect.get(this.viewer.scene, "_frameState"));
              return Reflect.get(this.shadowMap, "_lightPositionEC");
          },
          shadowMap_normalOffsetScaleDistanceMaxDistanceAndDarkness: () => {
              this.shadowMap.update(Reflect.get(this.viewer.scene, "_frameState"));
              const bias = this.shadowMap._pointBias;
              return Cesium.Cartesian4.fromElements(
                  bias.normalOffsetScale,
                  this.shadowMap._distance,
                  this.shadowMap.maximumDistance,
                  0.0,
                  new Cesium.Cartesian4()
              );
          },
          shadowMap_texelSizeDepthBiasAndNormalShadingSmooth: () => {
              this.shadowMap.update(Reflect.get(this.viewer.scene, "_frameState"));
              const bias = this.shadowMap._pointBias;
              const scratchTexelStepSize = new Cesium.Cartesian2();
              const texelStepSize = scratchTexelStepSize;
              texelStepSize.x = 1.0 / this.shadowMap._textureSize.x;
              texelStepSize.y = 1.0 / this.shadowMap._textureSize.y;

              return Cesium.Cartesian4.fromElements(
                  texelStepSize.x,
                  texelStepSize.y,
                  bias.depthBias,
                  bias.normalShadingSmooth,
                  new Cesium.Cartesian4()
              );
          },
          camera_projection_matrix: this.lightCamera.frustum.projectionMatrix,
          camera_view_matrix: this.lightCamera.viewMatrix,
          helsing_viewDistance: () => {
              return this.viewDistance;
          },
          helsing_visibleAreaColor: this.visibleAreaColor,
          helsing_invisibleAreaColor: this.invisibleAreaColor,
      }
  });
  this.postStage = this.viewer.scene.postProcessStages.add(postStage);
}
drawFrustumOutline() {
  const scratchRight = new Cesium.Cartesian3();
  const scratchRotation = new Cesium.Matrix3();
  const scratchOrientation = new Cesium.Quaternion();
  const position = this.lightCamera.positionWC;
  const direction = this.lightCamera.directionWC;
  const up = this.lightCamera.upWC;
  let right = this.lightCamera.rightWC;
  right = Cesium.Cartesian3.negate(right, scratchRight);
  let rotation = scratchRotation;
  Cesium.Matrix3.setColumn(rotation, 0, right, rotation);
  Cesium.Matrix3.setColumn(rotation, 1, up, rotation);
  Cesium.Matrix3.setColumn(rotation, 2, direction, rotation);
  let orientation = Cesium.Quaternion.fromRotationMatrix(rotation, scratchOrientation);

  let instance = new Cesium.GeometryInstance({
      geometry: new Cesium.FrustumOutlineGeometry({
          frustum: this.lightCamera.frustum,
          origin: this.viewPosition,
          orientation: orientation
      }),
      id: Math.random().toString(36).substr(2),
      attributes: {
          color: Cesium.ColorGeometryInstanceAttribute.fromColor(
              Cesium.Color.YELLOWGREEN//new Cesium.Color(0.0, 1.0, 0.0, 1.0)
          ),
          show: new Cesium.ShowGeometryInstanceAttribute(true)
      }
  });

  this.frustumOutline = this.viewer.scene.primitives.add(
      new Cesium.Primitive({
          geometryInstances: [instance],
          appearance: new Cesium.PerInstanceColorAppearance({
              flat: true,
              translucent: false
          })
      })
  );
}
drawSketch() {
  this.sketch = this.viewer.entities.add({
      name: 'sketch',
      position: this.viewPosition,
      orientation: Cesium.Transforms.headingPitchRollQuaternion(
          this.viewPosition,
          Cesium.HeadingPitchRoll.fromDegrees(this.viewHeading - this.horizontalViewAngle, this.viewPitch, 0.0)
      ),
      ellipsoid: {
          radii: new Cesium.Cartesian3(
              this.viewDistance,
              this.viewDistance,
              this.viewDistance
          ),
          // innerRadii: new Cesium.Cartesian3(2.0, 2.0, 2.0),
          minimumClock: Cesium.Math.toRadians(-this.horizontalViewAngle / 2),
          maximumClock: Cesium.Math.toRadians(this.horizontalViewAngle / 2),
          minimumCone: Cesium.Math.toRadians(this.verticalViewAngle + 7.75),
          maximumCone: Cesium.Math.toRadians(180 - this.verticalViewAngle - 7.75),
          fill: false,
          outline: true,
          subdivisions: 256,
          stackPartitions: 64,
          slicePartitions: 64,
          outlineColor: Cesium.Color.YELLOWGREEN
      }
  });
}
 getHeading(fromPosition, toPosition) {
  let finalPosition = new Cesium.Cartesian3();
  let matrix4 = Cesium.Transforms.eastNorthUpToFixedFrame(fromPosition);
  Cesium.Matrix4.inverse(matrix4, matrix4);
  Cesium.Matrix4.multiplyByPoint(matrix4, toPosition, finalPosition);
  Cesium.Cartesian3.normalize(finalPosition, finalPosition);
  return Cesium.Math.toDegrees(Math.atan2(finalPosition.x, finalPosition.y));
}

 getPitch(fromPosition, toPosition) {
  let finalPosition = new Cesium.Cartesian3();
  let matrix4 = Cesium.Transforms.eastNorthUpToFixedFrame(fromPosition);
  Cesium.Matrix4.inverse(matrix4, matrix4);
  Cesium.Matrix4.multiplyByPoint(matrix4, toPosition, finalPosition);
  Cesium.Cartesian3.normalize(finalPosition, finalPosition);
  return Cesium.Math.toDegrees(Math.asin(finalPosition.z));
}
  add() {
      this.createLightCamera();
      this.createShadowMap();
      this.createPostStage();
      this.drawFrustumOutline();
    //   this.drawSketch();
  }

  update() {
      this.clear();
      this.add();
  }

  clear() {
      if (this.sketch) {
          this.viewer.entities.removeById(this.sketch.id);
          this.sketch = null;
      }
      if (this.frustumOutline) {
        //   this.frustumOutline.destroy();
        this.viewer.scene.primitives.remove(this.frustumOutline);
          this.frustumOutline = null;
      }
      if (this.postStage) {
          this.viewer.scene.postProcessStages.remove(this.postStage);
          this.postStage = null;
      }
  }
}

export default ViewShedStage;

