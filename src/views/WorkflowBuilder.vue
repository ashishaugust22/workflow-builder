<template>
  <div id="workflow-builder">
    <h1>Workflow Builder</h1>
    <TypeAhead
      :nodes="nodeTypes"
      @onSearch="onSearch($event)"
      @addNode="onAddNode($event)"
    />

    <div class="legend">
      <div class="legend-item" v-for="node of nodesData">
        <div class="legend-item-icon" :style="{ backgroundColor: node.fill }"></div> ({{ node.x }}, {{ node.y }})
      </div>
    </div>

    <div>
      <canvas 
        id="canvas" 
        :width="canvasWidth" 
        :height="canvasHeight" 
        @mousedown.stop.prevent="mouseDown($event)"
        @mouseup.stop.prevent="mouseUp($event)"
        @mousemove.stop.prevent="mouseMove($event)"
      ></canvas>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, type Ref } from 'vue'
import { createNextNode, getConnectorsData, getNodes } from "../mock-data/nodes";
import { CanvasNode } from '../utils/node';
import type { Connector } from '../interfaces/connector';
import type { NodeType } from '../interfaces/node-type';
import { getNodeTypes } from '../mock-data/node-types';
import TypeAhead from "../components/type-ahead.vue";

export default defineComponent({
  name: 'WorkflowBuilder',
  components: {
    TypeAhead
  },
  setup() {
    const offsetX: Ref<number> = ref(0);
    const offsetY: Ref<number> = ref(0);

    const startX: Ref<number> = ref(0);
    const startY: Ref<number> = ref(0);

    const isDragging: Ref<boolean> = ref(false);
    const nodesData: Ref<CanvasNode[]> = ref([]);
    const nodeTypes: Ref<NodeType[]> = ref([]);

    const canvasWidth: Ref<number> = ref(1200);
    const canvasHeight: Ref<number> = ref(1200);

    const ctx: Ref<CanvasRenderingContext2D | any> = ref(0);

    // handle mousedown events
    function mouseDown(e: MouseEvent) {
      // get the current mouse position
      var mx = parseInt((e.clientX - offsetX.value).toString());
      var my = parseInt((e.clientY - offsetY.value).toString());

      // test each rect to see if mouse is inside
      isDragging.value = false;
      for (var i = 0; i < nodesData.value.length; i++) {
        var r = nodesData.value[i];
        if (mx > r.x && mx < r.x + r.width && my > r.y && my < r.y + r.height) {
          // if yes, set that rects isDragging=true
          isDragging.value = true;
          r.isDragging = true;
        }
      }
      // save the current mouse position
      startX.value = mx;
      startY.value = my;
    }

    // handle mouseup events
    function mouseUp(e: MouseEvent) {
      // clear all the dragging flags
      isDragging.value = false;
      for (var i = 0; i < nodesData.value.length; i++) {
        nodesData.value[i].isDragging = false;
      }
    }

    // handle mouse moves
    function mouseMove(e: MouseEvent) {
      // if we're dragging anything...
      if (isDragging.value) {
        // get the current mouse position
        var mx = parseInt((e.clientX - offsetX.value).toString());
        var my = parseInt((e.clientY - offsetY.value).toString());

        // calculate the distance the mouse has moved
        // since the last mousemove
        var dx = mx - startX.value;
        var dy = my - startY.value;

        // move each rect that isDragging 
        // by the distance the mouse has moved
        // since the last mousemove
        for (var i = 0; i < nodesData.value.length; i++) {
          var r = nodesData.value[i];
          if (r.isDragging) {
            r.x += dx;
            r.y += dy;
          }
        }

        // redraw the scene with the new rect positions
        draw();

        // reset the starting mouse position for the next mousemove
        startX.value = mx;
        startY.value = my;
      }
    }

    // redraw the scene
    function draw() {
      clear();
      ctx.value.fillStyle = "#FAF7F8";
      rect(0, 0, canvasWidth.value, canvasHeight.value);
      // redraw each rect in the rects[] array
      for (var i = 0; i < nodesData.value.length; i++) {
        var r = nodesData.value[i];
        ctx.value.fillStyle = r.fill;
        rect(r.x, r.y, r.width, r.height);
      }

      drawArrows();
    }

    function drawArrows() {
      const connectorsData = getConnectorsData(nodesData.value);
      connectorsData.forEach(connector => {
        drawArrow(connector);
      })
    }

    // clear the canvas
    function clear() {
      ctx.value.clearRect(0, 0, canvasWidth, canvasHeight);
    }

    // draw a single rect
    function rect(x: number, y: number, w: number, h: number) {
      ctx.value.beginPath();
      ctx.value.rect(x, y, w, h, [4, 4, 4, 4]);
      ctx.value.closePath();
      ctx.value.fill();
    }

    function drawArrow(connectorData: Connector) {
      //variables to be used when creating the arrow
      const { x1, x2, y1, y2 } = connectorData;
      var headlen = 10;
      var angle = Math.atan2(y2 - y1, x2 - x1);

      ctx.value.save();
      ctx.value.strokeStyle = "#000";

      //starting path of the arrow from the start square to the end square
      //and drawing the stroke
      ctx.value.beginPath();
      ctx.value.moveTo(x1, y1);
      ctx.value.lineTo(x2, y2);
      ctx.value.lineWidth = 3;
      ctx.value.stroke();

      //starting a new path from the head of the arrow to one of the sides of
      //the point
      ctx.value.beginPath();
      ctx.value.moveTo(x2, y2);
      ctx.value.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 7),
        y2 - headlen * Math.sin(angle - Math.PI / 7));

      //path from the side point of the arrow, to the other side point
      ctx.value.lineTo(x2 - headlen * Math.cos(angle + Math.PI / 7),
        y2 - headlen * Math.sin(angle + Math.PI / 7));

      //path from the side point back to the tip of the arrow, and then
      //again to the opposite side point
      ctx.value.lineTo(x2, y2);
      ctx.value.lineTo(x2 - headlen * Math.cos(angle - Math.PI / 7),
        y2 - headlen * Math.sin(angle - Math.PI / 7));

      //draws the paths created above
      ctx.value.stroke();
      ctx.value.restore();
    }

    onMounted(async () => {
      // get nodes data
      nodesData.value = await getNodes();
      nodeTypes.value = await getNodeTypes('');

      var canvas: HTMLCanvasElement = document.getElementById("canvas") as HTMLCanvasElement;
      ctx.value = canvas.getContext("2d");
      var BB = canvas.getBoundingClientRect();
      offsetX.value = BB.left;
      offsetY.value = BB.top;
      draw();
    })

    return {
      mouseDown,
      mouseUp,
      mouseMove,
      canvasWidth,
      canvasHeight,
      nodesData,
      nodeTypes,
      draw
    }
  },
  methods: {
    onSearch(searchTerm: string) {
      this.searchNodeTypes(searchTerm);
    },
    async searchNodeTypes(searchTerm: string) {
      const res = await getNodeTypes(searchTerm);
      this.nodeTypes = res;
    },
    onAddNode(nodeId: string) {
      const node = this.nodeTypes.filter(n => n.id === nodeId);
      const newNode = createNextNode(this.nodesData);
      this.nodesData.push(newNode);
      this.draw();
    }
  },
})
</script>

<style scoped lang="scss">
#workflow-builder {
  #canvas {
    border: 1px solid red;
  }

  .legend {
    display: flex;
    gap: 1rem;
    margin-bottom: 1rem;
    &-item {
      display: flex;
      align-items: center;
      gap: 0.25rem;

      .legend-item-icon {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 0.25rem;
      }
    }
  }
}
</style>
