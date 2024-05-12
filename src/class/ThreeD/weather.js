import * as Cesium from 'cesium'
class weather {
  rain;
  rainJudge;
  snow;
  snowJudge;
  fog;
  fogJudge;
  constructor(options) {
    window.viewer = options.viewer;
  }
  Rain() {
    if (this.rainJudge) {
      this.removeRain();
    } else {
      this.addRain();
    }
  }
  addRain() {
    this.rainJudge = true;
    window.viewer.shadowMap.darkness = 0.5; //¨¦???????????
    let collection = window.viewer.scene.postProcessStages;
    this.rain = new Cesium.PostProcessStage({
      name: "czm_rain",
      fragmentShader: `
              uniform sampler2D colorTexture;//???????????????????????¡ì???
              varying vec2 v_textureCoordinates;
              uniform float vrain;
  
              float hash(float x){
                  return fract(sin(x*133.3)*13.13);
                  // fract????¡ã???¡ã¨¦?¡§???
              }
              void main(void){
                  float time = czm_frameNumber / vrain;
                  vec2 resolution = czm_viewport.zw;
                  //????????????????????????????????????????¡ã?????????????0???1?????????
                  vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
                  //c ¨¦?????    a???????¡ì????
                  vec3 c=vec3(.6,.7,.8);
                  float a=0.4;
                  float si=sin(a),co=cos(a);
                  uv*=mat2(co,-si,si,co);
                  uv*=length(uv+vec2(0,-8.))*.3+1.;
                  float v=1.-sin(hash(floor(uv.x*100.))*2.);
                  //uv.y*(5./(2.+v))??¡§?????¡§?¡è?y??????????¡ì????
                  float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;
                  //clamp(x,min,max)  =  min(max(x,min),max) ??¡§???¨¦?????????¡è¡ì?¡ã????
                  c*=v*b; //?????????¨¦?¡§???¨¦?????   ???????????????¨¦????????¨¦??c???????????¡ã???v???¨¦?¡§?????????b
                  gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(c,1), 0.5); 
                  //?¡ã?¨¦?¡§?????????????????????
                  //mix(x,y,a)  =   x(1-a)+y*a
              }
    `,
      uniforms: {
        vrain: function () {
          return 80; //value:???¨¦??
        },
      },
    });
    collection.add(this.rain);
  }
  removeRain() {
    this.rainJudge = false;
    window.viewer.scene.postProcessStages.remove(this.rain);
  }
  Snow() {
    if (this.snowJudge) {
      this.removeSnow();
    } else {
      this.addSnow();
    }
  }
  // addSnow() {
  //   this.snowJudge = true;
  //   window.viewer.shadowMap.darkness = 0.9; //¨¦???????????
  //   let collection = window.viewer.scene.postProcessStages;
  //   this.snow = new Cesium.PostProcessStage({
  //     name: "czm_snow",
  //     fragmentShader: `
  //             uniform sampler2D colorTexture;
  //             varying vec2 v_textureCoordinates;
  //             uniform float vsnow;
  //             //uv???v_textureCoordinates?????¡§?????????¨¦???????¡§?????¡§?¡è???????????????????¨¦?????
  //             float snow(vec2 uv,float scale)
  //             {   float time = czm_frameNumber / vsnow;
  //                 float w=smoothstep(1.,0.,-uv.y*(scale/10.));if(w<.1)return 0.;
  //                 uv.x+=time/scale;uv.y+=time*2./scale;uv.x+=sin(uv.y+time*.5)/scale;
  //                 //???¨¦????¡§??¡¦???
  //                 uv*=scale;vec2 s=floor(uv),f=fract(uv),p;float k=3.,d;
  //                 p=.5+.35*sin(11.*fract(sin((s+p+scale)*mat2(7,3,6,5))*5.))-f;d=length(p);k=min(d,k);
  //                 //k?¡ã?????????¡ã?????¡ã
  //                 k=smoothstep(0.,k,sin(f.x+f.y)*0.01);
  //                 return k*w;
  //             }
  //             void main(void){
  //                 vec2 resolution = czm_viewport.zw;
  //                 //??¡¦?????????¨¦?????
  //                 vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
  //                 vec3 finalColor=vec3(0);
  //                 float c = 0.0;
  //                 c+=snow(uv,30.)*.0;
  //                 c+=snow(uv,20.)*.0;
  //                 c+=snow(uv,15.)*.0;
  //                 c+=snow(uv,10.);
  //                 c+=snow(uv,8.);
  //                 c+=snow(uv,6.);
  //                 c+=snow(uv,5.);
  //                 finalColor=(vec3(c));
  //                 gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(finalColor,1), 0.5);
  //                 //texture2D?????????v_textureCoordinates???????????????¨¦???????????¨¦?????mix?¡¦¡¦???
  //               }
  //         `,
  //     uniforms: {
  //       vsnow: function () {
  //         return 60; //value:???¨¦???????????????????????
  //       },
  //     },
  //   });
  //   collection.add(this.snow);
  // }

