<template>
  <div>
    <TextClamp :max-lines="2" :text="text">
      <template #after="{ toggle, expanded }">
        <button @click="toggle">
          {{ expanded ? "Show less" : "Show more" }}
        </button>
      </template>
    </TextClamp>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import TextClamp from "vue3-text-clamp";

export default defineComponent({
  components: {
    TextClamp,
  },
  setup() {
    const text =
      "hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world hello world ";

    return {
      text,
    };
  },
});
</script>
