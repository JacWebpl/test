import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AlertCircle, Layers, MapPin, Wind } from "lucide-react";
import type { LatLng } from "leaflet";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface MapContainerProps {
  center?: [number, number];
  zoom?: number;
  detonationPoints?: Array<{
    id: string;
    position: [number, number];
    yield: number;
    name: string;
  }>;
  windDirection?: number;
  windSpeed?: number;
  showBlastRings?: boolean;
  showFallout?: boolean;
  showPopulationDensity?: boolean;
  onMapClick?: (latlng: LatLng) => void;
}

const MapContainer = ({
  center = [40.7128, -74.006], // Default to New York City
  zoom = 10,
  detonationPoints = [
    {
      id: "1",
      position: [40.7128, -74.006],
      yield: 15,
      name: "Hiroshima-sized",
    },
  ],
  windDirection = 45,
  windSpeed = 15,
  showBlastRings = true,
  showFallout = true,
  showPopulationDensity = false,
  onMapClick = () => {},
}: MapContainerProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const blastLayerGroup = useRef<L.LayerGroup | null>(null);
  const falloutLayerGroup = useRef<L.LayerGroup | null>(null);
  const populationLayerGroup = useRef<L.LayerGroup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize map
  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      try {
        // Create the map instance
        leafletMap.current = L.map(mapRef.current).setView(center, zoom);

        // Add OpenStreetMap tiles (would be replaced with MBTiles in production)
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(leafletMap.current);

        // Create layer groups
        blastLayerGroup.current = L.layerGroup().addTo(leafletMap.current);
        falloutLayerGroup.current = L.layerGroup().addTo(leafletMap.current);
        populationLayerGroup.current = L.layerGroup().addTo(leafletMap.current);

        // Add click handler
        leafletMap.current.on("click", (e) => {
          onMapClick(e.latlng);
        });

        setMapLoaded(true);
      } catch (err) {
        setError("Failed to initialize map");
        console.error("Map initialization error:", err);
      }
    }

    // Cleanup function
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Update map center and zoom when props change
  useEffect(() => {
    if (leafletMap.current) {
      leafletMap.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Draw blast rings
  useEffect(() => {
    if (!mapLoaded || !blastLayerGroup.current) return;

    // Clear previous blast rings
    blastLayerGroup.current.clearLayers();

    if (showBlastRings) {
      detonationPoints.forEach((point) => {
        // Calculate blast radii based on yield (simplified formula for demonstration)
        const fireballRadius = Math.pow(point.yield, 1 / 3) * 0.07; // km
        const severeRadius = Math.pow(point.yield, 1 / 3) * 0.3; // km
        const moderateRadius = Math.pow(point.yield, 1 / 3) * 0.7; // km
        const lightRadius = Math.pow(point.yield, 1 / 3) * 1.5; // km

        // Convert km to meters for Leaflet
        const fireballRadiusM = fireballRadius * 1000;
        const severeRadiusM = severeRadius * 1000;
        const moderateRadiusM = moderateRadius * 1000;
        const lightRadiusM = lightRadius * 1000;

        // Add marker for detonation point
        const icon = L.divIcon({
          html: `<div class="flex items-center justify-center w-6 h-6 bg-red-600 rounded-full border-2 border-white text-white text-xs">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
                </div>`,
          className: "",
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker(point.position, { icon }).addTo(
          blastLayerGroup.current!,
        );
        marker.bindTooltip(`${point.name} (${point.yield} kt)`);

        // Add blast rings
        L.circle(point.position, {
          radius: fireballRadiusM,
          color: "#FF5500",
          fillColor: "#FF5500",
          fillOpacity: 0.7,
          weight: 1,
        })
          .bindTooltip("Fireball")
          .addTo(blastLayerGroup.current!);

        L.circle(point.position, {
          radius: severeRadiusM,
          color: "#FF0000",
          fillColor: "#FF0000",
          fillOpacity: 0.4,
          weight: 1,
        })
          .bindTooltip("Severe Damage (20 psi)")
          .addTo(blastLayerGroup.current!);

        L.circle(point.position, {
          radius: moderateRadiusM,
          color: "#FF9900",
          fillColor: "#FF9900",
          fillOpacity: 0.3,
          weight: 1,
        })
          .bindTooltip("Moderate Damage (5 psi)")
          .addTo(blastLayerGroup.current!);

        L.circle(point.position, {
          radius: lightRadiusM,
          color: "#FFCC00",
          fillColor: "#FFCC00",
          fillOpacity: 0.2,
          weight: 1,
        })
          .bindTooltip("Light Damage (1 psi)")
          .addTo(blastLayerGroup.current!);
      });
    }
  }, [mapLoaded, showBlastRings, detonationPoints]);

  // Draw fallout pattern
  useEffect(() => {
    if (!mapLoaded || !falloutLayerGroup.current) return;

    // Clear previous fallout patterns
    falloutLayerGroup.current.clearLayers();

    if (showFallout) {
      detonationPoints.forEach((point) => {
        // Simple fallout pattern based on wind direction and speed
        // This is a simplified visualization - real fallout would use more complex models
        const windRadians = (windDirection * Math.PI) / 180;
        const falloutLength = Math.pow(point.yield, 0.4) * windSpeed * 0.5; // km
        const falloutWidth = Math.pow(point.yield, 0.3) * 2; // km

        // Calculate fallout polygon points
        const centerLat = point.position[0];
        const centerLng = point.position[1];

        // Convert km to degrees (approximate)
        const latDegPerKm = 1 / 110.574;
        const lngDegPerKm =
          1 / (111.32 * Math.cos((centerLat * Math.PI) / 180));

        // Calculate fallout polygon points
        const dx = Math.sin(windRadians) * falloutLength * lngDegPerKm;
        const dy = Math.cos(windRadians) * falloutLength * latDegPerKm;

        const perpDx =
          Math.sin(windRadians + Math.PI / 2) * falloutWidth * lngDegPerKm;
        const perpDy =
          Math.cos(windRadians + Math.PI / 2) * falloutWidth * latDegPerKm;

        const falloutPoints = [
          [centerLat, centerLng],
          [centerLat + perpDy / 4, centerLng + perpDx / 4],
          [centerLat + dy + perpDy / 2, centerLng + dx + perpDx / 2],
          [centerLat + dy, centerLng + dx],
          [centerLat + dy - perpDy / 2, centerLng + dx - perpDx / 2],
          [centerLat - perpDy / 4, centerLng - perpDx / 4],
        ];

        // Create fallout polygon
        L.polygon(falloutPoints as L.LatLngExpression[], {
          color: "#4B0082",
          fillColor: "#4B0082",
          fillOpacity: 0.3,
          weight: 1,
        })
          .bindTooltip("Fallout Zone")
          .addTo(falloutLayerGroup.current!);

        // Add wind direction indicator
        const windMarkerPos: [number, number] = [
          centerLat + dy * 0.2,
          centerLng + dx * 0.2,
        ];

        const windIcon = L.divIcon({
          html: `<div class="flex items-center justify-center w-8 h-8 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="transform: rotate(${windDirection}deg)">
                    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/>
                    <path d="M9.6 4.6A2 2 0 1 1 11 8H2"/>
                    <path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>
                  </svg>
                </div>`,
          className: "",
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        L.marker(windMarkerPos, { icon: windIcon })
          .bindTooltip(`Wind: ${windDirection}° at ${windSpeed} km/h`)
          .addTo(falloutLayerGroup.current!);
      });
    }
  }, [mapLoaded, showFallout, detonationPoints, windDirection, windSpeed]);

  // Simulate population density heatmap
  useEffect(() => {
    if (!mapLoaded || !populationLayerGroup.current) return;

    // Clear previous population layers
    populationLayerGroup.current.clearLayers();

    if (showPopulationDensity) {
      // This is a placeholder for the actual population density data
      // In a real implementation, this would use GeoTIFF or other population data
      const mockPopulationData = [
        { lat: center[0] + 0.02, lng: center[1] + 0.03, value: 100 },
        { lat: center[0] - 0.01, lng: center[1] + 0.01, value: 80 },
        { lat: center[0] + 0.03, lng: center[1] - 0.02, value: 90 },
        { lat: center[0] - 0.02, lng: center[1] - 0.01, value: 70 },
        { lat: center[0], lng: center[1], value: 120 },
      ];

      // Create a heatmap layer
      // Note: In a real implementation, you would use a proper heatmap library
      mockPopulationData.forEach((point) => {
        const radius = point.value / 5; // Scale for visualization
        L.circle([point.lat, point.lng], {
          radius: radius * 100,
          color: "transparent",
          fillColor: "#00FF00",
          fillOpacity: 0.2,
          weight: 0,
        }).addTo(populationLayerGroup.current!);
      });

      // Add a legend for population density
      const legend = L.control({ position: "bottomright" });
      legend.onAdd = () => {
        const div = L.DomUtil.create("div", "bg-white p-2 rounded shadow");
        div.innerHTML = `
          <div class="text-sm font-bold mb-1">Population Density</div>
          <div class="flex items-center mb-1">
            <div class="w-4 h-4 bg-green-500 opacity-80 mr-2"></div>
            <span class="text-xs">High</span>
          </div>
          <div class="flex items-center mb-1">
            <div class="w-4 h-4 bg-green-500 opacity-40 mr-2"></div>
            <span class="text-xs">Medium</span>
          </div>
          <div class="flex items-center">
            <div class="w-4 h-4 bg-green-500 opacity-20 mr-2"></div>
            <span class="text-xs">Low</span>
          </div>
        `;
        return div;
      };
      legend.addTo(leafletMap.current!);

      // Store the legend in the layer group for cleanup
      // @ts-ignore - Adding custom property for cleanup
      populationLayerGroup.current._legend = legend;
    } else {
      // Remove legend if it exists
      // @ts-ignore - Accessing custom property
      if (populationLayerGroup.current._legend && leafletMap.current) {
        // @ts-ignore - Accessing custom property
        leafletMap.current.removeControl(populationLayerGroup.current._legend);
        // @ts-ignore - Cleaning up custom property
        delete populationLayerGroup.current._legend;
      }
    }
  }, [mapLoaded, showPopulationDensity, center]);

  return (
    <div className="relative w-full h-full bg-gray-100 rounded-lg overflow-hidden">
      {error && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white p-2 z-50 flex items-center justify-center">
          <AlertCircle className="mr-2" size={16} />
          {error}
        </div>
      )}

      <div ref={mapRef} className="w-full h-full" />

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className={`${showBlastRings ? "bg-red-100" : "bg-white"}`}
                onClick={() => {
                  /* Toggle blast rings would go here */
                }}
              >
                <MapPin
                  className={`${showBlastRings ? "text-red-500" : "text-gray-500"}`}
                  size={18}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Blast Rings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className={`${showFallout ? "bg-purple-100" : "bg-white"}`}
                onClick={() => {
                  /* Toggle fallout would go here */
                }}
              >
                <Wind
                  className={`${showFallout ? "text-purple-500" : "text-gray-500"}`}
                  size={18}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Fallout</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className={`${showPopulationDensity ? "bg-green-100" : "bg-white"}`}
                onClick={() => {
                  /* Toggle population density would go here */
                }}
              >
                <Layers
                  className={`${showPopulationDensity ? "text-green-500" : "text-gray-500"}`}
                  size={18}
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Toggle Population Density</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default MapContainer;
