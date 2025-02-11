<template>
  <q-item
    clickable
    class="radius-10 q-my-sm position-relative"
    :class="{ 'bg-primary text-white': title == 'Dashboard' }"
  >
    <div
      class="bg-primary absolute-left radius-10"
      v-if="title == 'Dashboard'"
      style="margin-left: -70px; width: 50px"
    ></div>
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" size="1rem" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'EssentialLink',
  props: {
    title: {
      type: String,
      required: true,
    },

    caption: {
      type: String,
      default: '',
    },

    icon: {
      type: String,
      default: '',
    },
  },
})
</script>
