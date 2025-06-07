<template>
  <q-dialog v-model="localShowDialog" persistent>
    <q-card>
      <q-card-section class="row items-center">
        <q-avatar icon="signal_wifi_off" color="primary" text-color="white" />
        <span class="q-ml-sm">You are currently not connected to any network.</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancel" color="primary" @click="closeDialog" />
        <q-btn flat label="Turn on Wifi" color="primary" @click="closeDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'NoAccessDialog',
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:showDialog'],
  setup(props, { emit }) {
    const localShowDialog = ref(props.showDialog)

    watch(
      () => props.showDialog,
      (val) => {
        localShowDialog.value = val
      },
    )

    watch(localShowDialog, (val) => {
      emit('update:showDialog', val)
    })

    const closeDialog = () => {
      localShowDialog.value = false
    }

    return {
      localShowDialog,
      closeDialog,
    }
  },
})
</script>
