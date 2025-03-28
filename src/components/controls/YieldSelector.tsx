import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Atom, Zap } from "lucide-react";

interface YieldSelectorProps {
  onYieldChange?: (yieldValue: number) => void;
  onDeviceSelect?: (device: string) => void;
  defaultYield?: number;
  defaultDevice?: string;
}

const YieldSelector = ({
  onYieldChange = () => {},
  onDeviceSelect = () => {},
  defaultYield = 15,
  defaultDevice = "custom",
}: YieldSelectorProps) => {
  const [selectedDevice, setSelectedDevice] = useState<string>(defaultDevice);
  const [customYield, setCustomYield] = useState<number>(defaultYield);
  const [yieldUnit, setYieldUnit] = useState<"kt" | "mt">("kt");

  const historicalDevices = [
    { name: "Little Boy (Hiroshima)", yield: 15, unit: "kt" },
    { name: "Fat Man (Nagasaki)", yield: 21, unit: "kt" },
    { name: "B83 (US Modern)", yield: 1.2, unit: "mt" },
    { name: "Tsar Bomba", yield: 50, unit: "mt" },
    { name: "Custom", yield: customYield, unit: yieldUnit },
  ];

  const handleDeviceChange = (device: string) => {
    setSelectedDevice(device);
    onDeviceSelect(device);

    // Update yield based on selected device
    const selectedDeviceData = historicalDevices.find((d) => d.name === device);
    if (selectedDeviceData && device !== "Custom") {
      setCustomYield(selectedDeviceData.yield);
      setYieldUnit(selectedDeviceData.unit as "kt" | "mt");
      onYieldChange(
        selectedDeviceData.yield *
          (selectedDeviceData.unit === "mt" ? 1000 : 1),
      );
    }
  };

  const handleYieldChange = (value: number) => {
    setCustomYield(value);
    onYieldChange(value * (yieldUnit === "mt" ? 1000 : 1));
  };

  const handleUnitChange = (unit: "kt" | "mt") => {
    setYieldUnit(unit);
    onYieldChange(customYield * (unit === "mt" ? 1000 : 1));
  };

  const getYieldDisplay = () => {
    if (selectedDevice === "Custom") {
      return `${customYield} ${yieldUnit}`;
    } else {
      const device = historicalDevices.find((d) => d.name === selectedDevice);
      return device ? `${device.yield} ${device.unit}` : "";
    }
  };

  return (
    <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="flex items-center mb-4">
        <Atom className="mr-2 h-5 w-5 text-yellow-500" />
        <h3 className="text-lg font-medium">Nuclear Yield Selection</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="device-select">Select Device</Label>
          <Select value={selectedDevice} onValueChange={handleDeviceChange}>
            <SelectTrigger id="device-select" className="w-full">
              <SelectValue placeholder="Select a device" />
            </SelectTrigger>
            <SelectContent>
              {historicalDevices.map((device) => (
                <SelectItem key={device.name} value={device.name}>
                  {device.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedDevice === "Custom" && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="yield-input">Custom Yield</Label>
              <div className="flex items-center mt-1.5">
                <Input
                  id="yield-input"
                  type="number"
                  min={0.001}
                  max={100000}
                  step={0.1}
                  value={customYield}
                  onChange={(e) =>
                    handleYieldChange(parseFloat(e.target.value) || 0)
                  }
                  className="mr-2"
                />
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant={yieldUnit === "kt" ? "default" : "outline"}
                    onClick={() => handleUnitChange("kt")}
                  >
                    KT
                  </Button>
                  <Button
                    size="sm"
                    variant={yieldUnit === "mt" ? "default" : "outline"}
                    onClick={() => handleUnitChange("mt")}
                  >
                    MT
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label>Yield Slider</Label>
              <div className="pt-2">
                <Slider
                  min={0.001}
                  max={yieldUnit === "kt" ? 1000 : 100}
                  step={yieldUnit === "kt" ? 1 : 0.1}
                  value={[customYield]}
                  onValueChange={(values) => handleYieldChange(values[0])}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0.001 {yieldUnit}</span>
                <span>
                  {yieldUnit === "kt" ? "1000" : "100"} {yieldUnit}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center">
            <Zap className="h-4 w-4 mr-1 text-yellow-500" />
            <span className="text-sm font-medium">Current Yield:</span>
          </div>
          <div className="text-sm font-bold">{getYieldDisplay()}</div>
        </div>
      </div>
    </div>
  );
};

export default YieldSelector;
