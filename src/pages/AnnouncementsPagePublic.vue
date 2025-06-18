<template>
  <q-page>
    <div class="flex justify-center items-center q-pa-sm">
      <div
        v-for="(data, index) in annoucementData"
        :key="index"
        class="q-mb-xl q-mt-sm q-pa-xl announcements-container"
        :id="'report-' + data.id"
      >
        <div class="row no-wrap justify-between items-center big-announcement-title-container">
          <div class="row no-wrap items-center">
            <q-avatar>
              <img src="TAARA.png" />
            </q-avatar>
            <div class="column no-wrap q-ml-md">
              <div class="text-bold">Tabaco Animal Rescue and Adoption</div>
              <div class="text-grey-7">{{ data.created_at }}</div>
            </div>
          </div>
          <div class="row no-wrap" v-if="data.is_pinned == 1">
            <q-icon name="sym_r_keep" class="q-mr-md" color="green" size="1.3rem" />
            Pinned by Taara
          </div>
        </div>
        <div
          class="q-ma-sm flex row no-wrap image-container q-mt-lg"
          v-if="data?.announcement_image_path"
        >
          <q-img class="radius-10" :src="data.announcement_image_path" :ratio="16 / 9" />
        </div>
        <div class="column no-wrap q-mt-lg">
          <div class="text-body1 text-bold">{{ data.title }}</div>
          <div v-html="data.content"></div>
        </div>
      </div>
    </div>
    <TaaraFooter />
  </q-page>
</template>

<script>
import { onMounted, ref, watch } from 'vue'
import { timeAgo, wordifyDate, wordifyTime } from 'src/composable/simpleComposable'
import { useCounterStore } from 'src/stores/example-store'
import { getAllAnnouncement } from 'src/composable/latestComposable'
import TaaraFooter from 'src/components/TaaraFooter.vue'
import { useRoute } from 'vue-router'
export default {
  components: {
    TaaraFooter,
  },

  setup() {
    const counterStore = useCounterStore()
    const myElement = ref(null)
    const annoucementData = ref([])
    let textLength = ref(150)
    const route = useRoute()
    const scrollToElement = () => {
      setTimeout(() => {
        const element = document.querySelector(`#report-${route.query.id}`)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 10)
    }

    let showMore = ref(false)
    const handleWindowResize = () => {
      if (window.innerWidth < 415) {
        showMore.value = true
      } else {
        showMore.value = false
      }
    }

    function toggleShowMore(item) {
      item.showMore = !item.showMore
    }
    let slide = ref(1)
    let qDialogImageId = ref()
    let viewImage = (payload, id) => {
      slide.value = payload
      qDialogImageId.value = id
    }

    window.addEventListener('resize', handleWindowResize)
    watch(
      () => counterStore.announcement,
      (newValue, oldValue) => {
        console.log(newValue + 'd' + oldValue)
        scrollToElement()
      },
    )
    onMounted(async () => {
      handleWindowResize()
      annoucementData.value = await getAllAnnouncement()
      console.log(annoucementData.value)

      setTimeout(() => {
        scrollToElement()
      }, 1000)
    })
    return {
      timeAgo,
      qDialogImageId,
      viewImage,
      toggleShowMore,
      wordifyDate,
      wordifyTime,
      getAllAnnouncement,
      annoucementData,
      myElement,
      showMore,
      textLength,
      slide,
      carousel: ref(false),
    }
  },
}
</script>
<style lang="scss" scoped src="../pages/taara/style/announcementsPage.scss"></style>
