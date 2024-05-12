import Draw from '@arcgis/core/views/draw/Draw';
import Graphic from '@arcgis/core/Graphic';
import Point from '@arcgis/core/geometry/Point';
import Polyline from '@arcgis/core/geometry/Polyline';
import SimpleLineSymbol from '@arcgis/core/symbols/SimpleLineSymbol';
import * as GeometryEngine from "@arcgis/core/geometry/geometryEngine.js";
import Color from '@arcgis/core/Color';
import Polygon from '@arcgis/core/geometry/Polygon';

export default function drawPolygon(view:any,polygonLayer:any) {
  let draw = new Draw({ //¨¦?????iew¨¦??????????¡è???raw
    view: view
  })
  let action = draw.create("polygon") //¨¦????????¨¦????¡è????????¡ã?¡¦?
  view.focus()
  action.on(
    [
      "vertex-add", // when a vertex is added  ??¡ì??????¨¦????????
      "vertex-remove", // when a vertex is removed ?????????
      "cursor-update", // when the pointer moves ??¡ì?????????????¡ì?
      "draw-complete" // when the drawing is completed ??¡ì??????¨¦????????
    ],
    function(evt){
      createPolygon(evt.vertices,polygonLayer,view)
    }
  )
}

function createPolygon (vertices:any,polygonLayer:any,view:any) {
  polygonLayer.removeAll();
  let symbol = {  //¨¦???¡ì????¨¦?????
    type: "simple-marker",
    color: [47,79,79],
    width: 0.5,
    size: 4,
    outline: {
      color: [ 0, 0, 0 ],
      width: 1  
    }
  }
  let fillSymbol = { //¨¦????????¨¦?????
    type: "simple-fill", // autocasts as new SimpleFillSymbol()
    color: [3, 255, 240, 0.1],
    outline: { // autocasts as new SimpleLineSymbol()
      color: [255,116,3],
      width: 2
    }
  }

  let polygon = new Polygon({
    rings: vertices,
    spatialReference: view.spatialReference
  })

  let polygonGraphics = new Graphic({
    geometry: polygon,
    symbol: fillSymbol
  })
  polygonLayer.add(polygonGraphics);
  let area = GeometryEngine.geodesicArea(polygon,'square-meters')
  if(area < 0) area = -area;
  let areaText = areaFormat(area)
  let center = polygon.centroid
  let pointCenter = new Point({
    longitude:center.longitude,
    latitude:center.latitude
  });
  let textSymbol = { //¨¦???????¨¦????¡§???
    type: "text",
    color: "white",
    haloColor: "black",
    haloSize: "2px",
    text: areaText,
    //xoffset: '50px',
    //yoffset: '-5px',
    font: {
      size: 12,
      family: "sans-serif",
      weight: "bold"
    }
  }
  let textGraphics = new Graphic({ //¨¦????¡§???????????¡ã??????????????????
    geometry:pointCenter,
    symbol: textSymbol
  });
  polygonLayer.add(textGraphics);

  for (let i = 0; i <vertices.length ; i++) {
    let point = {
        type:"point",
        x:vertices[i][0],
        y:vertices[i][1],
        spatialReference: view.spatialReference
    };

    let pointGraphics=new Graphic({
      geometry:point,
      symbol: symbol
    });
    polygonLayer.add(pointGraphics)
  }
}

function areaFormat(area:any) {
  if (area < 2000) {
    area = area.toFixed(2)
    return  area + "?????????"
  }
  else {
    area = (area/10000).toFixed(2)
    return  area + "???¨¦?¡¦"
  }
}