import { ref, onMounted, onUnmounted, watch } from 'vue'
import BarChartsRescue from 'src/components/BarChartsRescue.vue'
import {
  allUser,
  updateOfficialAccount,
  updateVolunteerAccount,
  allUserData,
  allTaaraOfficialsInfo,
  allVolunteersInfo,
  allTaaraOfficials,
  allVolunteers,
  accountMaintenanceBasicSearch,
  systemActivityData,
  getSystemActivity,
  grantPrivilege,
  logInDetails,
  activateAccount,
  deleteOfficialActivity,
  OfficialAuthorization,
  addOrganizationAccount,
} from 'src/composable/taaraComposable.js'
import { resizeImage, dateToday } from 'src/composable/simpleComposable.js'
export default {
  components: {
    BarChartsRescue,
  },
  setup() {
    let isActive = ref(1)
    let searchUser = ref({ search: null })
    let viewAccount = ref(false)
    let tab = ref(0)
    let expandDetails = ref(false)
    let passVisivility = ref(true)
    let adjustPrivilege = ref(true)
    let viewOrAdd = ref(false)
    let editEmailPass = ref(false)
    let alertDelete = ref(false)
    let deletePropHolder = ref()
    logInDetails.value = JSON.parse(localStorage.getItem('logInDetails'))
    let profileDetailsHolder = ref({})

    const addBtn = () => {
      profileDetailsHolder.value = {
        system_privilege: {
          account_setting: {
            create: 0,
            read: 1,
            update: 0,
            delete: 0,
          },
          pet_information: {
            create: 0,
            read: 1,
            update: 0,
            delete: 0,
          },
          financial_report: {
            create: 0,
            read: 1,
            update: 0,
            delete: 0,
          },
          records: {
            create: 0,
            read: 1,
            update: 0,
            delete: 0,
          },
          daily_reports: {
            create: 0,
            read: 1,
            update: 0,
            delete: 0,
          },
          fund_raiser: {
            create: 0,
            read: 1,
            update: 0,
            delete: 0,
          },
          inventories: {
            create: 0,
            read: 1,
            update: 0,
            delete: 0,
          },
          certificates: {
            create: 0,
            read: 1,
            update: 0,
            delete: 0,
          },
          pending_application: {
            create: 0,
            read: 1,
            update: 0,
            delete: 0,
          },
        },
        date_created: dateToday,
      }
      viewAccount.value = true
      viewOrAdd.value = true
      tab.value = 0
    }
    const addAccount = (data) => {
      if (data.image != null) {
        viewAccount.value = false
        viewOrAdd.value = false
        let addTo = isActive.value == 1 ? 'Official' : 'Volunteer'
        addOrganizationAccount(data, addTo)
      }
    }
    let imageShow = () => {
      document.getElementById('file').click()
    }
    const handleFileUpload = (event, param) => {
      const files = event.target.files
      const file = files[0]

      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => {
        resizeImage(file, 500, 500)
          .then(({ dataUrl, fileName }) => {
            if (param == 'profileImage') {
              profileDetailsHolder.value.image = dataUrl
              console.log(dataUrl)
            }
            //  else {
            //   userInfo.value.valid_id = dataUrl;
            // }
          })
          .catch((error) => {
            console.error(error)
          })
      }
    }
    const viewDetails = (accountData) => {
      profileDetailsHolder.value = accountData
      console.log(profileDetailsHolder.value)
      viewAccount.value = true
      viewOrAdd.value = false
      getSystemActivity(accountData.id)
    }
    const clickDeleteBtn = (prop) => {
      deletePropHolder.value = prop
      alertDelete.value = true
    }
    const confirmDelete = () => {
      alertDelete.value = false
      deleteOfficialActivity(deletePropHolder.value)
    }
    const updateBtn = (data) => {
      editEmailPass.value = false
      OfficialAuthorization(data)
    }

    let checkPrivilege = (based, param) => {
      if (logInDetails.value[0].position == 'Taara Head')
        if (based == 'grantPrivilege') {
          grantPrivilege(param)
        } else if (based == 'activated') {
          activateAccount(param)
            .then((response) => {
              if (response.status == 'success') {
                profileDetailsHolder.value.activated = response.activated
              }
            })
            .catch((error) => {
              console.log(error)
            })
        }
    }
    let summarizePrivilege = (privilege) => {
      let summary = ''
      for (let key in privilege) {
        if (privilege[key].create === 1) {
          summary += 'C'
          break
        }
      }
      for (let key in privilege) {
        if (privilege[key].read === 1) {
          summary += 'r'
          break
        }
      }
      for (let key in privilege) {
        if (privilege[key].update === 1) {
          summary += 'u'
          break
        }
      }
      for (let key in privilege) {
        if (privilege[key].delete === 1) {
          summary += 'd'
          break
        }
      }
      return summary
    }

    const columnsUserAcc = [
      {
        name: 'user_id',
        align: 'center',
        label: 'Id',
        field: 'user_id',
        sortable: true,
      },

      {
        name: 'image',
        align: 'center',
        label: '',
        field: 'image',
        sortable: true,
      },
      {
        name: 'first_name',
        align: 'center',
        label: 'Name',
        field: 'first_name',
        sortable: true,
      },

      {
        name: 'email_address',
        align: 'center',
        label: 'Email Address',
        field: 'email_address',
        sortable: true,
      },
      {
        name: 'phone_number',
        align: 'center',
        label: 'Phone Number',
        field: 'phone_number',
        sortable: true,
      },
      {
        name: 'date_created',
        align: 'center',
        label: 'Date Created',
        field: 'date_created',
        sortable: true,
      },
      {
        name: 'action',
        align: 'center',
        label: 'Action',
        field: 'action',
        sortable: true,
      },
    ]
    const rowUserAcc = allUserData
    const columns = [
      {
        name: 'id',
        align: 'center',
        label: 'Id',
        field: 'id',
        sortable: true,
      },

      {
        name: 'image',
        align: 'center',
        label: '',
        field: 'image',
        sortable: true,
      },
      {
        name: 'first_name',
        align: 'center',
        label: 'Name',
        field: 'first_name',
        sortable: true,
      },

      {
        name: 'position',
        align: 'center',
        label: 'Position',
        field: 'position',
        sortable: true,
      },
      {
        name: 'email_address',
        align: 'center',
        label: 'Email Address',
        field: 'email_address',
        sortable: true,
      },
      {
        name: 'phone_number',
        align: 'center',
        label: 'Phone Number',
        field: 'phone_number',
        sortable: true,
      },
      {
        name: 'date_created',
        align: 'center',
        label: 'Date Created',
        field: 'date_created',
        sortable: true,
      },
      {
        name: 'action',
        align: 'center',
        label: 'Action',
        field: 'action',
        sortable: true,
      },
    ]
    const row = allTaaraOfficialsInfo
    const columnSystemActivity = [
      {
        name: 'activity',
        align: 'center',
        label: 'Activity Name',
        field: 'activity',
        sortable: true,
      },

      {
        name: 'operation',
        align: 'center',
        label: 'Operation',
        field: 'operation',
        sortable: true,
      },
      {
        name: 'date',
        align: 'center',
        label: 'Date',
        field: 'date',
        sortable: true,
      },

      {
        name: 'time',
        align: 'center',
        label: 'Time',
        field: 'time',
        sortable: true,
      },

      {
        name: 'action',
        align: 'center',
        label: 'Action',
        field: 'action',
        sortable: true,
      },
    ]
    onMounted(() => {
      allTaaraOfficials()
      allUser()
      allVolunteers()
    })
    watch(searchUser.value, (newVal) => {
      accountMaintenanceBasicSearch(searchUser.value.search, isActive.value)
    })

    return {
      columns,
      row,
      addBtn,
      profileDetailsHolder,
      allVolunteersInfo,
      allTaaraOfficialsInfo,
      allUserData,
      updateOfficialAccount,
      updateVolunteerAccount,
      civilStatusOption: ['Single', 'Married', 'Divorced'],
      sexOption: ['Male', 'Female'],
      isActive,
      columnsUserAcc,
      rowUserAcc,
      searchUser,
      viewAccount,
      viewDetails,
      tab,
      expandDetails,
      getSystemActivity,
      columnSystemActivity,
      systemActivityData,

      grantPrivilege,
      logInDetails,
      checkPrivilege,
      passVisivility,
      adjustPrivilege,
      editEmailPass,
      summarizePrivilege,
      alertDelete,
      clickDeleteBtn,
      confirmDelete,
      OfficialAuthorization,
      updateBtn,
      viewOrAdd,
      addAccount,
      imageShow,
      handleFileUpload,
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
      suffix_options: [
        {
          label: 'Jr',
          value: 'Jr',
        },
        {
          label: 'Sr',
          value: 'Sr',
        },
        {
          label: '||(second)',
          value: '||',
        },
        {
          label: 'Jd(Juris Doctor)',
          value: 'Jd',
        },
        {
          label: 'MBA(Master in Business Administration)',
          value: 'MBA',
        },
        {
          label: 'Ph.D(Philosophical Doctor)',
          value: 'Ph.D',
        },
      ],
    }
  },
}
