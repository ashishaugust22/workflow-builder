<template>
  <div id="type-ahead">
    <label for="search-nodes">Search Node</label>
    <input type="search" id="search-nodes" placeholder="Search Nodes" v-model="searchTerm">
    <div class="type-ahead__suggestions" hidden>
      <ul>
        <li>Test</li>
        <li>Test</li>
        <li>Test</li>
        <li>Test</li>
        <li>Test</li>
        <li>Test</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue'

export default defineComponent({
  name: 'TypeAhead',
  components: {
  },
  methods: {},
  setup() {
    const searchTerm: Ref<string> = ref('');

    return {
      searchTerm
    }
  }
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
      box-shadow: 0 0 3px 5px #fff;

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
