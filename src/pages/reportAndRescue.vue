<template>
  <q-page class="flex flex-center q-pa-lg q-py-xl">
    <q-card flat class="radius-10" style="max-width: 600px; width: 100%; min-height: 500px">
      <q-form @submit="submitReport()" ref="reportForm">
        <q-card-section class="text-center">
          <div class="text-bold text-h6">Animal Report Incident</div>
          <div class="column no-wrap q-mt-xl">
            <div class="text-left">Upload image of incident</div>
            <q-file
              class="q-mt-sm"
              outlined
              v-model="reportDetails.file"
              dense
              :rules="[(val) => !!val || 'Image is required!']"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
          <div class="row no-wrap q-mt-md">
            <div class="column no-wrap q-mr-md w-100">
              <div class="text-left">Reporter name</div>
              <q-input
                class="q-mt-sm"
                outlined
                v-model="reportDetails.name"
                dense
                :rules="[(val) => !!val || 'Reporter name is required!']"
              />
            </div>
            <div class="column no-wrap w-100">
              <p class="q-mb-sm text-left">Phone</p>
              <q-input
                mask="phone"
                v-model="reportDetails.phone_number"
                prefix="+63"
                :rules="[(val) => !!val || 'Phone number is required!']"
                dense
                outlined
              />
            </div>
          </div>
          <div class="column no-wrap w-100">
            <p class="q-mb-sm text-left">Location</p>
            <q-input
              v-model="reportDetails.location"
              placeholder="Location of incident"
              :rules="[(val) => !!val || 'Location is required!']"
              dense
              hint="You can share your current location where the incident by clicking the icon in the right!"
              outlined
            >
              <q-separator vertical class="q-mr-sm" /><template v-slot:append>
                <q-spinner-ios color="primary" size="1.1rem" class="q-ml-md" v-if="showSpinner" />
                <q-icon name="sym_r_location_on" @click="getLocation()" size="1.2rem" /> </template
            ></q-input>
          </div>
          <div class="column no-wrap w-100 q-mt-md">
            <p class="q-mb-sm text-left">Details</p>
            <q-input
              v-model="reportDetails.description"
              dense
              outlined
              type="textarea"
              placeholder="The details of report"
              :rules="[(val) => !!val || 'Details of incident is required!']"
            >
            </q-input>
          </div>
        </q-card-section>
        <q-card-section>
          <q-btn label="Submit" type="submit" class="w-100" dense color="primary" />
        </q-card-section>
      </q-form>
    </q-card>
    <OutputDialog v-model:outputDialog="outputDialog" v-model:outputObj="outputObj" />
  </q-page>
  <TaaraFooter class="q-mt-xl" />
</template>
<script>
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import TaaraFooter from 'src/components/TaaraFooter.vue'
import { globalStore } from 'src/stores/global-store'
import { addRescueRerport, getAddressFromCoords } from 'src/composable/latestComposable'
import OutputDialog from 'src/components/OutputDialog.vue'
export default {
  components: {
    TaaraFooter,
    OutputDialog,
  },
  setup() {
    const $q = useQuasar()
    const store = globalStore()

    const reportDetails = ref({
      reporter_type: store.userData.user_id ? 1 : 2,
      reporter_id: store.userData.user_id ?? null,
      name: store.userData.first_name ?? null,
      phone_number: store.userData.phone_number ?? null,
      file: null,
      description: null,
      location: null,
    })
    const outputDialog = ref(false)
    const outputObj = ref({})
    const showSpinner = ref(false)
    const reportForm = ref(false)
    const userName = store.userData?.first_name + ' ' + store.userData?.last_name
    const submitReport = async () => {
      $q.loading.show({ message: 'Submitting report. please wait ...' })
      const response = await addRescueRerport(
        reportDetails.value,
        store.userData?.user_id || null,
        store.userData?.user_type || null,
        userName || '',
      )
      setTimeout(() => {
        $q.loading.hide()
        outputDialog.value = true
        outputObj.value = {
          icon: 'check_circle',
          title: response.message,
          subtext: 'Your report has been submitted and is pending verification by our team.',
        }
        resetForm()
      }, 1000)
    }

    const getLocation = () => {
      showSpinner.value = true
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude

          // Now use reverse geocoding to get the address
          const address = await getAddressFromCoords(lat, lng)
          reportDetails.value.location = address
          reportDetails.value.latitude = lat
          reportDetails.value.longitude = lng
          showSpinner.value = false
        },
        (error) => {
          console.error('Geolocation error:', error)
        },
      )
    }

    const resetForm = () => {
      // Reset the form data
      reportDetails.value = {
        reporter_type: store.userData.user_id ? 1 : 2,
        reporter_id: store.userData.user_id ?? null,
        name: store.userData.first_name ?? null,
        phone_number: store.userData.phone_number ?? null,
        file: null,
        description: null,
        location: null,
      }

      // Reset the form validation
      if (reportForm.value) {
        reportForm.value.reset()
      }
    }
    return {
      reportForm,
      showSpinner,
      outputDialog,
      outputObj,
      getLocation,
      submitReport,
      reportDetails,
    }
  },
}
</script>
<style scoped lang="scss" src="../pages/taara/style/reportAndRescue.scss"></style>
