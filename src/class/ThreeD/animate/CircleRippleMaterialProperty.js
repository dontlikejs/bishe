/*
 * @Description: 波纹圆效果（和水波纹扩散类似，参考开源代码）
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
#define MAX_RADIUS 2  //���뾶
#define DOUBLE_HASH 0
 
// Hash functions shamefully stolen from:
// https://www.shadertoy.com/view/4djSRW
#define HASHSCALE1 .1  //һά���������
#define HASHSCALE3 vec3(0.1,0.2,0.3) //��ά���������
//���ֵ�����㷨  //https://blog.csdn.net/UWA4D/article/details/120550874
float hash12(vec2 p)
{
    //����x��С������ ��x-floor(x)
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
    vec2 circles = vec2(0.); // ������ձ���
 
    // i,j �� -1 �Ŷ��� ��1
    for (int j = -MAX_RADIUS; j <= MAX_RADIUS; ++j)
    {
        for (int i = -MAX_RADIUS; i <= MAX_RADIUS; ++i)
        {
            vec2 pi = p0 + vec2(i, j);  //ͨ�����ֵ����������ѭ����������
            vec2 p = pi + hash22(pi);  // ��һ��������� �õ���λ����Ϣ�����ֵ
            float t = fract(0.05*iTime + hash12(pi));  //���ʱ�������0.05Ϊ�ٶȣ������ⲿ������ʱ�����������һά������frac ��0-1֮��ѭ��
            vec2 v = p - uv;  //�ó�ʵ�ʵ�λ����Ϣ p -ԭʼ��uv��ʵ�����������վ���uv���ƶ������֮��õ�������Ϣ
            float d = length(v) - (float(MAX_RADIUS) + 1.)*t; //����������Բ��Բ�ļ��㹫ʽ��length(position)-R
            // �����max_radius+1���������1������ֵ�����ԭ����С�������ᵼ�·���ǿ��̫����Ȼ��������ǵõ���t�Ϳ��Բ�����ɢ��Բ��
            // x?+y?-��R?+1��*t  ����t����Ϊ��ǰԲ�İ뾶��С
            float h = 1e-3;
            float d1 = d - h;
            float d2 = d + h;
            // ���õ���d����sine��������һ�¾��ܵõ���������d��һ��ֵ����ܵõ���ͬȦ����������Ȼ����smoothstep���������ı�Ե��ʵЧ����
            // �������Ҫ�����㣬������Ĳ�ֵ��ģ�⽥�䣬��h������������ƫ��ֵ��
            float p1 = sin(31.*d1) * smoothstep(-0.6, -0.3, d1) * smoothstep(0., -0.3, d1);
            float p2 = sin(31.*d2) * smoothstep(-0.6, -0.3, d2) * smoothstep(0., -0.3, d2);
            //ˮ���㷨  0.5*  ����uv - p�ķ���
            // �ܶ�������������Ҫһ���������ֵ������Ч����ͨ�����ߵĲ�ֵ����ʱ��ķ���
            //��1-0��ģ���Ե�Ľ���Ч������������ʱ����Ϊ����ǿ�Աȶȡ�
 
            circles += 0.5 * normalize(v) * ((p2 - p1) / (2. * h) * (1. - t) * (1. - t));
        }
    }
     // MAX_RADIUS ==1 , ����ԲȦҪ��9 ��ʹ�ÿ���������ô��
    circles /= float((MAX_RADIUS*2+1)*(MAX_RADIUS*2+1));
    //ǿ�ȼ���ȡ1 Ҳ���ԣ� �沨��ʱ�����ٱ�С�������ȴ�����˥��
    float intensity = mix(0.01, 0.15, smoothstep(0.1, 0.6, abs(fract(0.05*iTime + 0.5)*2.-1.)));
    //�ؼ�����circles�� xy�ļ������� ������ά��Ӱ��Ч��
    vec3 n = vec3(circles,sqrt(1. - dot(circles, circles))); //normal
    //n.xyƫ�������ƶ�uv�ƶ���ʹ�ÿ������в��˵�Ч��
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