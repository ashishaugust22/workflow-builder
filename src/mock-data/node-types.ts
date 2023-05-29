import type { NodeType } from '../interfaces/node-type'
import { v4 as uuid } from 'uuid'

export function getNodeTypes(): Promise<NodeType[]> {
  return new Promise((resolve, _) => {
    const timeToResolve = Math.random() * 3
    setTimeout(() => {
      const clonedData = structuredClone(data)
      resolve(structuredClone(clonedData))
    }, timeToResolve)
  })
}

const data: NodeType[] = [
  { id: uuid(), name: getRandomColor() },
  { id: uuid(), name: getRandomColor() },
  { id: uuid(), name: getRandomColor() },
  { id: uuid(), name: getRandomColor() }
]

function getRandomColor() {
  const r = Math.ceil(Math.random() * 255)
  const g = Math.ceil(Math.random() * 255)
  const b = Math.ceil(Math.random() * 255)
  return `rgb(${r}, ${g}, ${b})`
}
