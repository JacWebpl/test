import React from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Save, Download, RefreshCw, Share2 } from "lucide-react";

interface ActionButtonsProps {
  onSave?: () => void;
  onExport?: () => void;
  onReset?: () => void;
  onShare?: () => void;
  disabled?: boolean;
}

const ActionButtons = ({
  onSave = () => console.log("Save scenario"),
  onExport = () => console.log("Export results"),
  onReset = () => console.log("Reset simulation"),
  onShare = () => console.log("Share simulation"),
  disabled = false,
}: ActionButtonsProps) => {
  return (
    <div className="bg-card p-4 rounded-lg shadow-sm space-y-4 w-full">
      <h3 className="text-lg font-medium mb-3">Actions</h3>

      <div className="grid grid-cols-2 gap-3">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onSave}
                disabled={disabled}
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Save size={16} />
                Save
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Save current scenario</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onExport}
                disabled={disabled}
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Download size={16} />
                Export
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Export as image or PDF</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onReset}
                disabled={disabled}
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <RefreshCw size={16} />
                Reset
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reset simulation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={onShare}
                disabled={disabled}
                className="w-full flex items-center justify-center gap-2"
                variant="outline"
              >
                <Share2 size={16} />
                Share
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Share simulation</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default ActionButtons;
