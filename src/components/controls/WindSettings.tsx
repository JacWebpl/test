import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import { Wind, ArrowUp } from "lucide-react";
import { cn } from "../../lib/utils";

interface WindSettingsProps {
  windDirection?: number;
  windSpeed?: number;
  onWindDirectionChange?: (direction: number) => void;
  onWindSpeedChange?: (speed: number) => void;
}

const WindSettings = ({
  windDirection = 0,
  windSpeed = 15,
  onWindDirectionChange = () => {},
  onWindSpeedChange = () => {},
}: WindSettingsProps) => {
  const [localWindDirection, setLocalWindDirection] = useState(windDirection);
  const [localWindSpeed, setLocalWindSpeed] = useState(windSpeed);

  const handleDirectionChange = (value: number[]) => {
    const direction = value[0];
    setLocalWindDirection(direction);
    onWindDirectionChange(direction);
  };

  const handleSpeedChange = (value: number[]) => {
    const speed = value[0];
    setLocalWindSpeed(speed);
    onWindSpeedChange(speed);
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Wind className="h-5 w-5" />
          Wind Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="wind-direction">
                Wind Direction: {localWindDirection}°
              </Label>
              <div className="relative h-10 w-10 rounded-full border border-gray-300 flex items-center justify-center">
                <ArrowUp
                  className="h-6 w-6 absolute transform transition-transform duration-200"
                  style={{ transform: `rotate(${localWindDirection}deg)` }}
                />
              </div>
            </div>
            <Slider
              id="wind-direction"
              min={0}
              max={359}
              step={1}
              value={[localWindDirection]}
              onValueChange={handleDirectionChange}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="wind-speed">
                Wind Speed: {localWindSpeed} km/h
              </Label>
              <div
                className={cn(
                  "px-2 py-1 rounded text-xs",
                  localWindSpeed < 15
                    ? "bg-green-100 text-green-800"
                    : localWindSpeed < 30
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800",
                )}
              >
                {localWindSpeed < 15
                  ? "Light"
                  : localWindSpeed < 30
                    ? "Moderate"
                    : "Strong"}
              </div>
            </div>
            <Slider
              id="wind-speed"
              min={0}
              max={50}
              step={1}
              value={[localWindSpeed]}
              onValueChange={handleSpeedChange}
              className="w-full"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WindSettings;
