import { defineComponent, onMounted, ref } from 'vue'
import taaraFooter from 'src/components/taaraFooter.vue'
import { globalStore } from 'src/stores/global-store'
import { useQuasar } from 'quasar'
import { addVolunteerRequest, checkIfVolunteer } from 'src/composable/latestComposable'
export default defineComponent({
  components: {
    taaraFooter,
  },
  setup() {
    const $q = useQuasar()
    const store = globalStore()
    const registrationStatus = ref(1)
    let step = ref(1)
    const chooseWork = ref([])
    const group = ref([])
    const options = [
      {
        label: 'Monday',
        value: 'Monday',
      },
      {
        label: 'Tuesday',
        value: 'Tuesday',
      },
      {
        label: 'Wednesday',
        value: 'Wednesday',
      },
      {
        label: 'Thursday',
        value: 'Thursday',
      },
      {
        label: 'Friday',
        value: 'Friday',
      },
      {
        label: 'Saturday',
        value: 'Saturday',
      },
      {
        label: 'Sunday',
        value: 'Sunday',
      },
    ]

    const volunteer_form = ref({
      member_of_welfare_org: null,
      have_pets: null,
      have_children: null,
      experience_in_recue: null,
      experience_details: null,
      vaccinated_anti_rabies: null,
      willing_to_be_vaccinated: null,
      family_favor_being_volunteer: null,
      related_member_in_organization: null,
      related_member_in_organization_name: null,
      related_member_in_organization_relationship: null,
      how_know_organization: null,
      most_available_day: null,
      most_available_time: null,
      formal_education_pet_care: null,
      done_any_other_volunteer_work: null,
      done_any_other_volunteer_work_indicate: null,
      physical_psychological_limitation: null,
      physical_psychological_limitation_indicate: null,
      contact_person_emergency_name: null,
      contact_person_emergency_number: null,
      contact_person_emergency_relationship: null,
      field_or_virtual_committee: null,
      field_or_virtual_committee_position: null,
      have_vehicle: null,
      vehicle_type: null,
      experience_managing_social_media: null,
      software_use_in_design: null,
      have_internet_connection: null,
      device_use: null,
      device_use_willing_to_use: null,
      volunteer_form_id: null,
    })

    const userVolunteerData = ref({
      user_id: store.userData?.user_id ?? null,
      first_name: store.userData?.first_name,
      last_name: store.userData?.first_name,
      sex: store.userData?.sex,
      birth_date: store.userData?.birth_date,
      phone_number: store.userData?.phone_number,
      occupation: store.userData?.occupation,
      civil_status: store.userData?.civil_status,
      street: store.userData?.street,
      brgy_name: store.userData?.brgy_name,
      city_municipality: store.userData?.city_municipality,
      province: store.userData?.province,
    })

    let agree = ref(null)
    let valueMove = ref(0)
    let warning = ref('')
    let moveSecond = () => {
      let checkKeys = ref([
        'member_of_welfare_org',
        'have_pets',
        'have_children',
        'experience_in_recue',
        'vaccinated_anti_rabies',
        'willing_to_be_vaccinated',
        'family_favor_being_volunteer',
        'related_member_in_organization',
        'most_available_day',
        'most_available_time',
      ])
      let isNull = checkKeys.value.some(
        (key) => volunteer_form.value[key] === null || volunteer_form.value[key] === '',
      )
      if (isNull == false) {
        valueMove.value = 1
        warning.value = false
      } else {
        warning.value = true
      }
    }

    let moveThird = () => {
      let checkKeys = ref([
        'formal_education_pet_care',
        'field_or_virtual_committee',
        'done_any_other_volunteer_work',
        'physical_psychological_limitation',
      ])
      let isNull = checkKeys.value.some((key) => volunteer_form.value[key] === null)
      if (isNull == false) {
        warning.value = false
        if (volunteer_form.value.field_or_virtual_committee == 'Field Committee') {
          valueMove.value = 2
          chooseWork.value = []
          let arrayKeys = [
            'experience_managing_social_media',
            'software_use_in_design',
            'have_internet_connection',
            'device_use',
            'device_use_willing_to_use',
            'field_or_virtual_committee_position',
          ]
          for (let key of arrayKeys) {
            volunteer_form.value[key] = null
          }
        } else if (volunteer_form.value.field_or_virtual_committee == 'Virtual Committee') {
          valueMove.value = 3
          chooseWork.value = []
          let arrayKeys = ['have_vehicle', 'vehicle_type', 'field_or_virtual_committee_position']
          for (let key of arrayKeys) {
            volunteer_form.value[key] = null
          }
        }
      } else {
        warning.value = true
      }
    }

    let moveFourth = () => {
      if (
        volunteer_form.value.field_or_virtual_committee_position == null ||
        volunteer_form.value.field_or_virtual_committee_position == ''
      ) {
        warning.value = true
      } else {
        warning.value = false
        valueMove.value = 4
        console.log(volunteer_form.value.field_or_virtual_committee_position)
      }
    }

    let moveFourth2 = () => {
      let checkKeys = ref([
        'field_or_virtual_committee_position',
        'experience_managing_social_media',
        'device_use',
        'device_use_willing_to_use',
      ])
      let isNull = checkKeys.value.some((key) => volunteer_form.value[key] === null)
      if (isNull == true) {
        warning.value = true
      } else {
        valueMove.value = 4
        warning.value = false
      }
    }

    let backCommittee = () => {
      if (volunteer_form.value.field_or_virtual_committee == 'Field Committee') {
        valueMove.value = 2
      } else {
        valueMove.value = 3
        volunteer_form.value.field_or_virtual_committee == 'Virtual Committe'
      }
    }

    let agreeMove = () => {
      $q.loading.show({ group: 'register', message: 'Registering as volunteer. Please wait...' })

      addVolunteerRequest(volunteer_form.value, userVolunteerData.value).then((response) => {
        console.log(response)
        $q.loading.show({ group: 'register', message: response.message })
        setTimeout(() => {
          $q.loading.hide()
        }, 1000)
      })
    }

    onMounted(() => {
      if (store.userData?.user_id)
        checkIfVolunteer(store.userData?.user_id).then((response) => {
          console.log(response)
        })
    })
    return {
      store,
      registrationStatus,
      userVolunteerData,
      options,
      step,
      group,
      agree,
      volunteer_form,
      agreeMove,
      backCommittee,
      moveFourth2,
      moveFourth,
      moveThird,
      warning,
      valueMove,
      moveSecond,
      chooseWork,
      sex_options: [
        {
          label: 'Male',
          value: 'Male',
        },
        {
          label: 'Female',
          value: 'Female',
        },
      ],
      civil_status_options: [
        {
          label: 'Single',
          value: 'Single',
        },
        {
          label: 'Married',
          value: 'Married',
        },
        {
          label: 'Seperated',
          value: 'Seperated',
        },
      ],
      // shape,
    }
  },
})
