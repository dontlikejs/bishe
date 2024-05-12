import * as Cesium from 'cesium'
const {
  Cartesian3,
  GeometryInstance,
  PolygonGeometry,
  PolygonHierarchy,
  ColorGeometryInstanceAttribute,
  Color,
  ClassificationPrimitive,
  ClassificationType,
  Cartographic,
  Matrix4,
  ShowGeometryInstanceAttribute
} = Cesium
const handleColor = (color, alpha)=> {
  return Color.fromCssColorString(color).withAlpha(alpha || 1)
}

export default class heightLimit {
  p
  e
  limitHeightPrimitive = null
  constructor({ viewer, data, style = {} }) {
    this.viewer = viewer
    this.data = data
    this.style = style
  }
  addPrimitive(heigh) {
    let height=Number(heigh)
    let {  color = 'pink', alpha } = this.style
    color = handleColor(color, alpha)
    const limitHeightPrimitive = this.viewer.scene.primitives.add(
    	/**
    	https://cesium.com/learn/cesiumjs/ref-doc/ClassificationPrimitive.html?classFilter=ClassificationPrimitive
    	ClassificationPrimitive �������ɿ��Դ�͸
    	*/
     this.p= new ClassificationPrimitive({
        geometryInstances: new GeometryInstance({
          id:'dd',
          geometry: new PolygonGeometry({
            polygonHierarchy: new PolygonHierarchy(
              Cartesian3.fromDegreesArray(this.data)
            ),
            height,
            extrudedHeight: height + 3000
          }),
          attributes: {
            color: ColorGeometryInstanceAttribute.fromColor(color),
            show: new ShowGeometryInstanceAttribute(true)
          }
        }),
        releaseGeometryInstances: false,
        /**
        https://cesium.com/learn/cesiumjs/ref-doc/global.html#ClassificationType
        ֻ�� 3D Tiles �ᱻ����
		 */
        classificationType: ClassificationType.CESIUM_3D_TILE
      })
    )
    // limitHeightPrimitive.readyPromise.then(() => {
    // })

	// ������Ҫ��Ϊ�����һ���߳������ polygon , �õ��ľ�γ�����ݺ���ҪУ��Ľ���������һ��
	this.setPolygon(height, alpha )
  }
  setPolygon(height, alpha ) {
	this.e= this.viewer.entities.add({
      polygon: {
        hierarchy: new PolygonHierarchy(
          Cartesian3.fromDegreesArray(this.data)
        ),
        material: Color.fromCssColorString('#FFF8DC').withAlpha(alpha || 1),
        height:height,
        perPositionHeight: false,
      }
    })
  
  }
  remove(){
    this.viewer.scene.primitives.remove(this.p)
    this.viewer.entities.remove(this.e)
  }
  setHeight(height) {
    if (this.p && this.e) {
      this.p.getGeometryInstanceAttributes('dd').height = height
      this.e.polygon.height = height
      this.viewer.scene.requestRender()  
    }
  }
}
