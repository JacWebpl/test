import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import YieldSelector from "./YieldSelector";
import WindSettings from "./WindSettings";
import CasualtyEstimation from "../results/CasualtyEstimation";
import DisplayOptions from "./DisplayOptions";
import ActionButtons from "./ActionButtons";
import { Sliders, ChevronLeft, ChevronRight } from "lucide-react";

interface ControlPanelProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onYieldChange?: (yieldValue: number) => void;
  onDeviceSelect?: (device: string) => void;
  onWindDirectionChange?: (direction: number) => void;
  onWindSpeedChange?: (speed: number) => void;
  onToggleBlastRings?: (value: boolean) => void;
  onToggleFallout?: (value: boolean) => void;
  onTogglePopulationDensity?: (value: boolean) => void;
  onSave?: () => void;
  onExport?: () => void;
  onReset?: () => void;
  onShare?: () => void;
}

const ControlPanel = ({
  collapsed = false,
  onToggleCollapse = () => {},
  onYieldChange = () => {},
  onDeviceSelect = () => {},
  onWindDirectionChange = () => {},
  onWindSpeedChange = () => {},
  onToggleBlastRings = () => {},
  onToggleFallout = () => {},
  onTogglePopulationDensity = () => {},
  onSave = () => {},
  onExport = () => {},
  onReset = () => {},
  onShare = () => {},
}: ControlPanelProps) => {
  const [showBlastRings, setShowBlastRings] = useState(true);
  const [showFallout, setShowFallout] = useState(true);
  const [showPopulationDensity, setShowPopulationDensity] = useState(false);

  const handleToggleBlastRings = (value: boolean) => {
    setShowBlastRings(value);
    onToggleBlastRings(value);
  };

  const handleToggleFallout = (value: boolean) => {
    setShowFallout(value);
    onToggleFallout(value);
  };

  const handleTogglePopulationDensity = (value: boolean) => {
    setShowPopulationDensity(value);
    onTogglePopulationDensity(value);
  };

  if (collapsed) {
    return (
      <div className="h-full bg-background border-l flex flex-col items-center py-4 px-2">
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          aria-label="Expand control panel"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
        <div className="mt-4 rotate-90 text-sm font-medium text-muted-foreground whitespace-nowrap">
          Control Panel
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-[350px] bg-background border-l flex flex-col">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Sliders className="h-5 w-5 mr-2" />
          <h2 className="text-lg font-semibold">Control Panel</h2>
        </div>
        <button
          onClick={onToggleCollapse}
          className="p-1 rounded-full hover:bg-muted transition-colors"
          aria-label="Collapse control panel"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-6">
          <YieldSelector
            onYieldChange={onYieldChange}
            onDeviceSelect={onDeviceSelect}
          />

          <Separator />

          <WindSettings
            onWindDirectionChange={onWindDirectionChange}
            onWindSpeedChange={onWindSpeedChange}
          />

          <Separator />

          <CasualtyEstimation />

          <Separator />

          <DisplayOptions
            showBlastRings={showBlastRings}
            showFallout={showFallout}
            showPopulationDensity={showPopulationDensity}
            onToggleBlastRings={handleToggleBlastRings}
            onToggleFallout={handleToggleFallout}
            onTogglePopulationDensity={handleTogglePopulationDensity}
          />

          <Separator />

          <ActionButtons
            onSave={onSave}
            onExport={onExport}
            onReset={onReset}
            onShare={onShare}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default ControlPanel;
