import React, { useCallback, useMemo, useRef } from "react"
import Sketch from "react-p5"
import p5Types from "p5"
import Random, { genTokenData } from "./utils"
import { Box } from "@mui/material"
import { Piece } from "./Piece"
import { Layer } from "./Layer"
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
  const xRef = useRef<number>(10)
  const yRef = useRef<number>(10)
  const noiseOpacityRef = useRef<number>(1)
  const noiseImgRef = useRef<any>(null)
  const markingsLayersRef = useRef<number>(0)
  const layersRef = useRef<any[]>([])
  const divisions = 20
  const tokenData = useMemo(() => {
    if (hash) {
      const publicationHash = hash.replace("P-", "").replace(/(\d)-(\d*)/, "$1")
      const publicationtokenId = hash.match(/(\d)-(\d*)/)
      return { hash: publicationHash, tokenId: publicationtokenId && publicationtokenId[2] }
    } else {
      return genTokenData(123)
    }
  }, [hash])
  const R = useMemo(() => new Random(tokenData), [tokenData])
  const palette = useMemo(() => {
    let palette: any[] = []
    for (let i = 0; i < divisions; i++) {
      palette.push([0, 0, 100]) // white
      const newFill = [R.random_num(0, 140), R.random_num(30, 65), R.random_num(70, 90)]
      palette.push(newFill) // color
    }
    return palette
  }, [R])
  const accentHue = R.random_num(0, 360)
  const bgColor = useMemo(() => [accentHue, R.random_num(10, 30), R.random_num(90, 100)], [accentHue, R])
  const strokeColor = useMemo(() => [accentHue, R.random_num(20, 40), R.random_num(30, 40)], [accentHue, R])
  const outerStrokeColor = useMemo(() => [accentHue, R.random_num(50, 80), R.random_num(50, 60)], [accentHue, R])
  const strokeWeight = 0.012 * width

  const initializeMarkings = useCallback(
    (p5: p5Types) => {
      const layerWithCircles = R.shuffleArray(Array.from(Array(markingsLayersRef.current).keys())).slice(0, 2)
      p5.stroke(43, 2, 20)
      for (let i = 0; i < markingsLayersRef.current; i++) {
        const pieces = []
        const fillValue = palette[i]
        const bool_seeds = [R.random_bool(0.5), R.random_bool(0.93)]
        const radius = p5.map(i, 0, markingsLayersRef.current, width * 0.43, height * 0.05)
        const isRay = R.random_bool(0.65)
        const piecesNum = R.random_choice([!isRay ? 4 : 0, 8, 16])
        const rotOffset = isRay && piecesNum === 4 ? 22.5 : 0
        const innerRadius = isRay ? radius * R.random_num(0.5, 0.8) : undefined
        const theta = 360 / piecesNum
        for (let p = 0; p < piecesNum; p++) {
          pieces.push(
            new Piece(
              width,
              height,
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
        layersRef.current.push(
          new Layer(
            p5.map(i, 0, markingsLayersRef.current, width * 0.43, height * 0.05), // size
            pieces, // pieces
            layerWithCircles.some((layer: number) => layer === i), // showCircles
            theta, // theta
            fillValue, // fill
          ),
        )
      }
    },
    [R, height, palette, strokeColor, strokeWeight, width],
  )

  const initializeNoiseLayer = useCallback(
    (p5: p5Types) => {
      noiseOpacityRef.current = R.random_num(0.1, 0.3)
      noiseImgRef.current = p5.createGraphics(width, height)

      for (xRef.current = 0; xRef.current <= width; xRef.current++) {
        for (yRef.current = 0; yRef.current <= height; yRef.current++) {
          noiseImgRef.current.noStroke()
          noiseImgRef.current.fill(p5.map(R.random_dec(), 0, 1, 0, 255))
          noiseImgRef.current.circle(xRef.current, yRef.current, 1)
        }
      }
    },
    [R, height, width],
  )

  const setup = useCallback(
    (p5: p5Types, canvasParentRef: Element) => {
      p5.noLoop()
      p5.createCanvas(width, height).parent(canvasParentRef)
      p5.colorMode(p5.HSB, 360, 100, 100, 1)
      p5.pixelDensity(2)
      p5.angleMode(p5.DEGREES)
      p5.imageMode(p5.CENTER)
      p5.ellipseMode(p5.CENTER)
      markingsLayersRef.current = p5.round(R.random_num(4, 7))
      p5.strokeJoin(p5.ROUND)
      p5.strokeWeight(strokeWeight)
      initializeMarkings(p5)
      initializeNoiseLayer(p5)
    },
    [R, height, initializeMarkings, initializeNoiseLayer, strokeWeight, width],
  )

  const renderMarkings = useCallback(
    (p5: p5Types) => {
      layersRef.current.forEach((layer: any) => {
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
    },
    [R, height, strokeColor, strokeWeight, width],
  )

  const addBorder = useCallback(
    (p5: p5Types) => {
      p5.noFill()
      p5.stroke(outerStrokeColor)
      p5.strokeWeight(strokeWeight * 2) // half of the border gets cropped.
      p5.ellipse(0, 0, width - strokeWeight, height - strokeWeight)
    },
    [height, outerStrokeColor, strokeWeight, width],
  )

  const renderNoise = useCallback((p5: p5Types) => {
    if (noiseImgRef.current) {
      p5.translate(p5.width / 2, p5.height / 2)
      p5.blendMode(p5.HARD_LIGHT)
      p5.tint(255, noiseOpacityRef.current)
      p5.image(noiseImgRef.current, 0, 0, p5.width, p5.height)
      p5.blendMode(p5.BLEND)
    }
  }, [])

  const draw = useCallback(
    (p5: p5Types) => {
      p5.background(bgColor)
      renderMarkings(p5)
      renderNoise(p5)
      addBorder(p5)
      //@ts-ignore
      const canvas = p5.canvas.toDataURL("image/png")
      if (onImageGenerated) {
        onImageGenerated(canvas)
      }
    },
    [addBorder, bgColor, onImageGenerated, renderMarkings, renderNoise],
  )

  return (
    <Box sx={{ borderRadius: 999, overflow: "hidden", width: width, height: height }}>
      <Sketch setup={setup} draw={draw} />
    </Box>
  )
}

export default DeterministicAvatar
