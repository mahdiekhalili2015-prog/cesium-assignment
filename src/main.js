import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import "./style.css";

Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI4YjViOGIzZC1mMWMwLTQ1ZDgtYmIxOC1mYWNmY2VhMzgzNmQiLCJpZCI6NDI5MjQzLCJpc3MiOiJodHRwczovL2lvbi5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3NzgzMjM1NjB9.UOmG3Ym22LQ2tJk5KYTa3g8z87a0j7Y8rOXmZVa6POI";

const viewer = new Cesium.Viewer("cesiumContainer", {
  terrain: Cesium.Terrain.fromWorldTerrain(),
  baseLayerPicker: true,
  geocoder: true,
  homeButton: true,
  sceneModePicker: true,
  navigationHelpButton: true,
  animation: false,
  timeline: false,
});

try {
  const buildings = await Cesium.createOsmBuildingsAsync();
  viewer.scene.primitives.add(buildings);

  viewer.imageryLayers.addImageryProvider(
    new Cesium.WebMapServiceImageryProvider({
      url: "https://sgx.geodatenzentrum.de/wms_topplus_open",
      layers: "web",
      parameters: {
        format: "image/png",
        transparent: false,
      },
      credit: "BKG TopPlusOpen WMS",
    })
  );

  document.getElementById("toggleBuildings").addEventListener("click", () => {
    buildings.show = !buildings.show;
    document.getElementById("toggleBuildings").textContent = buildings.show
      ? "Hide Buildings"
      : "Show Buildings";
  });

  document.getElementById("flyStuttgart").addEventListener("click", () => {
    flyToStuttgart();
  });

  function flyToStuttgart() {
    viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(9.1829, 48.7758, 1200),
      orientation: {
        heading: 0,
        pitch: Cesium.Math.toRadians(-45),
        roll: 0,
      },
    });
  }

  const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

  handler.setInputAction((click) => {
    const cartesian = viewer.camera.pickEllipsoid(
      click.position,
      viewer.scene.globe.ellipsoid
    );

    if (cartesian) {
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const lon = Cesium.Math.toDegrees(cartographic.longitude).toFixed(5);
      const lat = Cesium.Math.toDegrees(cartographic.latitude).toFixed(5);

      document.getElementById("coords").textContent =
        `Longitude: ${lon}, Latitude: ${lat}`;
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  flyToStuttgart();
} catch (error) {
  console.error("Loading failed:", error);
}