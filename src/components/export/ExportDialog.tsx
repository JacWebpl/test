import React, { useState } from "react";
import { Download, FileImage, FileText, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";

interface ExportDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onExport?: (options: ExportOptions) => void;
}

interface ExportOptions {
  format: "png" | "jpg" | "pdf";
  quality: "low" | "medium" | "high";
  width: number;
  height: number;
  includeTitle: boolean;
  includeLegend: boolean;
  includeStatistics: boolean;
  customNotes: string;
}

const ExportDialog = ({
  open = true,
  onOpenChange,
  onExport = () => {},
}: ExportDialogProps) => {
  const [exportOptions, setExportOptions] = useState<ExportOptions>({
    format: "png",
    quality: "high",
    width: 1920,
    height: 1080,
    includeTitle: true,
    includeLegend: true,
    includeStatistics: true,
    customNotes: "",
  });

  const handleOptionChange = (key: keyof ExportOptions, value: any) => {
    setExportOptions((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleExport = () => {
    onExport(exportOptions);
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-white sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Simulation
          </DialogTitle>
          <DialogDescription>
            Export your nuclear simulation as an image or PDF document.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="format" className="text-sm font-medium">
                Format
              </label>
              <Select
                value={exportOptions.format}
                onValueChange={(value) => handleOptionChange("format", value)}
              >
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="png">
                    <div className="flex items-center gap-2">
                      <FileImage className="h-4 w-4" />
                      PNG Image
                    </div>
                  </SelectItem>
                  <SelectItem value="jpg">
                    <div className="flex items-center gap-2">
                      <FileImage className="h-4 w-4" />
                      JPG Image
                    </div>
                  </SelectItem>
                  <SelectItem value="pdf">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      PDF Document
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="quality" className="text-sm font-medium">
                Quality
              </label>
              <Select
                value={exportOptions.quality}
                onValueChange={(value) => handleOptionChange("quality", value)}
              >
                <SelectTrigger id="quality">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low (Faster)</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High (Detailed)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="width" className="text-sm font-medium">
                Width (px)
              </label>
              <Input
                id="width"
                type="number"
                value={exportOptions.width}
                onChange={(e) =>
                  handleOptionChange("width", parseInt(e.target.value) || 1920)
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="height" className="text-sm font-medium">
                Height (px)
              </label>
              <Input
                id="height"
                type="number"
                value={exportOptions.height}
                onChange={(e) =>
                  handleOptionChange("height", parseInt(e.target.value) || 1080)
                }
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="text-sm font-medium">Include in Export</div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-title"
                  checked={exportOptions.includeTitle}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeTitle", !!checked)
                  }
                />
                <label
                  htmlFor="include-title"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Simulation Title
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-legend"
                  checked={exportOptions.includeLegend}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeLegend", !!checked)
                  }
                />
                <label
                  htmlFor="include-legend"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Map Legend
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-statistics"
                  checked={exportOptions.includeStatistics}
                  onCheckedChange={(checked) =>
                    handleOptionChange("includeStatistics", !!checked)
                  }
                />
                <label
                  htmlFor="include-statistics"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Casualty Statistics
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Custom Notes (optional)
            </label>
            <Input
              id="notes"
              placeholder="Add notes to be included in the export..."
              value={exportOptions.customNotes}
              onChange={(e) =>
                handleOptionChange("customNotes", e.target.value)
              }
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleExport} className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
