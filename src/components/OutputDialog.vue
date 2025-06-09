<template>
  <q-dialog v-model="showDialog" persistent>
    <q-card class="q-pa-md" style="width: 450px; min-height: 230px">
      <q-card-section class="column items-center">
        <q-icon :name="`sym_r_${outputObj.icon}`" color="positive" size="2.5rem" />
        <span class="q-ml-sm text-black text-body1 q-mt-md text-center">
          {{ outputObj.title }}
        </span>
        <span class="q-ml-sm text-caption text-center text-grey-7 q-mt-sm">
          {{ outputObj.subtext }}
        </span>
      </q-card-section>

      <q-card-actions align="center">
        <q-btn
          label="Ok"
          unelevated
          color="primary"
          style="min-width: 200px"
          no-caps
          dense
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script>
import { ref } from 'vue'
import { watch } from 'vue'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'OutputDialog',
  props: {
    outputDialog: {
      type: Boolean,
      default: false,
    },
    outputObj: {
      type: Object,
      default: () => ({ title: '', subtext: '', icon: 'check_circle' }),
    },
  },
  emits: ['update:outputDialog'],
  setup(props, { emit }) {
    const showDialog = ref(props.outputDialog)

    watch(
      () => props.outputDialog,
      (val) => {
        showDialog.value = val
      },
    )

    watch(showDialog, (val) => {
      emit('update:outputDialog', val)
    })

    const closeDialog = () => {
      showDialog.value = false
    }

    return {
      showDialog,
      closeDialog,
    }
  },
})
</script>
