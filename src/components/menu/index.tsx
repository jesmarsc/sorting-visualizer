import { useSnapshot } from "valtio";
import { SortAlgorithm } from "@/types";
import clsx from "clsx";

import { useSortState } from "@/providers/state-provider";

import playImg from "@/assets/icons/play.svg";
import pauseImg from "@/assets/icons/pause.svg";
import refreshImg from "@/assets/icons/refresh.svg";
import skip from "@/assets/icons/play-skip-forward.svg";

export const Menu = () => {
  const state = useSortState();
  const sortState = useSnapshot(state.config);

  return (
    <div className="bg-black/75 p-4 absolute top-0 left-0 z-10 w-full max-w-sm space-y-4">
      <div className="flex gap-8">
        <select
          value={sortState.algorithm}
          onChange={(event) => {
            state.setAlgorithm(event.target.value as SortAlgorithm);
          }}
          className="text-black px-2 py-1 rounded cursor-pointer"
        >
          <option value="mergeSort">Merge Sort</option>
          <option value="quickSort">Quick Sort</option>
          <option value="heapSort">Heap Sort</option>
          <option value="selectionSort">Selection Sort</option>
          <option value="bubbleSort">Bubble Sort</option>
        </select>

        <div className="flex-1 flex *:flex-1 gap-0.5 rounded-l rounded-r overflow-hidden [&_img]:min-w-none [&_img]:size-4">
          <Button
            onClick={() => state.reset()}
            disabled={sortState.status === "sorting"}
          >
            <img src={refreshImg} />
          </Button>

          {sortState.status === "sorting" ? (
            <Button onClick={() => state.pause()}>
              <img src={pauseImg} />
            </Button>
          ) : (
            <Button onClick={() => state.animate()}>
              <img src={playImg} />
            </Button>
          )}

          <Button onClick={() => state.step()}>
            <img src={skip} />
          </Button>
        </div>
      </div>

      <div>
        <label htmlFor="interval">Interval: {sortState.interval}ms</label>

        <input
          id="interval"
          className="block w-full cursor-pointer"
          type="range"
          min="0"
          max="100"
          step="10"
          onChange={(event) =>
            state.setInterval(parseInt(event.target.value, 10))
          }
          value={sortState.interval}
        />
      </div>

      <div>
        <label htmlFor="item-amount">Item Amount: {sortState.itemAmount}</label>

        <input
          id="item-amount"
          className="block w-full cursor-pointer"
          type="range"
          min="10"
          max="1000"
          step="10"
          onChange={(event) =>
            state.setItemAmount(parseInt(event.target.value, 10))
          }
          value={sortState.itemAmount}
        />
      </div>
    </div>
  );
};

const Button = (props: React.ComponentPropsWithoutRef<"button">) => {
  return (
    <button
      {...props}
      className={clsx(
        props.className,
        "flex items-center justify-center bg-white text-black disabled:bg-neutral-500 disabled:cursor-not-allowed active:bg-neutral-200 transition-colors"
      )}
    />
  );
};
