import { Suspense } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import NukeSimulator from "./pages/NukeSimulator";
import routes from "tempo-routes";

function App() {
  // Check if we're running in Electron
  const isElectron = window.location.protocol === "file:";

  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="*" element={<NukeSimulator />} />
        </Routes>
        {!isElectron &&
          import.meta.env.VITE_TEMPO === "true" &&
          useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
