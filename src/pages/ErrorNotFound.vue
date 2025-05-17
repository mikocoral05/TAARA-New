<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 30vh">404</div>

      <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        :to="navigateFn()"
        label="Go Home"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { globalStore } from 'src/stores/global-store'
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ErrorNotFound',
  setup() {
    const store = globalStore()
    const navigateFn = () => {
      if ([3, 2].includes(store.userData?.user_type)) {
        return '/management'
      } else if (store.userData?.user_type == 1) {
        return '/public'
      } else {
        return '/user-login'
      }
    }
    return {
      navigateFn,
      store,
    }
  },
})
</script>