  addSnow() {
    this.snowJudge = true;
    
  window.viewer.shadowMap.darkness = 0.9; //¨¦???????????
  let collection = window.viewer.scene.postProcessStages;
  this.snow = new Cesium.PostProcessStage({
    name: "czm_snow",
    fragmentShader: `
  
            uniform sampler2D colorTexture;
            varying vec2 v_textureCoordinates;
            void main(void){
              float snow = 0.0;
              float time = czm_frameNumber / 60.;
              vec2 resolution = czm_viewport.zw;
              float gradient = (1.0-float(gl_FragCoord.y / resolution.x))*0.4;
              float random = fract(sin(dot(gl_FragCoord.xy,vec2(12.9898,78.233)))* 43758.5453);
              for(int k=0;k<6;k++){
                  for(int i=0;i<12;i++){
                      float cellSize = 2.0 + (float(i)*3.0);
                float downSpeed = 0.3+(sin(time*0.4+float(k+i*20))+1.0)*0.00008;
                      vec2 uv = (gl_FragCoord.xy / resolution.x)+vec2(0.01*sin((time+float(k*6185))*0.6+float(i))*(5.0/float(i)),downSpeed*(time+float(k*1352))*(1.0/float(i)));
                      vec2 uvStep = (ceil((uv)*cellSize-vec2(0.5,0.5))/cellSize);
                      float x = fract(sin(dot(uvStep.xy,vec2(12.9898+float(k)*12.0,78.233+float(k)*315.156)))* 43758.5453+float(k)*12.0)-0.5;
                      float y = fract(sin(dot(uvStep.xy,vec2(62.2364+float(k)*23.0,94.674+float(k)*95.0)))* 62159.8432+float(k)*12.0)-0.5;
          
                      float randomMagnitude1 = sin(time*2.5)*0.7/cellSize;
                      float randomMagnitude2 = cos(time*2.5)*0.7/cellSize;
          
                      float d = 5.0*distance((uvStep.xy + vec2(x*sin(y),y)*randomMagnitude1 + vec2(y,x)*randomMagnitude2),uv.xy);
          
                      float omiVal = fract(sin(dot(uvStep.xy,vec2(32.4691,94.615)))* 31572.1684);
                      if(omiVal<0.08?true:false){
                          float newd = (x+1.0)*0.4*clamp(1.9-d*(15.0+(x*6.3))*(cellSize/1.4),0.0,1.0);
                          /*snow += d<(0.08+(x*0.3))/(cellSize/1.4)?
                              newd
                              :newd;*/
                          snow += newd;
                      }
                  }
              }
              
              
              gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), vec4(snow)+gradient*vec4(0.4,0.8,1.0,0.0) + random*0.01, 0.5) ;
              }
        `,

  });
  collection.add(this.snow);
  }
  removeSnow() {
    this.snowJudge = false;
    window.viewer.scene.postProcessStages.remove(this.snow);
  }
  Fog() {
    if (this.fogJudge) {
      this.removeFog();
    } else {
      this.addFog();
    }
  }
  addFog() {
    this.fogJudge = true;
    window.viewer.shadowMap.darkness = 0.9; //¨¦???????????
    let collection = window.viewer.scene.postProcessStages;
    this.fog = new Cesium.PostProcessStage({
      name: "czm_fog",
      fragmentShader: `
              uniform sampler2D colorTexture;
              uniform sampler2D depthTexture;
              varying vec2 v_textureCoordinates;
              uniform float vfog;
              
              void main(void)
              {
                vec4 origcolor=texture2D(colorTexture, v_textureCoordinates);
                vec4 fogcolor=vec4(0.8,0.8,0.8,0.5);
                float depth = czm_readDepth(depthTexture, v_textureCoordinates);
                vec4 depthcolor=texture2D(depthTexture, v_textureCoordinates);
                float f=(depthcolor.r-0.22)/vfog;
                if(f<0.0) f=0.0;
                else if(f>1.0) f=1.0;
                gl_FragColor = mix(origcolor,fogcolor,f);
              }
              `,
      uniforms: {
        vfog: function () {
          return 1; //value:???????????????????????????
        },
      },
    });
    collection.add(this.fog);
  }
  removeFog() {
    this.fogJudge = false;
    window.viewer.scene.postProcessStages.remove(this.fog);
  }
  removeAll(){
    this.removeFog();
    this.removeRain();
    this.removeSnow();
  }
}
export default weather;