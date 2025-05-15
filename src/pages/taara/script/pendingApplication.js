import { ref, onMounted, onUnmounted } from 'vue'
import { useQuasar } from 'quasar'
import {
  getAdoptionRequest,
  adoptionRequest,
  reportRequestData,
  getReportRequest,
  volunteerRequestData,
  getVolunteerRequest,
  getPendingInKindDonations,
  pendingInKindDonations,
  getPendingDonations,
  pendingDonations,
  declineAdoptionRequest,
  declineRescueRequest,
  declineVolunteerRequest,
  declineInKindDonation,
  declineDonation,
  approveAdoptionRequest,
  approveDonation,
  approveInKindDonation,
  approveRescueRequest,
  approveVolunteerRequest,
  adoptionRequestProgressUpdate,
} from 'src/composable/taaraComposable'
export default {
  setup() {
    const $q = useQuasar()
    let pending = ref('Pet adoption')
    let adoptionDetails = ref({})
    let reportDetails = ref({})
    let volunteerDetails = ref({})
    let inKindDetails = ref({})
    let donationDetails = ref({
      animal_name: null,
      image: null,
      name: null,
      phone_number: null,
      donation_amount: null,
      reference: null,
    })
    let reportImage = ref([])
    let nameDisplay = ref()
    let selectedDays = ref([])
    let volunteerNextView = ref(1)
    let alertDialog = ref(false)
    let declineId = ref()
    let declineOrApprove = ref(false)
    let resposiveMobileRight = ref(true)
    let resposiveMobileLeft = ref(true)
    let carousel = ref(false)
    let slide = ref(1)

    let pendingOption = ref([
      'Pet adoption',
      'Rescue report',
      'Volunteer application',
      'In kind donation',
      'Donations',
    ])
    let mobileControlLeft = () => {
      if (resposiveMobileRight.value == true) {
        resposiveMobileRight.value = false
        resposiveMobileLeft.value = true
      }
    }
    let mobileControlRight = () => {
      if (resposiveMobileRight.value == false) {
        resposiveMobileRight.value = true
        resposiveMobileLeft.value = false
      }
    }
    let approveRequestShortKey = (index) => {
      declineOrApprove.value = null
      alertDialog.value = true
      declineId.value = adoptionRequest.value[index].id
    }

    let viewDeclineDialog = (id) => {
      declineOrApprove.value = false
      alertDialog.value = true
      declineId.value = id
    }
    let viewDetails = (index, report_id) => {
      if (pending.value == 'Pet adoption') {
        adoptionDetails.value = adoptionRequest.value[index]
        nameDisplay.value = adoptionDetails.value.first_name + ' ' + adoptionDetails.value.last_name
        adoptionRequestProgressUpdate(adoptionDetails.value.id, 2)
      } else if (pending.value == 'Rescue report') {
        reportDetails.value = reportRequestData.value.data[index]
        reportImage.value = reportRequestData.value.image.filter(
          (obj) => obj.report_id === report_id,
        )
        nameDisplay.value = reportDetails.value.reporter_name
      } else if (pending.value == 'Volunteer application') {
        volunteerDetails.value = volunteerRequestData.value[index]
        nameDisplay.value =
          volunteerDetails.value.first_name + ' ' + volunteerDetails.value.last_name
        selectedDays.value = volunteerDetails.value.most_available_day.split(',')
        console.log(selectedDays.value)
      } else if (pending.value == 'In kind donation') {
        inKindDetails.value = pendingInKindDonations.value[index]
        inKindDetails.value.like_to_donate =
          inKindDetails.value.qty +
          ' ' +
          inKindDetails.value.qty_type +
          ' of ' +
          inKindDetails.value.donation_type
        nameDisplay.value = inKindDetails.value.name
      } else if (pending.value == 'Donations') {
        donationDetails.value = pendingDonations.value[index]
        nameDisplay.value = donationDetails.value.name
      }
      mobileControlRight()
    }
    let declineRequest = () => {
      if (pending.value == 'Pet adoption') {
        declineAdoptionRequest(declineId.value)
        adoptionDetails.value = []
      } else if (pending.value == 'Rescue report') {
        declineRescueRequest(declineId.value)
        reportDetails.value = []
      } else if (pending.value == 'Volunteer application') {
        declineVolunteerRequest(declineId.value)
        volunteerDetails.value = []
      } else if (pending.value == 'In kind donation') {
        declineInKindDonation(declineId.value)
        inKindDetails.value = []
      } else if (pending.value == 'Donations') {
        declineDonation(declineId.value)
        donationDetails.value = []
      }
      if (window.innerWidth < 501) {
        mobileControlLeft()
      }
      nameDisplay.value = null
    }
    let approveRequest = (id) => {
      declineOrApprove.value = true
      alertDialog.value = true
      if (pending.value == 'Pet adoption') {
        approveAdoptionRequest(id)
        adoptionRequestProgressUpdate(id, 4)
        adoptionDetails.value = []
      } else if (pending.value == 'Rescue report') {
        approveRescueRequest(id)
        reportDetails.value = []
      } else if (pending.value == 'Volunteer application') {
        approveVolunteerRequest(id)
        volunteerDetails.value = []
      } else if (pending.value == 'In kind donation') {
        approveInKindDonation(id)
        inKindDetails.value = []
      } else if (pending.value == 'Donations') {
        approveDonation(id)
        donationDetails.value = []
      }
      if (window.innerWidth < 501) {
        mobileControlLeft()
      }
      nameDisplay.value = null
    }
    let enlargeImage = ref([])
    let viewImage = (image, index) => {
      enlargeImage.value = []
      carousel.value = true
      if (Array.isArray(image)) {
        slide.value = index
        for (let i = 0; i < image.length; i++) {
          enlargeImage.value.push(image[i].image)
        }
      } else {
        slide.value = 0
        enlargeImage.value.push(image)
      }
    }
    function timeAgo(date, time) {
      var now = new Date()
      var past = new Date(date + 'T' + time)
      var seconds = Math.floor((now - past) / 1000)

      var interval = seconds / 31536000

      if (interval > 1) {
        return Math.floor(interval) + ' years ago'
      }
      interval = seconds / 2592000
      if (interval > 1) {
        return Math.floor(interval) + ' months ago'
      }
      interval = seconds / 604800
      if (interval > 1) {
        return Math.floor(interval) + ' weeks ago'
      }
      interval = seconds / 86400
      if (interval > 1) {
        return Math.floor(interval) + ' days ago'
      }
      interval = seconds / 3600
      if (interval > 1) {
        return Math.floor(interval) + ' hours ago'
      }
      interval = seconds / 60
      if (interval > 1) {
        return Math.floor(interval) + ' minutes ago'
      }
      return Math.floor(seconds) + ' seconds ago'
    }
    let windowResize = () => {
      let width = window.innerWidth
      if (width <= 811) {
        resposiveMobileRight.value = false
      } else {
        resposiveMobileRight.value = true
        resposiveMobileLeft.value = true
      }
    }

    onMounted(() => {
      window.addEventListener('resize', windowResize)
      windowResize()
      getAdoptionRequest()
      getReportRequest()
      getVolunteerRequest()
      getPendingInKindDonations()
      getPendingDonations()
    })
    onUnmounted(() => {
      window.removeEventListener('resize', windowResize)
    })
    return {
      enlargeImage,
      slide,
      viewImage,
      carousel,
      viewDetails,
      approveAdoptionRequest,
      adoptionDetails,
      timeAgo,
      pending,
      adoptionRequest,
      pendingOption,
      reportRequestData,
      pendingDonations,
      reportDetails,
      reportImage,
      nameDisplay,
      volunteerRequestData,
      volunteerNextView,
      volunteerDetails,
      pendingInKindDonations,
      days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      hours: ['1 hour', '2 hour', '3 hour', '4 hour', '5 hour'],
      selectedDays,
      inKindDetails,
      declineId,
      donationDetails,
      alertDialog,
      declineRequest,
      declineOrApprove,
      approveRequest,
      mobileControlLeft,
      resposiveMobileRight,
      resposiveMobileLeft,
      approveRequestShortKey,
      viewDeclineDialog,
      showNotif() {
        $q.notify({
          message: 'Please choose an applicant first!',
          color: 'orange',
          position: 'top',
          textColor: 'white',
        })
      },
    }
  },
}
