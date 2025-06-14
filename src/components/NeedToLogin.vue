<template>
  <q-dialog
    v-model="dialogModelValue"
    maximized
    class="position-relative"
    transition-hide="slide-down"
  >
    <q-card class="q-pa-lg column no-wrap items-center justify-center ful-width full-height">
      <q-icon
        name="sym_r_close"
        size="1.3rem"
        class="absolute-top-right q-pa-lg"
        @click="closeDialog()"
      />
      <q-img src="registration-icon.svg" width="250px" />
      <div class="q-mt-md">
        You must <u class="text-primary text-body1">LOGIN</u> or
        <u class="text-primary">REGISTER</u> first before you can {{ text }}
      </div>
      <div class="text-caption text-grey-7">Thank you for understanding.</div>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, toRef } from 'vue'

export default defineComponent({
  name: 'NeedToLogin',
  props: {
    text: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const dialogModelValue = toRef(props, 'modelValue')

    const closeDialog = () => {
      emit('update:modelValue', false)
    }

    return {
      dialogModelValue,
      closeDialog,
    }
  },
})
</script>
