export class CanvasNode {
  x: number = 0
  y: number = 0
  width: number = 0
  height: number = 0
  fill: string = '#dddddd'
  isDragging: boolean = true

  constructor(options: CanvasNode) {
    Object.assign(this, options)
  }
}
