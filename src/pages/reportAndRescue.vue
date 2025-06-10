<template>
  <q-page>
    <div class="flex justify-center q-pb-xl q-pt-sm all-container">
      <div class="containerss flex column q-mx-sm">
        <h4 class="q-ma-none q-my-sm text-center report-title q-mt-md">Animal Report Incident</h4>
        <div class="divider invisible"></div>
        <div class="flex justify-center items-center">
          <img class="image" src="../image/TAARA_Logo.jpg" />
        </div>

        <div class="flex justify-center items-center column">
          <!-- {{ images.length }} -->
          <p class="hidden">{{ images.splice(5) }}</p>

          <div v-show="images.length > 0" class="flex justify-end q-pr-xl" style="width: 100%">
            <q-icon @click="imageRemover" name="clear" size="2rem"></q-icon>
          </div>
          <div class="flex row justify-center items-center">
            <img
              v-for="showImage in images"
              :key="showImage"
              :src="showImage"
              id="previewImage"
              class="uploading-image"
            />
          </div>
        </div>
        <div class="flex column justify-center items-center q-mt-lg q-px-md">
          <div class="flex row no-wrap justify-center items-center input-container">
            <div class="flex column input-container q-pr-sm">
              <p class="q-pa-none q-ma-none">Reporter Name</p>

              <q-input
                class="q-my-sm input"
                :disable="logInDetails == null ? false : true"
                v-model="reporterDetails.reporter_name"
                :input-style="
                  inputStyleAdjuster
                    ? {
                        height: '22px',
                        margin: '5px 5px 5px 10px',
                        fontSize: '13px',
                      }
                    : { margin: '10px' }
                "
                dense
                filled
                :rules="[(val) => !!val || '']"
                hide-bottom-space
              />
            </div>
            <div class="flex column input-container q-pl-sm">
              <p class="q-pa-none q-ma-none">Phone Number</p>
              <q-input
                class="q-my-sm input"
                :disable="logInDetails == null ? false : true"
                mask="phone"
                v-model="reporterDetails.phone_number"
                :input-style="
                  inputStyleAdjuster
                    ? {
                        height: '22px',
                        margin: '5px 5px 5px 10px',
                        fontSize: '13px',
                      }
                    : { margin: '10px' }
                "
                prefix="+63"
                :rules="[
                  (val) => (!!val && val.length == 16) || '',
                  (val) => (val && val[1] === '9') || 'Phone number must start with 9',
                ]"
                hide-bottom-space
                dense
                filled
              />
            </div>
          </div>
          <div class="flex column input-container">
            <p class="q-pa-none q-ma-none">Location</p>
            <q-input
              class="q-my-sm input"
              v-model="reporterDetails.location"
              dense
              filled
              :rules="[(val) => !!val || '']"
              hide-bottom-space
              :input-style="
                inputStyleAdjuster
                  ? {
                      height: '22px',
                      margin: '5px 5px 5px 10px',
                      fontSize: '13px',
                    }
                  : { margin: '10px' }
              "
            />
          </div>
          <div class="flex justify-around items-center hidden">
            <q-input
              class="q-my-sm"
              readonly
              filled
              v-model="reporterDetails.date_report"
              label="Date"
              stack-label
              dense
            />
            <q-input
              class="q-my-sm"
              readonly
              filled
              v-model="reporterDetails.time_report"
              label="Time"
              stack-label
              dense
            />
          </div>
          <div class="flex column input-container">
            <p class="q-pa-none q-ma-none">Report Details</p>
            <q-input
              class="input-autgrow"
              v-model="reporterDetails.description"
              :input-style="
                inputStyleAdjuster
                  ? {
                      margin: '-5px 5px 5px 10px',
                      fontSize: '13px',
                    }
                  : { margin: '10px' }
              "
              autogrow
              dense
              borderless
              flat
            />
          </div>
          <!-- <p style="color: black;">{{ previewImage }}</p> -->
          <div class="flex justify-between items-start button no-wrap full-width input-container">
            <q-btn label="Cancel" class="q-ma-lg cancel-button" @click="cancelInput" flat />
            <q-btn
              label="Report"
              @click="submitReport(reporterDetails, images)"
              class="text-white q-ma-lg report-button"
              flat
            />
          </div>
        </div>
      </div>
    </div>

    <TaaraFooter />
  </q-page>
</template>
<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { QSpinnerGears, useQuasar } from 'quasar'
import { logInDetails, addAnimalReport, getReportRescue } from 'src/composable/taaraComposable'
import { useRouter } from 'vue-router'
import TaaraFooter from 'src/components/TaaraFooter.vue'
import { globalStore } from 'src/stores/global-store'
export default {
  component: {
    TaaraFooter,
  },
  setup() {
    const router = useRouter()
    const $q = useQuasar()
    const store = globalStore()
    const reporterDetails = ref({
      reporter_type: store.userData.user_id ? 1 : 2,
      reporter_id: store.userData.user_id ?? null,
      name: store.userData.first_name ?? null,
      phone_number: store.userData.phone_number ?? null,
      image: null,
      description: null,
      location: null,
    })

    const date_rescued = ref('')
    const animal_condition = ref('')
    const continaer = ref([])
    const images = ref([])

    const imageRemover = () => {
      images.value = []
    }
    const imageShow = () => {
      document.getElementById('file').click()
    }
    const submitReport = (report, image) => {
      addAnimalReport(report, image)
      setTimeout(() => {
        $q.notify({
          spinner: QSpinnerGears,
          message: 'Report Submitted',
          timeout: 500,
          position: 'center',
        })
      }, 1500)
      setTimeout(() => {
        // router.go(-1);
        router.push('rescue-reports')
      }, 3500)
    }
    const cancelInput = () => {
      if (logInDetails.value == null) {
        let arrayKeys = ['description', 'location', 'phone_number', 'reporter_name']
        for (let key of arrayKeys) {
          reporterDetails.value[key] = null
        }
      } else {
        reporterDetails.value.description = null
        reporterDetails.value.location = null
      }
    }
    const inputStyleAdjuster = ref(false)

    const handleWindowSize = () => {
      inputStyleAdjuster.value = window.innerWidth < 500
    }
    onMounted(() => {
      getReportRescue()
      window.addEventListener('resize', handleWindowSize)
    })
    onUnmounted(() => {
      window.removeEventListener('resize', handleWindowSize)
    })
    return {
      cancelInput,
      inputStyleAdjuster,
      images,
      submitReport,
      imageShow,
      reporterDetails,
      imageRemover,
      date_rescued,
      animal_condition,
      continaer,
      logInDetails,
    }
  },
}
</script>
<style scoped lang="scss" src="../pages/taara/style/reportAndRescue.scss"></style>
