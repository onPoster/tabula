import p5Types from "p5"

export class Piece {
  constructor(
    public width: number,
    public height: number,
    public theta: number,
    public radius: number,
    public rotation: number,
    public fill: any[],
    public strokeWeight: number,
    public strokeColor: any[],
    public bool_seeds: boolean[],
    public p5: p5Types,
    public innerRadius?: number,
  ) {}

  render() {
    let x1, x2, y1, y2
    const { p5, width, height, theta, radius, rotation, fill, strokeColor, bool_seeds, innerRadius } = this
    p5.stroke(strokeColor)
    p5.push()
    p5.translate(width / 2, height / 2)
    p5.rotate(rotation)
    if (innerRadius) {
      const t = theta
      x1 = innerRadius * p5.cos(t - theta / 2 + 45 / 2)
      y1 = innerRadius * p5.sin(t - theta / 2 + 45 / 2)
      x2 = radius * p5.cos(t + 45 / 2)
      y2 = radius * p5.sin(t + 45 / 2)
      let x3 = innerRadius * p5.cos(t + theta / 2 + 45 / 2)
      let y3 = innerRadius * p5.sin(t + theta / 2 + 45 / 2)
      p5.fill(fill)
      p5.beginShape()
      p5.vertex(x1, y1)
      p5.vertex(x2, y2)
      p5.vertex(x3, y3)
      p5.endShape(p5.CLOSE)
    } else {
      x1 = radius
      y1 = 0
      x2 = radius * p5.cos(theta)
      y2 = radius * p5.sin(theta)
      const starPointOffsetRatio = bool_seeds[0] ? 0 : 0.1
      p5.fill(fill)
      p5.beginShape()
      p5.vertex(x1, y1)
      p5.vertex(0, 0)
      p5.vertex(x2, y2)
      p5.endShape(p5.CLOSE)
      p5.line(x1, y1, x2, y2)
      p5.line(x1 - x1 * starPointOffsetRatio, y1 - y1 * starPointOffsetRatio, x2 - x2 * 0.65, y2 - y2 * 0.65)
      p5.line(x2 - x2 * starPointOffsetRatio, y2 - y2 * starPointOffsetRatio, x1 - x1 * 0.65, y1 - y1 * 0.65)
    }
    p5.pop()
  }
}
