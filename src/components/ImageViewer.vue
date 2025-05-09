<template>
  <q-dialog v-model="isVisible" maximized transition-show="fade" transition-hide="fade">
    <q-card class="bg-black text-white">
      <q-card-section class="row items-center q-pa-sm q-gutter-sm">
        <div class="text-body1">Image Preview</div>
        <q-space />
        <q-btn flat dense icon="close" @click="closeDialog" />
      </q-card-section>

      <!-- <q-separator dark /> -->

      <q-card-section class="q-pa-md flex flex-center" style="height: 90vh">
        <img
          :src="imageUrl"
          alt="Preview"
          style="max-width: 100%; max-height: 100%; object-fit: contain"
        />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref, watch } from 'vue'

export default {
  name: 'ImageViewer',
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const isVisible = ref(props.modelValue)

    watch(
      () => props.modelValue,
      (val) => {
        isVisible.value = val
      },
    )

    watch(isVisible, (val) => {
      emit('update:modelValue', val)
    })

    const closeDialog = () => {
      isVisible.value = false
    }

    return {
      isVisible,
      closeDialog,
    }
  },
}
</script>
