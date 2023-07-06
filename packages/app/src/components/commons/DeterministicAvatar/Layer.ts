import { Piece } from "./Piece"

export class Layer {
  constructor(
    public size: number,
    public pieces: Piece[],
    public showCircles: boolean,
    public theta: number,
    public fill: any[],
  ) {}
}
