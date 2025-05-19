import { api } from 'src/boot/axios'
import { dateToday } from 'src/composable/simpleComposable'
import { globalStore } from 'src/stores/global-store'
const store = globalStore()
const getUserByType = (type) => {
  return new Promise((resolve, reject) => {
    api
      .get('authorization.php', {
        params: { get_user_by_type: type },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getPendingRescueReport = () => {
  return new Promise((resolve, reject) => {
    api
      .get('rescue_report.php', {
        params: { get_pending_rescue_report: 'get_pending_rescue_report' },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          store.pendingRescueReport = response.data.count
          resolve(response.data.count)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getPendingVolunteer = () => {
  return new Promise((resolve, reject) => {
    api
      .get('authorization.php', {
        params: { get_pending_volunteer: 'get_pending_volunteer' },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          store.pendingVolunteer = response.data.count
          resolve(response.data.count)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const checkIfVolunteer = (user_id) => {
  return new Promise((resolve, reject) => {
    api
      .get('volunteer_public.php', {
        params: { get_if_volunteer: user_id },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const addVolunteerRequest = (volunteer_form, userVolunteerData) => {
  return new Promise((resolve, reject) => {
    api
      .post('volunteer_public.php', {
        volunteer_request: { user_data: userVolunteerData, form_data: volunteer_form },
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getActivitiesAndEvents = () => {
  return new Promise((resolve, reject) => {
    api
      .get('activities_and_events.php', {
        params: { get_activities_and_events: 'get_activities_and_events' },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          store.pendingRescueReport = response.data.count
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getDonation = (type) => {
  return new Promise((resolve, reject) => {
    api
      .get('donation.php', {
        params: { get_donation: type },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getAnnouncement = () => {
  return new Promise((resolve, reject) => {
    api
      .get('announcement.php', {
        params: { get_announcement: 'get_announcement' },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getRescueReport = () => {
  return new Promise((resolve, reject) => {
    api
      .get('rescue_report.php', {
        params: { get_rescue_report: 'rescue_report' },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const updateUser = (data) => {
  const clone = { ...data }
  clone.page_access = JSON.stringify(clone.page_access)
  return new Promise((resolve, reject) => {
    api
      .put('authorization.php', {
        updateUser: clone,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getPageAccess = () => {
  return new Promise((resolve, reject) => {
    api
      .get('authorization.php', {
        params: { get_page_access: 'get_page_access' },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getBudgetAllocation = () => {
  return new Promise((resolve, reject) => {
    api
      .get('budget_expenses.php', {
        params: { get_budget_allocation: 'get_budget_allocation' },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getExpenses = (obj) => {
  return new Promise((resolve, reject) => {
    api
      .get('budget_expenses.php', {
        params: { get_expenses: obj },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getExpensesSummary = (obj) => {
  return new Promise((resolve, reject) => {
    api
      .get('budget_expenses.php', {
        params: { get_expenses_summary: obj },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getTotalBalance = (obj) => {
  return new Promise((resolve, reject) => {
    api
      .get('budget_expenses.php', {
        params: { get_total_balance: obj },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getMonthlyFundAndExpenses = (obj) => {
  return new Promise((resolve, reject) => {
    api
      .get('budget_expenses.php', {
        params: {
          get_monthly_funds_and_expenses: obj,
        },
      })
      .then((response) => {
        const data = response.data.data || []

        const numberOfDays = new Date(obj.year, obj.month, 0).getDate()
        const dailyTotal = Array.from({ length: numberOfDays }, (_, i) => ({
          day: i + 1,
          total: 0,
        }))
        let monthlyTotalExpense = 0

        data.forEach((purchase) => {
          const day = new Date(purchase.expense_date).getDate()
          const amount = Number(purchase.expense_total || purchase.amount || 0)

          const dayObject = dailyTotal.find((d) => d.day === day)
          if (dayObject) {
            dayObject.total += amount
            monthlyTotalExpense += amount
          }
        })

        resolve({
          dailyTotal,
          monthlyTotalExpense,
        })
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getInventoryList = (category) => {
  return new Promise((resolve, reject) => {
    api
      .get('inventory.php', {
        params: { get_inventory_list: category },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getAnimalList = (healt_status) => {
  return new Promise((resolve, reject) => {
    api
      .get('pet_info.php', {
        params: { get_animal_list: healt_status },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getSchedule = () => {
  return new Promise((resolve, reject) => {
    api
      .get('schedule.php', {
        params: { get_schedule: 'get_schedule' },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getAnimalOption = () => {
  return new Promise((resolve, reject) => {
    api
      .get('schedule.php', {
        params: { get_animal_option: 'get_animal_option' },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const saveAnimalDetail = (obj) => {
  const { file, ...animalData } = obj // separate the files
  return new Promise((resolve, reject) => {
    api
      .post('pet_info.php', {
        save_animal_list: animalData,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          console.log(file)
          uploadAnimalImages(file, response.data.id).then((res) => {
            console.log(res.data)
          })
          resolve(response.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const saveActivitiesAndEvents = (obj) => {
  const { file, ...data } = obj // separate the files
  return new Promise((resolve, reject) => {
    api
      .post('activities_and_events.php', {
        save_activities_and_events: data,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          if (file) {
            // uploadAnimalImages(file, response.data.id).then((res) => {
            //   console.log(res.data)
            // })
          }
          resolve(response.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const uploadAnimalImages = (fileArray, animal_id) => {
  const formData = new FormData()
  fileArray.forEach((fileObj) => {
    formData.append('files[]', fileObj) // 👈 FIXED: the File itself
    formData.append('__key[]', fileObj.__key || '') // optional
  })
  formData.append('animal_id', animal_id) // 👈 include animal_id
  return api.post('image-upload.php', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

const uploadFiles = (fileArray, record_id, table, id_column, column_name) => {
  const formData = new FormData()

  // Append files
  fileArray.forEach((fileObj) => {
    formData.append('files[]', fileObj) // 📌 The actual File
  })

  // Append necessary data for server processing
  formData.append('record_id', record_id)
  formData.append('table', table)
  formData.append('id_column', id_column)
  formData.append('column_to_update', column_name)

  return api.post('file-upload.php', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

const getInventoryExpiredList = (category) => {
  return new Promise((resolve, reject) => {
    api
      .get('inventory.php', {
        params: { get_inventory_expired_list: category },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getInventoryListSummary = (category) => {
  return new Promise((resolve, reject) => {
    api
      .get('inventory.php', {
        params: { get_inventory_list_summary: category },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getInventoryGroup = (category) => {
  return new Promise((resolve, reject) => {
    api
      .get('inventory.php', {
        params: { get_inventory_group: category },
      })
      .then((response) => {
        if (response.data.status == 'success') {
          resolve(response.data.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const softDeleteInventoryData = (arrayId, tableName) => {
  return new Promise((resolve, reject) => {
    api
      .put('inventory.php', {
        soft_delete_inventory_data: arrayId,
        table: tableName,
      })
      .then((response) => {
        resolve(response.data.status)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const softDeleteSchedule = (arrayId) => {
  return new Promise((resolve, reject) => {
    api
      .put('schedule.php', {
        soft_delete_schedule: arrayId,
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const editAnimalInfo = (obj) => {
  const { file, toRemoveId, ...animal_data } = obj
  return new Promise((resolve, reject) => {
    api
      .put('pet_info.php', {
        edit_animal_info: animal_data,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          if (toRemoveId?.length > 0) {
            console.log(file)
          }
        }
        resolve(response.data.status)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const softDeleteUser = (arrayId) => {
  return new Promise((resolve, reject) => {
    api
      .put('authorization.php', {
        soft_delete_user: arrayId,
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const softDeleteAnimal = (arrayId) => {
  return new Promise((resolve, reject) => {
    api
      .put('pet_info.php', {
        soft_delete_animal_info: arrayId,
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const addInventoryList = (obj) => {
  obj.date_received = dateToday
  return new Promise((resolve, reject) => {
    api
      .post('inventory.php', {
        add_inventory_list: obj,
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const addSchedule = (obj) => {
  return new Promise((resolve, reject) => {
    api
      .post('schedule.php', {
        add_schedule: obj,
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const addAnnouncement = (obj) => {
  const { file, ...data } = obj
  return new Promise((resolve, reject) => {
    api
      .post('announcement.php', {
        add_announcement: data,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          if (file) {
            uploadFiles([file], response.data.id, 'tbl_announcements', 'id', 'img_id').then(
              (response) => {
                console.log(response)
              },
            )
          }
          resolve(response.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const addRescueRerport = (obj) => {
  const { file, ...data } = obj
  return new Promise((resolve, reject) => {
    api
      .post('rescue_report.php', {
        add_rescue_report: data,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          if (file) {
            uploadFiles([file], response.data.id, 'tbl_rescue_report', 'id', 'img_id').then(
              (response) => {
                console.log(response)
              },
            )
          }
          getPendingRescueReport()
          resolve(response.data)
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const editAnnouncement = (obj) => {
  const { file, ...data } = obj
  return new Promise((resolve, reject) => {
    api
      .put('announcement.php', {
        edit_announcement: data,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          if (file) {
            uploadFiles([file], data.id, 'tbl_announcements', 'id', 'img_id').then((response) => {
              console.log(response)
            })
          }
        }
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const editRescueReport = (obj) => {
  const { file, ...data } = obj
  return new Promise((resolve, reject) => {
    api
      .put('rescue_report.php', {
        edit_rescue_report: data,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          if (file) {
            uploadFiles([file], data.id, 'tbl_rescue_report', 'id', 'img_id').then((response) => {
              console.log(response)
            })
          }
        }
        getPendingRescueReport()
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const softDeleteAnnouncement = (arrayId) => {
  return new Promise((resolve, reject) => {
    api
      .put('announcement.php', {
        soft_delete_announcement: arrayId,
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const softDeleteRescueReport = (arrayId) => {
  return new Promise((resolve, reject) => {
    api
      .put('rescue_report.php', {
        soft_delete_rescue_report: arrayId,
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const addGroupName = (obj) => {
  console.log(obj)

  return new Promise((resolve, reject) => {
    api
      .post('inventory.php', {
        add_group_name: obj,
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const editInventoryList = (obj) => {
  return new Promise((resolve, reject) => {
    api
      .put('inventory.php', {
        edit_inventory_list: obj,
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const logIn = (obj) => {
  return new Promise((resolve, reject) => {
    api
      .get('login.php', {
        params: { login: obj },
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

const getTotalUser = async () => {
  const response = await api.get('dashboard.php', {
    params: { get_user_sum: 'get_user_sum' },
  })

  if (response.data.status === 'success') {
    return response.data.count
  } else {
    throw new Error(response.data.message || 'Unexpected response status')
  }
}
const getTotalAnimalCount = async () => {
  const response = await api.get('dashboard.php', {
    params: { get_count_animals: 'get_user_sum' },
  })

  if (response.data.status === 'success') {
    return response.data.count
  } else {
    throw new Error(response.data.message || 'Unexpected response status')
  }
}

export {
  getTotalAnimalCount,
  getTotalUser,
  addVolunteerRequest,
  checkIfVolunteer,
  getPendingVolunteer,
  logIn,
  saveActivitiesAndEvents,
  getActivitiesAndEvents,
  getPendingRescueReport,
  editRescueReport,
  addRescueRerport,
  softDeleteRescueReport,
  getRescueReport,
  softDeleteAnnouncement,
  editAnnouncement,
  addAnnouncement,
  getAnnouncement,
  getDonation,
  softDeleteSchedule,
  addSchedule,
  getSchedule,
  getAnimalOption,
  editAnimalInfo,
  saveAnimalDetail,
  getAnimalList,
  softDeleteUser,
  addGroupName,
  editInventoryList,
  addInventoryList,
  softDeleteInventoryData,
  getInventoryExpiredList,
  getInventoryListSummary,
  getInventoryGroup,
  softDeleteAnimal,
  getInventoryList,
  getMonthlyFundAndExpenses,
  getTotalBalance,
  getExpenses,
  getBudgetAllocation,
  getPageAccess,
  getUserByType,
  updateUser,
  getExpensesSummary,
}
