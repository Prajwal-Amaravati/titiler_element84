"use client"

import { useState, useEffect, useRef } from "react"
import { MapContainer, TileLayer, useMap, Rectangle } from "react-leaflet"
import { LatLngBounds, LatLngTuple } from "leaflet"
import L from 'leaflet'
import "leaflet/dist/leaflet.css"
import "leaflet-draw/dist/leaflet.draw.css"

// Import Leaflet Draw
import 'leaflet-draw'

const TITILER_ENDPOINT = "https://titiler.xyz"
const STAC_API = "https://earth-search.aws.element84.com/v0"

function MapUpdater({ bounds, tileUrl, minZoom, maxZoom }) {
  const map = useMap()

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds)
    }
  }, [bounds, map])

  return tileUrl ? (
    <TileLayer
      url={tileUrl}
      attribution="Digital Earth Africa"
      minZoom={minZoom}
      maxZoom={maxZoom}
      bounds={bounds}
    />
  ) : null
}

function DrawControl({ onBboxDrawn }) {
  const map = useMap()

  useEffect(() => {
    if (!map.drawControl) {
      const drawControl = new L.Control.Draw({
        draw: {
          polygon: false,
          polyline: false,
          circle: false,
          circlemarker: false,
          marker: false,
          rectangle: {
            shapeOptions: {
              color: 'blue'
            }
          }
        }
      })

      map.addControl(drawControl)

      map.on(L.Draw.Event.CREATED, (e) => {
        const layer = e.layer
        onBboxDrawn(layer.getBounds())
      })

      map.drawControl = drawControl
    }

    return () => {
      if (map.drawControl) {
        map.removeControl(map.drawControl)
        delete map.drawControl
      }
    }
  }, [map, onBboxDrawn])

  return null
}

export default function Component() {
  const [startDate, setStartDate] = useState<string>("2019-01-01")
  const [endDate, setEndDate] = useState<string>("2019-12-31")
  const [scenes, setScenes] = useState<any[]>([])
  const [selectedScene, setSelectedScene] = useState<string>("")
  const [tileUrl, setTileUrl] = useState<string>("")
  const [bounds, setBounds] = useState<LatLngBounds | null>(null)
  const [drawnBounds, setDrawnBounds] = useState<LatLngBounds | null>(null)
  const [minZoom, setMinZoom] = useState<number>(8)
  const [maxZoom, setMaxZoom] = useState<number>(14)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (startDate && endDate && drawnBounds) {
      fetchScenes(startDate, endDate, drawnBounds)
    }
  }, [startDate, endDate, drawnBounds])

  useEffect(() => {
    if (selectedScene) {
      fetchTileJson(selectedScene)
    }
  }, [selectedScene])

  const fetchScenes = async (start: string, end: string, bbox: LatLngBounds) => {
    setError(null)
    setIsLoading(true)
    const query = {
      collections: ["sentinel-s2-l2a-cogs"],
      datetime: `${start}T00:00:00Z/${end}T23:59:59Z`,
      bbox: [bbox.getWest(), bbox.getSouth(), bbox.getEast(), bbox.getNorth()],
      query: {
        "eo:cloud_cover": {
          lt: 100
        },
      },
      limit: 100,
      fields: {
        include: ['id', 'properties.datetime', 'properties.eo:cloud_cover', 'bbox'],
        exclude: ['assets', 'links']
      }
    }

    try {
      const response = await fetch(`${STAC_API}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip',
          'Accept': 'application/geo+json'
        },
        body: JSON.stringify(query)
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch scenes: ${response.statusText}`)
      }

      const data = await response.json()
      console.log(data,"this is query")
      
      setScenes(data.features)
    } catch (error) {
      console.error("Error fetching scenes:", error)
      setError(`Failed to fetch scenes: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchTileJson = async (sceneId: string) => {
    setError(null)
    setIsLoading(true)
    const scene = scenes.find(s => s.id === sceneId)
    if (!scene) {
      setError("Selected scene not found")
      setIsLoading(false)
      return
    }

    const url_template = `${STAC_API}/collections/sentinel-s2-l2a-cogs/items/${sceneId}`

    try {
        const response = await fetch(
            `${TITILER_ENDPOINT}/stac/WebMercatorQuad/tilejson.json?` + new URLSearchParams({
              url: url_template,
              assets: "B02",
            }).toString() + '&' + new URLSearchParams({
              assets: "B03",
            }).toString() + '&' + new URLSearchParams({
              assets: "B04",
              color_formula: "Gamma RGB 3.5 Saturation 1.7 Sigmoidal RGB 15 0.35",
            }).toString()
          );
          

      if (!response.ok) {
        throw new Error(`Failed to fetch tile JSON: ${response.statusText}`)
      }

      const data = await response.json()
      console.log("data.tiles[0]",data.tiles[0])

      if (data.tiles && data.tiles.length > 0) {
        setTileUrl(data.tiles[0])
        setBounds(new LatLngBounds(
          [scene.bbox[1], scene.bbox[0]] as LatLngTuple,
          [scene.bbox[3], scene.bbox[2]] as LatLngTuple
        ))
        setMinZoom(data.minzoom || 8)
        setMaxZoom(data.maxzoom || 14)
      } else {
        throw new Error("No tiles data found in the response.")
      }
    } catch (error) {
      console.error("Error fetching tile JSON:", error)
      setError(`Failed to fetch tile JSON: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBboxDrawn = (bbox: LatLngBounds) => {
    setDrawnBounds(bbox)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-2">Sentinel-2 STAC Viewer</h1>
      <p className="text-gray-600 mb-4">View Sentinel-2 imagery using Element 84 STAC and titiler</p>

      <div className="space-y-4">
        <div className="flex gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded p-2"
            aria-label="Start date"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded p-2"
            aria-label="End date"
          />
          <select
            value={selectedScene}
            onChange={(e) => setSelectedScene(e.target.value)}
            className="border rounded p-2"
            aria-label="Select a scene"
            disabled={isLoading}
          >
            <option value="">Select a scene</option>
            {scenes.map((scene) => (
              <option key={scene.id} value={scene.id}>
                {scene.id} - Cloud Cover: {scene.properties["eo:cloud_cover"]}%
              </option>
            ))}
          </select>
        </div>

        {error && <div className="text-red-500" role="alert">{error}</div>}
        {isLoading && <div className="text-blue-500">Loading...</div>}

        <div className="h-[500px] rounded-lg overflow-hidden border">
          <MapContainer
            center={[0, 0]}
            zoom={3}
            style={{ height: "100%", width: "100%" }}
            whenCreated={(map) => {
              mapRef.current = map
            }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <DrawControl onBboxDrawn={handleBboxDrawn} />
            {drawnBounds && (
              <Rectangle bounds={drawnBounds} pathOptions={{ color: 'blue', weight: 2 }} />
            )}
            <MapUpdater bounds={bounds} tileUrl={tileUrl} minZoom={minZoom} maxZoom={maxZoom} />
          </MapContainer>
        </div>
      </div>
    </div>
  )
}