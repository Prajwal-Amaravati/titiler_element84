"use client";

import { useEffect, useState } from "react";
import Map from "react-map-gl/maplibre";
import DeckGL from "@deck.gl/react";
import { PointCloudLayer } from "@deck.gl/layers";
import { COORDINATE_SYSTEM } from "@deck.gl/core";
import "maplibre-gl/dist/maplibre-gl.css";

const INITIAL_VIEW_STATE = {
  latitude: 48.46512276185827,
  longitude: -118.51643591525152,
  zoom: 3,
  bearing: 0,
  pitch: 30,
  minZoom: 2,
};

export default function Page() {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [layers, setLayers] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const placeName = "Ferry"; // Change to the place you want to query
      try {
        console.log("Fetching data for:", placeName);
        const response = await fetch(
          `/centroid?placeName=${encodeURIComponent(placeName)}`
        );
        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch centroid data: ${response.status} ${response.statusText}`
          );
        }

        const centroidData = await response.json();
        console.log("Received centroid data:", centroidData);

        let longitude, latitude;

        if (typeof centroidData === "string") {
          // If it's a string, try to parse it
          const match = centroidData.match(
            /POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/
          );
          if (!match) {
            throw new Error(`Invalid centroid format: ${centroidData}`);
          }
          [, longitude, latitude] = match.map(Number);
        } else if (
          typeof centroidData === "object" &&
          centroidData.longitude &&
          centroidData.latitude
        ) {
          // If it's an object with longitude and latitude properties
          longitude = Number(centroidData.longitude);
          latitude = Number(centroidData.latitude);
        } else {
          throw new Error(
            `Unexpected centroid data format: ${JSON.stringify(centroidData)}`
          );
        }

        console.log("Parsed coordinates:", longitude, latitude);

        // Create the PointCloudLayer using the centroid data
        const newLayers = [
          new PointCloudLayer({
            id: "point-cloud-layer",
            data: [{ position: [longitude, latitude] }],
            getPosition: (d) => d.position,
            getColor: [255, 0, 0],
            pointSize: 10,
            pickable: true,
          }),
        ];

        setLayers(newLayers);
        setViewState((prevState) => ({
          ...prevState,
          latitude,
          longitude,
        }));
      } catch (error) {
        console.error("Error fetching centroid data:", error);
        setError(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {error && <div style={{ color: "red", padding: "10px" }}>{error}</div>}
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        getTooltip={({ object }) =>
          object && {
            html: `<strong>Centroid:</strong> [${object.position[0].toFixed(
              4
            )}, ${object.position[1].toFixed(4)}]`,
          }
        }
      >
        <Map
          mapStyle="https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
          onMove={(evt) => setViewState(evt.viewState)}
        />
      </DeckGL>
    </>
  );
}
