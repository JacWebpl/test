import React, { useState, useEffect } from "react";
import type { LatLng } from "leaflet";
import MapContainer from "../map/MapContainer";
import ControlPanel from "../controls/ControlPanel";
import ExportDialog from "../export/ExportDialog";
import ScenarioManager from "../scenarios/ScenarioManager";
import { Button } from "../ui/button";
import { Info, Settings, HelpCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface SimulatorLayoutProps {
  children?: React.ReactNode;
}

const SimulatorLayout = ({ children }: SimulatorLayoutProps) => {
  // State for controlling panel visibility
  const [controlPanelCollapsed, setControlPanelCollapsed] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showScenarioManager, setShowScenarioManager] = useState(false);

  // State for simulation parameters
  const [yield_, setYield] = useState(15); // in kilotons
  const [selectedDevice, setSelectedDevice] = useState(
    "Little Boy (Hiroshima)",
  );
  const [windDirection, setWindDirection] = useState(45); // degrees
  const [windSpeed, setWindSpeed] = useState(15); // km/h
  const [showBlastRings, setShowBlastRings] = useState(true);
  const [showFallout, setShowFallout] = useState(true);
  const [showPopulationDensity, setShowPopulationDensity] = useState(false);

  // Detonation points
  const [detonationPoints, setDetonationPoints] = useState([
    {
      id: "1",
      position: [40.7128, -74.006] as [number, number],
      yield: 15,
      name: "Little Boy (Hiroshima)",
    },
  ]);

  // Update detonation points when yield or device changes
  useEffect(() => {
    if (detonationPoints.length > 0) {
      const updatedPoints = detonationPoints.map((point) => ({
        ...point,
        yield: yield_,
        name: selectedDevice,
      }));
      setDetonationPoints(updatedPoints);
    }
  }, [yield_, selectedDevice]);

  // Handle map click to place detonation point
  const handleMapClick = (latlng: LatLng) => {
    const newPoint = {
      id: Date.now().toString(),
      position: [latlng.lat, latlng.lng] as [number, number],
      yield: yield_,
      name: selectedDevice,
    };

    setDetonationPoints([newPoint]); // Replace with new point (single point mode)
    // For multiple points: setDetonationPoints([...detonationPoints, newPoint]);
  };

  // Handle export
  const handleExport = (options: any) => {
    console.log("Exporting with options:", options);
    // In a real implementation, this would generate and download the export
  };

  // Handle scenario operations
  const handleSaveScenario = (scenario: any) => {
    console.log("Saving scenario:", scenario);
    setShowScenarioManager(false);
  };

  const handleLoadScenario = (scenario: any) => {
    console.log("Loading scenario:", scenario);
    // Update state with loaded scenario data
    if (scenario.yield) setYield(scenario.yield);
    if (scenario.location) {
      setDetonationPoints([
        {
          id: Date.now().toString(),
          position: [scenario.location.lat, scenario.location.lng] as [
            number,
            number,
          ],
          yield: scenario.yield,
          name: scenario.name || selectedDevice,
        },
      ]);
    }
    if (scenario.windDirection) setWindDirection(scenario.windDirection);
    if (scenario.windSpeed) setWindSpeed(scenario.windSpeed);

    setShowScenarioManager(false);
  };

  // Handle detonation
  const handleDetonate = () => {
    // Create a visual effect for detonation
    const newPoints = [...detonationPoints];
    // Update the detonation point to trigger re-render with animation
    setDetonationPoints(newPoints);

    // You could add additional effects here like:
    // - Flash the screen
    // - Play a sound
    // - Trigger animations
    console.log("Detonation triggered at", newPoints[0]?.position);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-background">
      {/* Header/Toolbar */}
      <header className="h-14 border-b flex items-center justify-between px-4 bg-background">
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-2" />
            <h1 className="text-xl font-bold">NUKEMAP OFFLINE</h1>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <HelpCircle className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Help & Documentation</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Info className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>About NUKEMAP OFFLINE</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Map Container */}
        <div
          className="flex-1 relative"
          style={{ zIndex: showScenarioManager ? 0 : 1 }}
        >
          <MapContainer
            detonationPoints={detonationPoints}
            windDirection={windDirection}
            windSpeed={windSpeed}
            showBlastRings={showBlastRings}
            showFallout={showFallout}
            showPopulationDensity={showPopulationDensity}
            onMapClick={handleMapClick}
          />
        </div>

        {/* Control Panel */}
        <ControlPanel
          collapsed={controlPanelCollapsed}
          onToggleCollapse={() =>
            setControlPanelCollapsed(!controlPanelCollapsed)
          }
          onYieldChange={setYield}
          onDeviceSelect={setSelectedDevice}
          onWindDirectionChange={setWindDirection}
          onWindSpeedChange={setWindSpeed}
          onToggleBlastRings={setShowBlastRings}
          onToggleFallout={setShowFallout}
          onTogglePopulationDensity={setShowPopulationDensity}
          onSave={() => setShowScenarioManager(true)}
          onExport={() => setShowExportDialog(true)}
          onReset={() => {
            setYield(15);
            setSelectedDevice("Little Boy (Hiroshima)");
            setWindDirection(45);
            setWindSpeed(15);
            setDetonationPoints([
              {
                id: "1",
                position: [40.7128, -74.006] as [number, number],
                yield: 15,
                name: "Little Boy (Hiroshima)",
              },
            ]);
          }}
          onShare={() => setShowScenarioManager(true)}
          onDetonate={handleDetonate}
        />
      </div>

      {/* Dialogs */}
      <ExportDialog
        open={showExportDialog}
        onOpenChange={setShowExportDialog}
        onExport={handleExport}
      />

      <ScenarioManager
        isOpen={showScenarioManager}
        onSaveScenario={handleSaveScenario}
        onLoadScenario={handleLoadScenario}
        currentScenario={{
          yield: yield_,
          location: detonationPoints[0]?.position
            ? {
                lat: detonationPoints[0].position[0],
                lng: detonationPoints[0].position[1],
              }
            : undefined,
          windDirection,
          windSpeed,
        }}
      />
    </div>
  );
};

export default SimulatorLayout;

// Import AlertCircle icon for the logo
import { AlertCircle } from "lucide-react";
