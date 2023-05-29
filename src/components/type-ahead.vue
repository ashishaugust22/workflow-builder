<template>
  <div id="type-ahead">
    <label for="search-nodes">Search Node</label>
    <input 
      type="search"
      id="search-nodes"
      placeholder="Search Nodes"
      @focus="showSuggestion = true"
      @input="onChangeDebounced($event)"
    >
    <div class="type-ahead__suggestions" v-if="nodes.length && showSuggestion">
      <ul>
        <li
          :value="node.id"
          @click="onNodeClick(node.id)"
          v-for="node of nodes"
        >
          {{ node.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue'
import type { NodeType } from '../interfaces/node-type';

export default defineComponent({
  name: 'TypeAhead',
  emits: ['onSearch', 'addNode'],
  props: {
    nodes: {
      type: Array<NodeType>,
      default: []
    }
  },
  components: {
  },
  setup(_, { emit }) {
    const timerId: Ref<number> = ref(0);
    const showSuggestion: Ref<Boolean> = ref(false);

    function onChangeDebounced(e: any) {
      if (timerId.value) clearTimeout(timerId.value);
      const debounceTime = 300;

      timerId.value = setTimeout(() => {
        const searchTerm: string = e.target.value;
        emit("onSearch", searchTerm);
        clearTimeout(timerId.value);
        showSuggestion.value = true;
      }, debounceTime);
    }

    function onNodeClick(id: string) {
      showSuggestion.value = false;
      emit('addNode', id)
    }

    return {
      timerId,
      onChangeDebounced,
      onNodeClick,
      showSuggestion
    }
  },
  methods: {},
})
</script>

<style scoped lang="scss">
#type-ahead {
  position: relative;

  input[type="search"] {
    border-radius: 0.25rem;
    padding: 0.75rem;
    border: 1px solid #a3a3a3;
    margin-bottom: 0.5rem;
    width: 100%;
    background-color: var(--vt-c-black-mute);
    color: #fff;
    font-size: 18px;

    &:focus {
      outline: none;
      border: 1px solid #fff;
    }
  }

  .type-ahead__suggestions {
    border: 1px solid #ddd;
    border-bottom-left-radius: 0.25rem;
    border-bottom-right-radius: 0.25rem;

    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;

    ul {
      padding: 0;

      li {
        background-color: var(--vt-c-black-mute);
        list-style: none;
        padding: 0.75rem;

        &:hover {
          filter: invert(1);
          cursor: pointer;
        }
      }
    }
  }
}
</style>
