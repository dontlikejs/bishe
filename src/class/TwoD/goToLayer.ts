import Extent from "@arcgis/core/geometry/Extent.js";

export default function goToLayer(bbox:number[],wkid:number,view:any){
  view.when(function() {
  var extent = new Extent({
      xmin: bbox[0],
      ymin: bbox[1],
      xmax: bbox[2],
      ymax: bbox[3],
      spatialReference: { wkid:wkid }
  });
  view.goTo(extent).then(function() {
      view.zoom = view.zoom * 1.1; // ?????????иж????????иж????бь???50%
  });
});

}