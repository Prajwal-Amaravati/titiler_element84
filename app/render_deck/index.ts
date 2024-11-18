import duckdb from "duckdb";
import "./style.css";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Deck } from "@deck.gl/core";
import { VectorTileLayer } from "@deck.gl/carto";
import QueryFromDBController from "../query/query_controller";
import { GeoJsonLayer } from "@deck.gl/layers";
import { COORDINATE_SYSTEM } from "@deck.gl/core";
import { PointCloudLayer } from "@deck.gl/layers";

// Initialize DuckDB and set up the query
const db = new duckdb.Database(":memory:");
const queryController = new QueryFromDBController();
// Query DuckDB for place name only

// Initial map and Deck.gl setup
const INITIAL_VIEW_STATE = {
  latitude: 40.7128,
  longitude: -74.006,
  zoom: 10,
  bearing: 0,
  pitch: 30,
  minZoom: 8,
};

const deck = new Deck({
  canvas: "deck-canvas",
  initialViewState: INITIAL_VIEW_STATE,
  controller: true,
  getTooltip: ({ object }) => {
    if (!object) return;
    const { properties } = object;
    return {
      html: `<strong>Place Name:</strong> ${properties.NAME}`,
    };
  },
});

// Add basemap
const map = new maplibregl.Map({
  container: "map",
  style: "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json",
  interactive: false,
});
deck.setProps({
  onViewStateChange: ({ viewState }) => {
    const { longitude, latitude, ...rest } = viewState;
    map.jumpTo({ center: [longitude, latitude], ...rest });
  },
});

// Render function for querying DuckDB and setting up layer
async function render() {
  const placeName = "America"; // Change to the place you want to query

  try {
    // Fetch the centroid coordinates
    const centroid = await queryController.querythecentroid(placeName);

    // Create the PointCloudLayer using the centroid data
    const layers = [
      new PointCloudLayer({
        coordinateSystem: COORDINATE_SYSTEM.METER_OFFSETS,
        coordinateOrigin: centroid, // Set the origin to the centroid
        data: [
          { position: centroid }, // Use the centroid as the point position
        ],
        getPosition: (d) => d.position,
        pointSize: 10, // Adjust point size as needed
      }),
    ];

    // Set the layers to the deck instance
    deck.setProps({ layers });
  } catch (error) {
    console.error("Error rendering point cloud layer:", error);
  }
}

render();
