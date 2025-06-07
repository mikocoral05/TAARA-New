<template>
  <q-dialog v-model="localshowNoAccess" persistent>
    <q-card>
      <q-card-section class="items-center column no-wrap">
        <q-avatar icon="sym_r_do_not_touch" color="primary" text-color="white" />
        <div class="q-mt-md">
          You don't have access to perform this action. This feature is restricted.
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Close" color="primary" @click="closeDialog" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'

export default defineComponent({
  name: 'NoAccessDialog',
  props: {
    showNoAccess: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:showNoAccess'],
  setup(props, { emit }) {
    const localshowNoAccess = ref(props.showNoAccess)

    // Watch external prop changes
    watch(
      () => props.showNoAccess,
      (val) => {
        localshowNoAccess.value = val
      },
    )

    // Emit updates back to parent
    watch(localshowNoAccess, (val) => {
      emit('update:showNoAccess', val)
    })

    const closeDialog = () => {
      localshowNoAccess.value = false
    }

    return {
      localshowNoAccess,
      closeDialog,
    }
  },
})
</script>
