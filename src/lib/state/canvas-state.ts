import { State } from "./index";

export class CanvasState extends State {
  canvas?: HTMLCanvasElement;

  constructor() {
    super();
  }

  setCanvas(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.draw();
  }

  reset() {
    super.reset();
    this.draw();
  }

  _step() {
    super._step();
    this.draw();
  }

  draw = () => {
    const { bars, canvas } = this;

    if (!canvas) throw "Canvas not found!";

    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Could not get 2d context!");

    const dpr = window.devicePixelRatio || 1;

    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    ctx.scale(dpr, dpr);

    // Graph parameters
    const barWidth = window.innerWidth / bars.length;

    // Clear the canvas
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    bars.forEach(({ height, status }, index) => {
      const x = index * barWidth;
      const y = window.innerHeight;
      const barHeight = (height / 100) * window.innerHeight;

      const color = {
        compared: "green",
        swapped: "blue",
        sorted: "red",
        default: "white",
      }[status];

      ctx.fillStyle = color;
      ctx.fillRect(x, y - barHeight, barWidth - barWidth * 0.025, barHeight);
    });
  };
}
