import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Skull, Users, AlertTriangle, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CasualtyCategory {
  label: string;
  count: number;
  percentage: number;
  icon: React.ReactNode;
  color: string;
}

interface CasualtyEstimationProps {
  totalPopulation?: number;
  fatalities?: number;
  injuries?: number;
  affectedArea?: number; // in square kilometers
  blastYield?: number; // in kilotons
}

const CasualtyEstimation = ({
  totalPopulation = 1250000,
  fatalities = 325000,
  injuries = 475000,
  affectedArea = 78.5, // Default: ~5km radius affected area
  blastYield = 150, // Default: 150 kilotons
}: CasualtyEstimationProps) => {
  // Calculate percentages
  const fatalitiesPercentage = Math.round((fatalities / totalPopulation) * 100);
  const injuriesPercentage = Math.round((injuries / totalPopulation) * 100);
  const unaffectedCount = totalPopulation - fatalities - injuries;
  const unaffectedPercentage = Math.round(
    (unaffectedCount / totalPopulation) * 100,
  );

  const casualtyCategories: CasualtyCategory[] = [
    {
      label: "Fatalities",
      count: fatalities,
      percentage: fatalitiesPercentage,
      icon: <Skull className="h-5 w-5" />,
      color: "bg-red-600",
    },
    {
      label: "Injuries",
      count: injuries,
      percentage: injuriesPercentage,
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "bg-amber-500",
    },
    {
      label: "Unaffected",
      count: unaffectedCount,
      percentage: unaffectedPercentage,
      icon: <Users className="h-5 w-5" />,
      color: "bg-green-600",
    },
  ];

  return (
    <Card className="w-full bg-white p-4 shadow-md">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold">Casualty Estimation</h3>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button className="text-gray-500 hover:text-gray-700">
                <Info className="h-5 w-5" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="left">
              <p className="max-w-xs">
                Estimated casualties based on population density data and blast
                parameters. These are approximate figures.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-sm text-gray-500">
          <span>Total Population in Affected Area:</span>
          <span className="font-medium text-gray-700">
            {totalPopulation.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <span>Affected Area:</span>
          <span className="font-medium text-gray-700">
            {affectedArea.toFixed(1)} km²
          </span>
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <span>Blast Yield:</span>
          <span className="font-medium text-gray-700">{blastYield} kt</span>
        </div>

        <Separator className="my-2" />

        {casualtyCategories.map((category, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`p-1 rounded-full ${category.color} text-white`}
                >
                  {category.icon}
                </div>
                <span className="text-sm font-medium">{category.label}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold">
                  {category.count.toLocaleString()}
                </span>
                <span className="text-xs text-gray-500 ml-1">
                  ({category.percentage}%)
                </span>
              </div>
            </div>
            <Progress value={category.percentage} className="h-2" />
          </div>
        ))}

        <div className="mt-4 bg-gray-100 p-3 rounded-md text-xs text-gray-600">
          <p className="italic">
            Note: These estimates are based on offline population density data
            and simplified blast models. Actual casualties would depend on many
            additional factors including time of day, building types, and
            emergency response.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CasualtyEstimation;
