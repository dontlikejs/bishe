/*
 * @Description: 娉㈢汗鍦嗘晥鏋滐紙鍜屾按娉㈢汗鎵╂暎绫讳技锛屽弬鑰冨紑婧愪唬鐮侊級
 * @Version: 1.0
 * @Author: Julian
 * @Date: 2022-03-03 21:59:17
 * @LastEditors: Julian
 * @LastEditTime: 2022-03-03 23:09:02
 */
import * as Cesium from 'cesium'
class CircleRippleMaterialProperty {
    constructor(options) {
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._speed = undefined;
        this.color = options.color;
        this.speed = options.speed;
        this.count = options.count;
        this.gradient = options.gradient;
    };

    get isConstant() {
        return false;
    }

    get definitionChanged() {
        return this._definitionChanged;
    }

    getType(time) {
        return Cesium.Material.CircleRippleMaterialType;
    }

    getValue(time, result) {
        if (!Cesium.defined(result)) {
            result = {};
        }

        result.color = Cesium.Property.getValueOrDefault(this._color, time, Cesium.Color.RED, result.color);
        result.speed = Cesium.Property.getValueOrDefault(this._speed, time, 10, result.speed);
        result.count = this.count;
        result.gradient = this.gradient;
        return result
    }

    equals(other) {
        return (this === other ||
            (other instanceof CircleRippleMaterialProperty &&
                Cesium.Property.equals(this._color, other._color) &&
                Cesium.Property.equals(this._speed, other._speed) &&
                Cesium.Property.equals(this.count, other.count) &&
                Cesium.Property.equals(this.gradient, other.gradient))
        )
    }
}

Object.defineProperties(CircleRippleMaterialProperty.prototype, {
    color: Cesium.createPropertyDescriptor('color'),
    speed: Cesium.createPropertyDescriptor('speed'),
    count: Cesium.createPropertyDescriptor('count'),
    gradient: Cesium.createPropertyDescriptor('gradient')
})
let ExtendedCesium = Object.assign({}, Cesium);
ExtendedCesium.Material.HexagonSpreadMaterialImage = '22.png'
ExtendedCesium.CircleRippleMaterialProperty = CircleRippleMaterialProperty;
ExtendedCesium.Material.CircleRippleMaterialProperty = 'CircleRippleMaterialProperty';
ExtendedCesium.Material.CircleRippleMaterialType = 'CircleRippleMaterialType';
ExtendedCesium.Material.CircleRippleMaterialSource = `
#define MAX_RADIUS 2  //最大半径
#define DOUBLE_HASH 0
 
// Hash functions shamefully stolen from:
// https://www.shadertoy.com/view/4djSRW
#define HASHSCALE1 .1  //一维随机数种子
#define HASHSCALE3 vec3(0.1,0.2,0.3) //三维随机数种子
//随机值生成算法  //https://blog.csdn.net/UWA4D/article/details/120550874
float hash12(vec2 p)
{
    //返回x的小数部分 即x-floor(x)
   vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
    p3 += dot(p3, p3.yzx + 10.);
    return fract((p3.x + p3.y) * p3.z);
}

vec2 hash22(vec2 p)
{
   vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
    p3 += dot(p3, p3.yzx+20.);
    return fract((p3.xy+p3.yz)*p3.zy);
}
 
czm_material czm_getMaterial(czm_materialInput m)
{
 
      float tiling = 10.;
 
     vec2 uv = m.st *tiling;
        
 
    vec2 p0 = floor(uv);
    float iTime = czm_frameNumber/100.;
    vec2 circles = vec2(0.); // 结果接收变量
 
    // i,j 从 -1 扰动到 正1
    for (int j = -MAX_RADIUS; j <= MAX_RADIUS; ++j)
    {
        for (int i = -MAX_RADIUS; i <= MAX_RADIUS; ++i)
        {
            vec2 pi = p0 + vec2(i, j);  //通过随机值产生涟漪，循环采样叠加
            vec2 p = pi + hash22(pi);  // 第一次随机运算 得到带位置信息的随机值
            float t = fract(0.05*iTime + hash12(pi));  //随机时间产生，0.05为速度，可在外部调整，时间随机化，用一维函数，frac 在0-1之间循环
            vec2 v = p - uv;  //得出实际的位置信息 p -原始的uv，实际上涟漪最终就是uv的移动，相减之后得到法线信息
            float d = length(v) - (float(MAX_RADIUS) + 1.)*t; //接下来计算圆，圆的计算公式是length(position)-R
            // 这边是max_radius+1，如果不加1，所有值都会比原来的小，这样会导致法线强度太弱，然后乘以我们得到的t就可以产生扩散的圆了
            // x?+y?-（R?+1）*t  乘以t，即为当前圆的半径大小
            float h = 1e-3;
            float d1 = d - h;
            float d2 = d + h;
            // 将得到的d进行sine函数运算一下就能得到涟漪，将d和一个值相乘能得到不同圈数的涟漪，然后用smoothstep控制涟漪的边缘虚实效果。
            // 我们这边要做两层，用两层的插值来模拟渐变，用h来控制涟漪的偏移值。
            float p1 = sin(31.*d1) * smoothstep(-0.6, -0.3, d1) * smoothstep(0., -0.3, d1);
            float p2 = sin(31.*d2) * smoothstep(-0.6, -0.3, d2) * smoothstep(0., -0.3, d2);
            //水波算法  0.5*  法线uv - p的法线
            // 能动起来后，我们需要一个到达最大值后渐隐的效果，通过两者的差值乘以时间的反向，
            //即1-0来模拟边缘的渐变效果，乘以两次时间是为了增强对比度。
 
            circles += 0.5 * normalize(v) * ((p2 - p1) / (2. * h) * (1. - t) * (1. - t));
        }
    }
     // MAX_RADIUS ==1 , 即，圆圈要除9 ，使得看起来不那么乱
    circles /= float((MAX_RADIUS*2+1)*(MAX_RADIUS*2+1));
    //强度即便取1 也可以， 随波动时间变大再变小，即浪先大，慢慢衰减
    float intensity = mix(0.01, 0.15, smoothstep(0.1, 0.6, abs(fract(0.05*iTime + 0.5)*2.-1.)));
    //关键在于circles的 xy的计算意义 ，第三维不影响效果
    vec3 n = vec3(circles,sqrt(1. - dot(circles, circles))); //normal
    //n.xy偏移量会推动uv移动，使得看起来有波浪的效果
    vec3 color = texture2D(image, m.st - intensity*n.xy).rgb ;
    float nosie = 5.*pow(clamp(dot(n, normalize(vec3(1., 0.7, 0.5))), 0., 1.), 6.);
    color = color + nosie;
    gl_FragColor = vec4(color, 1.0);
    czm_material dm = czm_getDefaultMaterial(m);
    dm.diffuse = gl_FragColor.xyz;
    return dm;
 
}
                                            `

ExtendedCesium.Material._materialCache.addMaterial(ExtendedCesium.Material.CircleRippleMaterialType, {
    fabric: {
        type: ExtendedCesium.Material.CircleRippleMaterialType,
        uniforms: {
            image: ExtendedCesium.Material.HexagonSpreadMaterialImage,
        },
        source: ExtendedCesium.Material.CircleRippleMaterialSource
    },
    translucent: function(material) {
        return true;
    }
})

export default CircleRippleMaterialProperty;