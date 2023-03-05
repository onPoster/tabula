import React from "react"
import Sketch from "react-p5"
import p5Types from "p5"
import Random, { genTokenData } from "./utils"
import { Box } from "@mui/material"
interface DeterministicAvatarProps {
  hash?: string
  width?: number
  height?: number
  onImageGenerated?: (image: string) => void
}

const DeterministicAvatar: React.FC<DeterministicAvatarProps> = ({
  hash,
  width = 160,
  height = 160,
  onImageGenerated,
}) => {
  let x: number = 10
  let y: number = 10
  let markingsLayers: number = 0
  let noiseOpacity: number = 1
  let noiseImg: any
  let layers: any[] = []
  let palette: any[] = []
  const divisions = 20
  let tokenData
  if (hash) {
    const publicationHash = hash?.replace("P-", "").replace(/(\d)-(\d*)/, "$1")
    const publicationtokenId = hash?.match(/(\d)-(\d*)/)
    tokenData = { hash: publicationHash, tokenId: publicationtokenId && publicationtokenId[2] }
  } else {
    tokenData = genTokenData(123)
  }
  const R: any = new Random(tokenData)

  for (let i = 0; i < divisions; i++) {
    palette.push([0, 0, 100]) // white
    const newFill = [R.random_num(0, 140), R.random_num(30, 65), R.random_num(70, 90)]
    palette.push(newFill) // color
  }

  const accentHue = R.random_num(0, 360)
  const bgColor = [accentHue, R.random_num(10, 30), R.random_num(90, 100)]
  const strokeColor = [accentHue, R.random_num(20, 40), R.random_num(30, 40)]
  const outerStrokeColor = [accentHue, R.random_num(50, 80), R.random_num(50, 60)]

  const strokeWeight = 0.012 * width

  function Layer(this: any, size: number, pieces: number, showCircles: boolean, theta: number, fill: any) {
    this.size = size
    this.pieces = pieces
    this.showCircles = showCircles
    this.theta = theta
    this.fill = fill
  }

  function Piece(
    this: any,
    theta: number,
    radius: number,
    rotation: number,
    fill: any,
    strokeWeight: number,
    strokeColor: any,
    bool_seeds: number[],
    p5: p5Types,
    innerRadius?: number,
    outerRadius?: number,
  ) {
    this.theta = theta
    this.initialRadius = radius
    this.radius = radius
    this.innerRadius = innerRadius
    this.outerRadius = radius
    this.rotation = rotation
    this.initialRotation = rotation
    this.fill = fill
    this.strokeWeight = strokeWeight
    this.strokeColor = strokeColor
    this.bool_seeds = bool_seeds

    this.render = function () {
      p5.stroke(this.strokeColor)
      p5.push()
      p5.translate(width / 2, height / 2)
      let x1, x2, y1, y2
      p5.rotate(this.rotation)
      if (innerRadius) {
        const t = this.theta
        x1 = this.innerRadius * p5.cos(t - this.theta / 2 + 45 / 2)
        y1 = this.innerRadius * p5.sin(t - this.theta / 2 + 45 / 2)
        x2 = this.outerRadius * p5.cos(t + 45 / 2)
        y2 = this.outerRadius * p5.sin(t + 45 / 2)
        let x3 = this.innerRadius * p5.cos(t + this.theta / 2 + 45 / 2)
        let y3 = this.innerRadius * p5.sin(t + this.theta / 2 + 45 / 2)
        p5.fill(this.fill)
        p5.beginShape()
        p5.vertex(x1, y1)
        p5.vertex(x2, y2)
        p5.vertex(x3, y3)
        p5.endShape(p5.CLOSE)
      } else {
        x1 = this.radius
        y1 = 0
        x2 = this.radius * p5.cos(this.theta)
        y2 = this.radius * p5.sin(this.theta)

        const starPointOffsetRatio = this.bool_seeds[0] ? 0 : 0.1
        p5.fill(this.fill)
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

  const setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.noLoop()
    p5.createCanvas(width, height).parent(canvasParentRef)
    p5.colorMode(p5.HSB, 360, 100, 100, 1)
    p5.pixelDensity(2)
    p5.angleMode(p5.DEGREES)
    p5.imageMode(p5.CENTER)
    p5.ellipseMode(p5.CENTER)
    markingsLayers = p5.round(R.random_num(4, 7))
    p5.strokeJoin(p5.ROUND)
    p5.strokeWeight(strokeWeight)
    initializeMarkings(p5)
    initializeNoiseLayer(p5)
  }

  const draw = (p5: p5Types) => {
    p5.background(bgColor)
    renderMarkings(p5)
    renderNoise(p5)
    addBorder(p5)
    //@ts-ignore
    const canvas = p5.canvas.toDataURL("image/png")
    if (onImageGenerated) {
      onImageGenerated(canvas)
    }
  }

  const initializeMarkings = (p5: p5Types) => {
    const layerWithCircles = R.shuffleArray(Array.from(Array(markingsLayers).keys())).slice(0, 2)
    p5.stroke(43, 2, 20)
    for (let i = 0; i < markingsLayers; i++) {
      const pieces = []
      const fillValue = palette[i]
      const bool_seeds = [R.random_bool(0.5), R.random_bool(0.93)]
      const radius = p5.map(i, 0, markingsLayers, width * 0.43, height * 0.05)
      const isRay = R.random_bool(0.65)
      const piecesNum = R.random_choice([!isRay ? 4 : 0, 8, 16])
      const rotOffset = isRay && piecesNum === 4 ? 22.5 : 0
      const innerRadius = isRay ? radius * R.random_num(0.5, 0.8) : null
      const theta = 360 / piecesNum
      for (let p = 0; p < piecesNum; p++) {
        pieces.push(
          new (Piece as any)(
            theta, // theta,
            radius, // radius,
            theta * p + rotOffset, // rotation,
            fillValue, // fill
            strokeWeight, // strokeWeight
            strokeColor, // strokeColor
            bool_seeds, // bool_seeds
            p5, // p5
            innerRadius, // innerRadius
          ),
        )
      }
      layers.push(
        new (Layer as any)(
          p5.map(i, 0, markingsLayers, width * 0.43, height * 0.05), // size
          pieces, // pieces
          layerWithCircles.some((layer: number) => layer === i), // showCircles
          theta, // theta
          fillValue, // fill
        ),
      )
    }
  }

  const initializeNoiseLayer = (p5: p5Types) => {
    noiseOpacity = R.random_num(0.1, 0.3)
    noiseImg = p5.createGraphics(width, height)

    for (x = 0; x <= width; x++) {
      for (y = 0; y <= height; y++) {
        noiseImg.noStroke()
        noiseImg.fill(p5.map(R.random_dec(), 0, 1, 0, 255))
        noiseImg.circle(x, y, 1)
      }
    }
  }

  const renderMarkings = (p5: p5Types) => {
    layers.forEach((layer: any) => {
      layer.pieces.forEach((piece: any) => {
        piece.render()
      })
      if (layer.showCircles) {
        const circleSize = R.random_num(0.2, 0.4)
        layer.pieces.forEach((piece: any) => {
          p5.push()
          p5.translate(width / 2, height / 2)
          const rotOffset = 22.5
          p5.rotate(piece.rotation + rotOffset)
          const cx = layer.size * p5.cos(layer.theta + 45 / 2)
          const cy = layer.size * p5.sin(layer.theta + 45 / 2)
          const d = 2 * p5.abs(p5.sin(layer.theta / 2)) * layer.size
          p5.strokeWeight(strokeWeight)
          p5.stroke(strokeColor)
          p5.fill(layer.fill)
          p5.circle(cx, cy, d * circleSize)
          p5.pop()
        })
      }
    })
  }

  const renderNoise = (p5: p5Types) => {
    if (noiseImg) {
      p5.translate(p5.width / 2, p5.height / 2)
      p5.blendMode(p5.HARD_LIGHT)
      p5.tint(255, noiseOpacity)
      p5.image(noiseImg, 0, 0, p5.width, p5.height)
      p5.blendMode(p5.BLEND)
    }
  }

  const addBorder = (p5: p5Types) => {
    p5.noFill()
    p5.stroke(outerStrokeColor)
    p5.strokeWeight(strokeWeight * 2) // half of the border gets cropped.
    p5.ellipse(0, 0, width - strokeWeight, height - strokeWeight)
  }

  return (
    <Box sx={{ borderRadius: 999, overflow: "hidden", width: width, height: height }}>
      <Sketch setup={setup} draw={draw} />
    </Box>
  )
}

export default DeterministicAvatar
