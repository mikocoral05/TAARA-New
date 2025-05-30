import { api, imageUrl } from 'src/boot/axios'
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

export const updateBudgetAllocation = async (obj) => {
  const { id, ...data } = obj
  const response = await api.put('budget_expenses.php', {
    update_buget_allocation: { id: id, data: data },
  })
  return response.data
}

export const updateExpense = async (obj) => {
  const { id, ...data } = obj
  const response = await api.put('budget_expenses.php', {
    update_expense: { id: id, data: data },
  })
  return response.data
}

export const addBudgetAllocation = async (data) => {
  const response = await api.post('budget_expenses.php', {
    add_budget_allocation: data,
  })
  return response.data
}

export const addExpense = async (data) => {
  const response = await api.post('budget_expenses.php', {
    add_expense: data,
  })
  return response.data
}

export const softDeleteBudgetAndExpenses = async (arrayId, tableName) => {
  const response = await api.put('budget_expenses.php', {
    soft_delete_budget_expenses: arrayId,
    table: tableName,
  })
  return response.data
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

export const getAnimalByHealtStatus = async (year, month, operation, health_status) => {
  const reponse = await api.get('report.php', {
    params: { get_animal_list: { year, month, operation, health_status } },
  })

  return reponse.data.data
}
export const getTotalAdopted = async (year, month, operation) => {
  const reponse = await api.get('report.php', {
    params: { get_total_adopted: { year, month, operation } },
  })

  return reponse.data.data
}
export const getPetAvailable = async (year, month, operation) => {
  const reponse = await api.get('report.php', {
    params: { get_pet_available: { year, month, operation } },
  })

  return reponse.data.data
}
export const getOverallRescue = async (year, month, operation) => {
  const reponse = await api.get('report.php', {
    params: { get_overall_rescue: { year, month, operation } },
  })

  return reponse.data.data
}
export const getFrequentLocation = async () => {
  const reponse = await api.get('report.php', {
    params: { get_frequent_location: 'get_frequent_location' },
  })

  return reponse.data.data
}
export const getClassification = async (year, month, operation) => {
  const reponse = await api.get('report.php', {
    params: { get_classification: { year, month, operation } },
  })

  return reponse.data
}

export const getMonthlyRescue = async (year) => {
  const reponse = await api.get('report.php', {
    params: { get_monthly_rescue: year },
  })

  return reponse.data.data
}

export const getMonthlyDonation = async (year) => {
  const reponse = await api.get('report.php', {
    params: { get_monthly_donation: year },
  })

  return reponse.data.data
}
export const getMonthlyExpense = async (year) => {
  const reponse = await api.get('report.php', {
    params: { get_monthly_expense: year },
  })

  return reponse.data.data
}
export const getMonthlyBalance = async (year) => {
  const reponse = await api.get('report.php', {
    params: { get_monthly_balance: year },
  })

  return reponse.data.data
}

export const getMonthlyPetAvailble = async (year) => {
  const reponse = await api.get('report.php', {
    params: { get_monthly_pet_available: year },
  })

  return reponse.data.data
}

export const getMonthlyAdopted = async (year) => {
  const reponse = await api.get('report.php', {
    params: { get_monthly_adopted: year },
  })

  return reponse.data.data
}

export const getMonthlyDeceased = async (year) => {
  const reponse = await api.get('report.php', {
    params: { get_monthly_deceased: year },
  })

  return reponse.data.data
}

export const getExpenseSummary = async (year, month, operation) => {
  const reponse = await api.get('report.php', {
    params: { get_expense_summary: { year, month, operation } },
  })

  return reponse.data.data
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

export const uploadImages = async (fileArray) => {
  const formData = new FormData()
  console.log('Uploading files:', fileArray)

  fileArray.forEach((metaFile) => {
    // Check if `file` is a File instance
    if (metaFile.file instanceof File) {
      formData.append('images', metaFile.file)
    }
    // If the object itself is a File instance (rare here)
    else if (metaFile instanceof File) {
      formData.append('images', metaFile)
    } else {
      console.warn('Skipping invalid file entry:', metaFile)
    }
  })

  return await imageUrl.post('', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

const saveAnimalDetail = (obj) => {
  const { file, ...animalData } = obj // separate the files
  return new Promise((resolve, reject) => {
    api
      .post('pet_info.php', {
        save_animal_list: animalData,
      })
      .then(async (response) => {
        if (response.data.status == 'success') {
          const idToUpdate = response.data.id
          const res = await uploadImages(file)
          const status = await updateImage(res.data.images, idToUpdate)
          console.log(status)
          resolve({ status: status, message: response.data.message })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const updateImage = async (array, id, arrayOfId) => {
  const response = await api.put('pet_info.php', {
    update_image: array,
    id: id,
    existing_id: arrayOfId,
  })
  return response.data.status
}

export const editAnimalInfo = (obj) => {
  const { file, toRemoveId, ...animal_data } = obj
  return new Promise((resolve, reject) => {
    api
      .put('pet_info.php', {
        edit_animal_info: animal_data,
      })
      .then(async (response) => {
        if (response.data.status == 'success') {
          if (toRemoveId?.length > 0) {
            const getFileId = file.filter((obj) => obj.id != null).map((obj) => obj.id)
            if (getFileId?.length > 0) {
              const getNewFile = file.filter((obj) => obj.id == null)
              const res = await uploadImages(getNewFile)
              const status = await updateImage(res.data.images, obj.animal_id, getFileId)
              console.log(status)
              resolve({ status: status, message: response.data.message })
              console.log(res)
            }
          }
        }
        resolve(response.data)
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

export const uploadAnimalImages = (fileArray, animal_id) => {
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

const getWishlist = async (table) => {
  const response = await api.get('wishlist_management.php', {
    params: { get_wishlist: table },
  })

  if (response.data.status === 'success') {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Unexpected response status')
  }
}

const updateWishlist = async (table, obj) => {
  const response = await api.put('wishlist_management.php', {
    update_wishlist: { table: table, data: obj },
  })
  return response.data
}

const deleteWishlist = async (table, arrayId) => {
  const response = await api.put('wishlist_management.php', {
    delete_wishlist: { table: table, id: arrayId },
  })
  return response.data
}

const addWishlist = async (obj) => {
  const response = await api.post('wishlist_management.php', {
    add_wishlist: obj,
  })
  return response.data
}

export {
  addWishlist,
  deleteWishlist,
  updateWishlist,
  getWishlist,
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
