import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { Layers, Flame, Wind, Users } from "lucide-react";
import { Separator } from "../ui/separator";

interface DisplayOptionsProps {
  showBlastRings?: boolean;
  showFallout?: boolean;
  showPopulationDensity?: boolean;
  onToggleBlastRings?: (value: boolean) => void;
  onToggleFallout?: (value: boolean) => void;
  onTogglePopulationDensity?: (value: boolean) => void;
}

const DisplayOptions = ({
  showBlastRings = true,
  showFallout = true,
  showPopulationDensity = false,
  onToggleBlastRings = () => {},
  onToggleFallout = () => {},
  onTogglePopulationDensity = () => {},
}: DisplayOptionsProps) => {
  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Layers className="h-5 w-5" />
          Display Options
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Flame className="h-4 w-4 text-red-500" />
            <Label htmlFor="blast-rings" className="cursor-pointer">
              Blast Rings
            </Label>
          </div>
          <Switch
            id="blast-rings"
            checked={showBlastRings}
            onCheckedChange={onToggleBlastRings}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <Label htmlFor="fallout" className="cursor-pointer">
              Fallout Pattern
            </Label>
          </div>
          <Switch
            id="fallout"
            checked={showFallout}
            onCheckedChange={onToggleFallout}
          />
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-blue-500" />
            <Label htmlFor="population" className="cursor-pointer">
              Population Density
            </Label>
          </div>
          <Switch
            id="population"
            checked={showPopulationDensity}
            onCheckedChange={onTogglePopulationDensity}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default DisplayOptions;
