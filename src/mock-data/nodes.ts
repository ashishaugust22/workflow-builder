import type { Connector } from '../interfaces/connector'
import { CanvasNode } from '../utils/node'

const GAP = 100

export function getNodes(): Promise<CanvasNode[]> {
  return new Promise((resolve, _) => {
    const timeToResolve = Math.random() * 3
    setTimeout(() => {
      const clonedData = structuredClone(data)
      resolve(structuredClone(clonedData))
    }, timeToResolve)
  })
}

const data: CanvasNode[] = [
  new CanvasNode({
    x: 30,
    y: 30,
    width: 60,
    height: 60,
    fill: getRandomColor(),
    isDragging: false
  }),
  new CanvasNode({
    x: 90 + GAP,
    y: 30,
    width: 60,
    height: 60,
    fill: getRandomColor(),
    isDragging: false
  }),
  new CanvasNode({
    x: 150 + 2 * GAP,
    y: 30,
    width: 60,
    height: 60,
    fill: getRandomColor(),
    isDragging: false
  }),
  // new CanvasNode({
  //   x: 210 + 3 * GAP,
  //   y: 30,
  //   width: 60,
  //   height: 60,
  //   fill: getRandomColor(),
  //   isDragging: false
  // })
]

export function getConnectorsData(nodes: CanvasNode[]) {
  const connectorsData: Connector[] = []
  for (let i = 0; i < nodes.length - 1; i++) {
    let x1 = nodes[i].x + nodes[i].width
    let x2 = nodes[i + 1].x
    let y1 = nodes[i].y
    let y2 = nodes[i + 1].y + nodes[i + 1].height/2
    connectorsData.push({ x1, x2, y1, y2 })
  }
  return connectorsData
}

function getRandomColor() {
  const r = Math.ceil(Math.random() * 255)
  const g = Math.ceil(Math.random() * 255)
  const b = Math.ceil(Math.random() * 255)
  return `rgb(${r}, ${g}, ${b})`
}
