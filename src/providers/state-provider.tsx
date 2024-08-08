import { useRef } from "react";

import { createContext } from "@/utils/create-context";

import { CanvasState } from "@/lib/state/canvas-state";

export const [useSortState, _SortStateProvider] = createContext<CanvasState>();

export const SortStateProvider = (props: { children: React.ReactNode }) => {
  const state = useRef(new CanvasState()).current;
  return <_SortStateProvider {...props} value={state} />;
};
