import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Save, Trash2, FileUp, FileDown, Plus, Edit } from "lucide-react";

interface ScenarioData {
  id: string;
  name: string;
  date: string;
  yield: number;
  location: {
    lat: number;
    lng: number;
    name?: string;
  };
  casualties: {
    fatalities: number;
    injuries: number;
  };
  windDirection: number;
  windSpeed: number;
}

interface ScenarioManagerProps {
  onLoadScenario?: (scenario: ScenarioData) => void;
  onSaveScenario?: (scenario: ScenarioData) => void;
  currentScenario?: Partial<ScenarioData>;
  isOpen?: boolean;
}

const ScenarioManager = ({
  onLoadScenario = () => {},
  onSaveScenario = () => {},
  currentScenario = {},
  isOpen = true,
}: ScenarioManagerProps) => {
  const [scenarios, setScenarios] = useState<ScenarioData[]>([
    {
      id: "1",
      name: "Hiroshima Simulation",
      date: "2023-05-15",
      yield: 15,
      location: {
        lat: 34.3853,
        lng: 132.4553,
        name: "Hiroshima, Japan",
      },
      casualties: {
        fatalities: 80000,
        injuries: 70000,
      },
      windDirection: 225,
      windSpeed: 10,
    },
    {
      id: "2",
      name: "NYC Simulation",
      date: "2023-06-22",
      yield: 150,
      location: {
        lat: 40.7128,
        lng: -74.006,
        name: "New York City, USA",
      },
      casualties: {
        fatalities: 1500000,
        injuries: 2000000,
      },
      windDirection: 270,
      windSpeed: 15,
    },
    {
      id: "3",
      name: "Tsar Bomba Test",
      date: "2023-07-10",
      yield: 50000,
      location: {
        lat: 55.7558,
        lng: 37.6173,
        name: "Moscow, Russia",
      },
      casualties: {
        fatalities: 5000000,
        injuries: 7500000,
      },
      windDirection: 180,
      windSpeed: 20,
    },
  ]);

  const [newScenarioName, setNewScenarioName] = useState("");
  const [isNewScenarioDialogOpen, setIsNewScenarioDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [importData, setImportData] = useState("");

  // Reset new scenario name when the main dialog opens
  useEffect(() => {
    if (isOpen) {
      setNewScenarioName("");
    }
  }, [isOpen]);

  const handleSaveCurrentScenario = () => {
    if (!newScenarioName) return;

    const newScenario: ScenarioData = {
      id: Date.now().toString(),
      name: newScenarioName,
      date: new Date().toISOString().split("T")[0],
      yield: currentScenario.yield || 15,
      location: currentScenario.location || { lat: 0, lng: 0 },
      casualties: currentScenario.casualties || { fatalities: 0, injuries: 0 },
      windDirection: currentScenario.windDirection || 0,
      windSpeed: currentScenario.windSpeed || 0,
    };

    setScenarios([...scenarios, newScenario]);
    onSaveScenario(newScenario);
    setNewScenarioName("");
    setIsNewScenarioDialogOpen(false);
  };

  const handleLoadScenario = (scenario: ScenarioData) => {
    onLoadScenario(scenario);
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter((scenario) => scenario.id !== id));
  };

  const handleExportScenarios = () => {
    const dataStr = JSON.stringify(scenarios, null, 2);
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;

    const exportFileDefaultName = "nukemap-scenarios.json";

    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", dataUri);
    linkElement.setAttribute("download", exportFileDefaultName);
    linkElement.click();
  };

  const handleImportScenarios = () => {
    try {
      const importedScenarios = JSON.parse(importData);
      if (Array.isArray(importedScenarios)) {
        setScenarios([...scenarios, ...importedScenarios]);
        setImportData("");
        setIsImportDialogOpen(false);
      }
    } catch (error) {
      console.error("Failed to import scenarios:", error);
      // In a real app, you would show an error message to the user
    }
  };

  return (
    <Dialog open={isOpen}>
      <DialogContent
        className="bg-background max-w-3xl max-h-[80vh] overflow-hidden flex flex-col"
        style={{ zIndex: 1000 }}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Scenario Manager
          </DialogTitle>
        </DialogHeader>

        <div className="flex justify-between mb-4">
          <div className="space-x-2">
            <Button onClick={() => setIsNewScenarioDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              New Scenario
            </Button>
            <Button variant="outline" onClick={handleExportScenarios}>
              <FileDown className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsImportDialogOpen(true)}
            >
              <FileUp className="mr-2 h-4 w-4" />
              Import
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-grow pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="bg-card">
                <CardHeader>
                  <CardTitle>{scenario.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {scenario.date}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="font-medium">Yield:</p>
                      <p>{scenario.yield} kt</p>
                    </div>
                    <div>
                      <p className="font-medium">Location:</p>
                      <p>
                        {scenario.location.name ||
                          `${scenario.location.lat.toFixed(4)}, ${scenario.location.lng.toFixed(4)}`}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Casualties:</p>
                      <p>
                        {scenario.casualties.fatalities.toLocaleString()}{" "}
                        fatalities
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">Wind:</p>
                      <p>
                        {scenario.windDirection}° at {scenario.windSpeed} km/h
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLoadScenario(scenario)}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Load
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteScenario(scenario.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>

      {/* New Scenario Dialog */}
      <Dialog
        open={isNewScenarioDialogOpen}
        onOpenChange={setIsNewScenarioDialogOpen}
      >
        <DialogContent className="sm:max-w-md" style={{ zIndex: 1100 }}>
          <DialogHeader>
            <DialogTitle>Save Current Scenario</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Scenario Name
              </label>
              <Input
                id="name"
                placeholder="Enter scenario name"
                value={newScenarioName}
                onChange={(e) => setNewScenarioName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsNewScenarioDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleSaveCurrentScenario}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent className="sm:max-w-md" style={{ zIndex: 1100 }}>
          <DialogHeader>
            <DialogTitle>Import Scenarios</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="import" className="text-sm font-medium">
                Paste JSON Data
              </label>
              <textarea
                id="import"
                className="w-full min-h-[200px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                placeholder="Paste JSON scenario data here"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsImportDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleImportScenarios}>Import</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
};

export default ScenarioManager;
