<template>
  <q-item
    clickable
    class="radius-10 q-my-sm relative-position"
    :class="{ 'bg-primary text-white': isActive }"
    @click="updateTab()"
    v-if="showTab"
  >
    <div
      class="bg-primary absolute-left radius-10"
      v-if="isActive"
      style="margin-left: -70px; width: 50px"
    ></div>

    <q-item-section v-if="icon" avatar>
      <q-icon :name="`sym_r_${icon}`" size="1.1rem" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
    </q-item-section>
    <q-badge
      v-if="pending"
      color="red"
      align="middle"
      class="absolute-right relative-position"
      style="height: 20px; width: 20px"
    >
      <div class="absolute-center text-caption">
        {{ pending }}
      </div>
    </q-badge>
  </q-item>
</template>

<script>
import { defineComponent, computed } from 'vue'
import { useRouter } from 'vue-router'

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
    tab: {
      // Accept tab as a prop
      type: String,
      required: true,
    },
    nav: {
      type: String,
      default: '',
    },
    pending: {
      type: Number,
      default: 0,
    },
    action: {
      type: Function,
      default: null,
    },
    showTab: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const router = useRouter()
    const isActive = computed(() => props.tab === props.title)

    const updateTab = () => {
      if (props.action) {
        props.action()
      } else {
        emit('update-tab', props.title)
        if (props.nav) router.push(props.nav)
      }
    }

    return {
      isActive,
      updateTab,
    }
  },
})
</script>
