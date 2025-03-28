import React, { useState } from "react";
import SimulatorLayout from "../components/layout/SimulatorLayout";

const NukeSimulator = () => {
  // State for tracking if the app is in offline mode
  const [offlineMode, setOfflineMode] = useState(true);

  return (
    <div className="bg-background min-h-screen">
      <SimulatorLayout />
    </div>
  );
};

export default NukeSimulator;
