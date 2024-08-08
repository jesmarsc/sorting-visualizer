import { useEffect, useRef } from "react";
import { Menu } from "./components/menu";

import { useSortState, SortStateProvider } from "./providers/state-provider";

export function CanvasApp() {
  return (
    <SortStateProvider>
      <Canvas />
      <Menu />
    </SortStateProvider>
  );
}

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const state = useSortState();

  useEffect(() => {
    if (canvasRef.current) {
      state.setCanvas(canvasRef.current);
      window.addEventListener("resize", state.draw);
    }
  });

  return <canvas ref={canvasRef} className="w-screen h-screen-sm" />;
};
