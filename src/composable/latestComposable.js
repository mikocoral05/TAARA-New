import { api, imageUrl, onlineEndpoint } from 'src/boot/axios'
import { dateToday, excelDateToISO } from 'src/composable/simpleComposable'
import { globalStore } from 'src/stores/global-store'
const store = globalStore()
import * as XLSX from 'xlsx'

export const getAddressFromCoords = async (lat, lng) => {
  const apiKey = 'a36536a501c740f3adddef512611e850'
  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`,
  )
  const data = await response.json()
  return data.results[0]?.formatted || 'Address not found'
}

export const exportToExcel = async (data, filename = 'data.xlsx') => {
  const worksheet = XLSX.utils.json_to_sheet(data)

  // Manually define column widths (number represents "characters")
  const maxWidths = Object.keys(data[0] || {}).map((key) => {
    const maxLength = Math.max(
      key.length,
      ...data.map((row) => (row[key] ? String(row[key]).length : 0)),
    )
    return { wch: maxLength + 5 } // Add padding
  })

  worksheet['!cols'] = maxWidths

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1')

  // Download the file
  XLSX.writeFile(workbook, filename)
}

export const downloadExampleExcelFormat = async (table, colums, excelName) => {
  const response = await api.get('excel.php', {
    params: { get_sample_format: { table, colums } },
  })

  exportToExcel(response.data.data, `${excelName}.xlsx`)
}

export const downloadReportAnimal = async (year) => {
  const response = await api.get('report.php', {
    params: { download_report_animal: year },
  })
  exportToExcel(response.data.data, `animal_report.xlsx`)
  return response.data
}
export const downloadReportBudget = async (year) => {
  const response = await api.get('report.php', {
    params: { download_report_budget: year },
  })
  exportToExcel(response.data.data, `budget_report.xlsx`)
  return response.data
}

export const uploadExcel = async (table, data, user_id, user_type, user_name) => {
  const processedPets = data.map((pet) => ({
    ...pet,
    date_of_birth: excelDateToISO(pet.date_of_birth),
    date_rescued: excelDateToISO(pet.date_rescued),
  }))
  const response = await api.post('excel.php', {
    upload_excel: { table, processedPets, user_id, user_type, user_name },
  })
  return response.data
}

export const readExcelFileToJson = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result)
      const workbook = XLSX.read(data, { type: 'array' })

      const sheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[sheetName]

      const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' }) // defval avoids undefined

      resolve(jsonData)
    }

    reader.onerror = (error) => {
      reject(error)
    }

    reader.readAsArrayBuffer(file)
  })
}

export const getUserByType = (type) => {
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

export const approveDisapproveVolunteer = async (
  val,
  val_user_id,
  volunteer_id,
  user_id,
  user_type,
  user_name,
) => {
  const response = await api.put('authorization.php', {
    approve_disapprove_volunteer: { val, val_user_id, volunteer_id, user_id, user_type, user_name },
  })
  return response.data
}

export const readNotif = async (id, user_ids) => {
  const response = await api.put('new_api.php', {
    read_notif: { id, user_ids },
  })
  return response.data
}

export const getPendingRescueReport = () => {
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

export const getPendingVolunteer = () => {
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

export const checkIfVolunteer = (user_id) => {
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

export const addVolunteerRequest = (volunteer_form, userVolunteerData) => {
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

export const getActivitiesAndEvents = () => {
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

export const getDonation = (type) => {
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

export const getAnnouncement = () => {
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

export const getRescueReport = (status) => {
  return new Promise((resolve, reject) => {
    api
      .get('rescue_report.php', {
        params: { get_rescue_report: status },
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

export const updateUser = (data, user_id, user_type, user_name) => {
  const clone = { ...data }
  delete clone.image_path
  return new Promise((resolve, reject) => {
    api
      .put('authorization.php', {
        updateUser: { clone, user_id, user_type, user_name },
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

export const activateOrDeactivate = async (actOrDac, rowUserId, user_id, user_type, user_name) => {
  const response = await api.put('authorization.php', {
    activate_or_deactivate: { val: actOrDac, rowUserId, user_id, user_type, user_name },
  })
  return response.data
}

export const updateBudgetAllocation = async (obj, user_id, user_type, user_name) => {
  const { id, ...data } = obj
  const response = await api.put('budget_expenses.php', {
    update_buget_allocation: { id: id, data: data, user_id, user_type, user_name },
  })
  return response.data
}

export const updateExpense = async (obj, user_id, user_type) => {
  const { file, id, ...data } = obj
  if (file) {
    const res = await uploadImages([file])
    data.new_image = res.data.images[0]
  }
  // Remove image_path if it exists
  delete data.image_path
  const response = await api.put('budget_expenses.php', {
    update_expense: { id: id, data: data, user_id, user_type },
  })
  return response.data
}

export const submitAdoptionForm = async (obj, user_id, user_type, user_name) => {
  if (!obj.behavior_other_animals) {
    obj.behavior_other_animals = 'Yes'
  }
  const { valid_id, ...data } = obj
  if (valid_id) {
    const res = await uploadImages([valid_id])
    data.new_image = res.data.images[0]
  }
  const response = await api.post('new_api.php', {
    submit_adoption_form: { data, user_id, user_type, user_name },
  })
  return response.data
}

export const addBudgetAllocation = async (data, user_id, user_type, user_name) => {
  const response = await api.post('budget_expenses.php', {
    add_budget_allocation: { data, user_id, user_type, user_name },
  })
  return response.data
}

export const addExpense = async (data, user_id, user_type, user_name) => {
  const response = await api.post('budget_expenses.php', {
    add_expense: { data, user_id, user_type, user_name },
  })
  return response.data
}

export const softDeleteBudgetAndExpenses = async (
  arrayId,
  tableName,
  user_id,
  user_type,
  user_name,
) => {
  const response = await api.put('budget_expenses.php', {
    soft_delete_budget_expenses: arrayId,
    table: tableName,
    user_id,
    user_type,
    user_name,
  })
  return response.data
}

export const getPageAccess = () => {
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

export const getBudgetAllocation = () => {
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

export const getExpenses = async (obj) => {
  const response = await api.get('budget_expenses.php', {
    params: { get_expenses: obj },
  })
  return response.data.data
}

export const getExpensesSummary = (obj) => {
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

export const getExpensesList = async (month, year) => {
  const response = await api.get('budget_expenses.php', {
    params: { get_expenses_list: { month, year } },
  })
  return response.data.data
}

export const getTotalBalance = (obj) => {
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

export const getMonthlyFundAndExpenses = (obj) => {
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

export const getInventoryList = (category) => {
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

export const getAnimalList = (healt_status) => {
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

export const getTotalDonation = async (year, month, operation) => {
  const reponse = await api.get('report.php', {
    params: { get_total_donation: { year, month, operation } },
  })

  return reponse.data.data?.total || 0
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

export const getInventorySummary = async () => {
  const reponse = await api.get('dashboard.php', {
    params: { get_inventory_summary: 'get_inventory_summary' },
  })

  return reponse.data.data
}

export const getSchedule = () => {
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

export const getAnimalOption = () => {
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

export const saveAnimalDetail = async (obj, user_id, user_type, user_name) => {
  const { file, ...animalData } = obj // separate the files

  if (file) {
    const res = await uploadImages(file)
    animalData.new_image = res.data.images
  }
  const response = await api.post('pet_info.php', {
    save_animal_list: { animalData, user_id, user_type, user_name },
  })
  return response.data
}

const updateDonationFileId = async (array_link, id) => {
  const reponse = await api.put('donation.php', { update_image: { array_link, id } })
  console.log(reponse.data.data)
}

export const saveDonation = (obj, user_id, user_type, user_name) => {
  const { file, ...donationData } = obj // separate the files

  return new Promise((resolve, reject) => {
    api
      .post('donation.php', {
        add_donation: { donationData, user_id, user_type, user_name },
      })
      .then(async (response) => {
        if (response.data.status == 'success') {
          const idToUpdate = response.data.id
          let status = null
          if (file) {
            const res = await uploadImages([file])
            status = await updateDonationFileId(res.data.images, idToUpdate)
          }
          resolve({ status: status, message: response.data.message })
        }
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const editDonation = async (obj, user_id, user_type, user_name) => {
  const { file, ...donation_data } = obj
  if (file) {
    const res = await uploadImages([file])
    donation_data.new_image = res.data.images[0]
  }
  const response = await api.put('donation.php', {
    edit_donation: { donation_data, user_id, user_type, user_name },
  })

  return response.data
}

export const softDeleteDonation = async (arrayId, user_id, user_type, user_name) => {
  const response = await api.put('donation.php', {
    soft_delete_donation: { arrayId, user_id, user_type, user_name },
  })
  return response.data
}

export const updateImage = async (array, id, arrayOfId) => {
  const response = await api.put('pet_info.php', {
    update_image: array,
    id: id,
    existing_id: arrayOfId,
  })
  return response.data.status
}
export const updateHealtStatus = async (obj, user_id, user_type, user_name) => {
  const response = await api.put('pet_info.php', {
    update_health_status: { obj, user_id, user_type, user_name },
  })
  return response.data
}

export const editAnimalInfo = async (obj, user_id, user_type, user_name) => {
  const { file, toRemoveId, ...animal_data } = obj

  if (toRemoveId?.length > 0) {
    if (file.length > 0) {
      const res = await uploadImages(file)
      animal_data.new_image = res.data.images
    }
    const getFileId = file.filter((obj) => obj.id != null).map((obj) => obj.id)
    animal_data.existing_image_gallery_id = getFileId ?? []
  }
  const response = await api.put('pet_info.php', {
    edit_animal_info: { animal_data, user_id, user_type, user_name },
  })
  return response.data
}

export const saveActivitiesAndEvents = async (obj, user_id, user_type, user_name) => {
  const { file, ...data } = obj // separate the files
  if (file) {
    const res = await uploadImages([file])
    data.new_image = res.data.images[0]
  }
  const response = await api.post('activities_and_events.php', {
    save_activities_and_events: { data, user_id, user_type, user_name },
  })
  return response.data
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

export const getInventoryExpiredList = (category) => {
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

export const getInventoryListSummary = (category) => {
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

export const getInventoryGroup = (category) => {
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

export const softDeleteInventoryData = (arrayId, tableName, user_id, user_type, user_name) => {
  return new Promise((resolve, reject) => {
    api
      .put('inventory.php', {
        soft_delete_inventory_data: arrayId,
        table: tableName,
        user_id,
        user_type,
        user_name,
      })
      .then((response) => {
        resolve(response.data.status)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const softDeleteActivitiesAndEvents = (arrayId, user_id, user_type, user_name) => {
  return new Promise((resolve, reject) => {
    api
      .put('activities_and_events.php', {
        soft_delete_activities_and_events: { arrayId, user_id, user_type, user_name },
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const softDeleteSchedule = (arrayId, user_id, user_type, user_name) => {
  return new Promise((resolve, reject) => {
    api
      .put('schedule.php', {
        soft_delete_schedule: { arrayId, user_id, user_type, user_name },
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const softDeleteUser = (arrayId, user_id, user_type, user_name) => {
  return new Promise((resolve, reject) => {
    api
      .put('authorization.php', {
        soft_delete_user: { arrayId, user_id, user_type, user_name },
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const softDeleteAnimal = (arrayId, user_id, user_type, user_name) => {
  return new Promise((resolve, reject) => {
    api
      .put('pet_info.php', {
        soft_delete_animal_info: { arrayId, user_id, user_type, user_name },
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const addInventoryList = (obj, user_id, user_type, user_name) => {
  obj.date_received = dateToday
  return new Promise((resolve, reject) => {
    api
      .post('inventory.php', {
        add_inventory_list: { obj, user_id, user_type, user_name },
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const addSchedule = (obj, user_id, user_type, user_name) => {
  return new Promise((resolve, reject) => {
    api
      .post('schedule.php', {
        add_schedule: { obj, user_id, user_type, user_name },
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const addAnnouncement = async (obj, user_id, user_type, user_name) => {
  const { file, ...data } = obj
  if (file) {
    const res = await uploadImages([file])
    data.new_image = res.data.images[0]
  }
  const response = await api.post('announcement.php', {
    add_announcement: { data, user_id, user_type, user_name },
  })
  return response.data
}

export const addRescueRerport = async (obj, user_id, user_type, user_name) => {
  const { file, ...data } = obj
  if (file) {
    const res = await uploadImages([file])
    data.new_image = res.data.images[0]
  }
  const response = await api.post('rescue_report.php', {
    add_rescue_report: { data, user_id, user_type, user_name },
  })

  getPendingRescueReport()
  return response.data
}

export const editAnnouncement = async (obj, user_id, user_type, user_name) => {
  const { file, ...data } = obj
  if (file) {
    const res = await uploadImages([file])
    data.new_image = res.data.images[0]
  }
  const response = await api.put('announcement.php', {
    edit_announcement: { data, user_id, user_type, user_name },
  })
  return response.data
}

export const editRescueReport = async (obj, user_id, user_type, user_name) => {
  const { file, ...data } = obj
  if (file) {
    const res = await uploadImages([file])
    data.new_image = res.data.images[0]
  }
  const response = await api.put('rescue_report.php', {
    edit_rescue_report: { data, user_id, user_type, user_name },
  })

  getPendingRescueReport()
  return response.data
}

export const editActivitiesAndEvents = async (obj, user_id, user_type, user_name) => {
  const { file, ...data } = obj
  if (file) {
    const res = await uploadImages([file])
    data.new_image = res.data.images[0]
  }
  const response = await api.put('activities_and_events.php', {
    edit_activities_and_events: { data, user_id, user_type, user_name },
  })
  return response.data
}

export const softDeleteAnnouncement = (arrayId, user_id, user_type, user_name) => {
  return new Promise((resolve, reject) => {
    api
      .put('announcement.php', {
        soft_delete_announcement: { arrayId, user_id, user_type, user_name },
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const softDeleteRescueReport = (arrayId, user_id, user_type, user_name) => {
  return new Promise((resolve, reject) => {
    api
      .put('rescue_report.php', {
        soft_delete_rescue_report: { arrayId, user_id, user_type, user_name },
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const addGroupName = (obj, user_id, user_type, user_name) => {
  return new Promise((resolve, reject) => {
    api
      .post('inventory.php', {
        add_group_name: { obj, user_id, user_type, user_name },
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const editInventoryList = (obj, user_id, user_type, user_name) => {
  return new Promise((resolve, reject) => {
    api
      .put('inventory.php', {
        edit_inventory_list: { obj, user_id, user_type, user_name },
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const editSchedule = async (obj, user_id, user_type, user_name) => {
  const response = await api.put('schedule.php', {
    edit_schedule: { obj, user_id, user_type, user_name },
  })
  return response.data
}

export const logIn = (obj) => {
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
//not yet
export const changePassword = async (username, password) => {
  const response = await api.put('login.php', {
    change_password: { username, password },
  })
  return response.data
}

export const checkPhoneNumber = async (phone_number) => {
  const response = await api.get('login.php', {
    params: { check_phone_number: phone_number },
  })
  return response.data
}

export const checkEmail = async (email_address) => {
  const response = await api.get('login.php', {
    params: { check_email_address: email_address },
  })
  return response.data
}

export const checkUsername = async (username) => {
  const response = await api.get('login.php', {
    params: { check_username: username },
  })
  return response.data
}

export const registerUser = (obj) => {
  return new Promise((resolve, reject) => {
    api
      .post('login.php', {
        register_user: obj,
      })
      .then((response) => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export const getTotalUser = async () => {
  const response = await api.get('dashboard.php', {
    params: { get_user_sum: 'get_user_sum' },
  })

  if (response.data.status === 'success') {
    return response.data.count
  } else {
    throw new Error(response.data.message || 'Unexpected response status')
  }
}

export const getTotalAnimalCount = async () => {
  const response = await api.get('dashboard.php', {
    params: { get_count_animals: 'get_user_sum' },
  })

  if (response.data.status === 'success') {
    return response.data.count
  } else {
    throw new Error(response.data.message || 'Unexpected response status')
  }
}

export const getWishlist = async (table) => {
  const response = await api.get('wishlist_management.php', {
    params: { get_wishlist: table },
  })

  if (response.data.status === 'success') {
    return response.data.data
  } else {
    throw new Error(response.data.message || 'Unexpected response status')
  }
}

export const getPetTransferList = async (status) => {
  const response = await api.get('pet_transfer.php', {
    params: { get_pet_transfer_list: status },
  })

  return response.data.data
}

export const getPetAdoptionList = async (status) => {
  const response = await api.get('adoption.php', {
    params: { get_pet_adoption_list: status },
  })

  return response.data.data
}

export const notifyManagement = async () => {
  const response = await api.get('new_api.php', {
    params: { get_phone_number: 'get_phone_number' },
  })

  return response.data.data
}

export const getScheduleExpirationDateInventory = async () => {
  const response = await api.get('new_api.php', {
    params: { expiration_date: 'expiration_date' },
  })

  return response.data.data
}

export const getScheduleAnimal = async () => {
  const response = await api.get('new_api.php', {
    params: { schedule_animal: 'schedule_animal' },
  })

  return response.data.data
}

export const updateWishlist = async (table, obj, user_id, user_type, user_name) => {
  const response = await api.put('wishlist_management.php', {
    update_wishlist: { table: table, data: obj, user_id, user_type, user_name },
  })
  return response.data
}

export const updatePetTransfer = async (obj, user_id, user_type, mode) => {
  const response = await api.put('pet_transfer.php', {
    update_pet_transfer: { obj, user_id, user_type, mode },
  })
  return response.data
}

export const updatePetAdoption = async (obj, user_id, user_type, user_name) => {
  const response = await api.put('adoption.php', {
    update_pet_adoption: { obj, user_id, user_type, user_name },
  })
  return response.data
}

export const updatePetAdoptionReadyPickup = async (obj, user_id, user_type, user_name) => {
  const response = await api.put('adoption.php', {
    update_pet_adoption_received: { obj, user_id, user_type, user_name },
  })
  return response.data
}

export const updatePetAdoptionReceived = async (obj, user_id, user_type, user_name) => {
  const response = await api.put('adoption.php', {
    update_pet_adoption_ready_pickup: { obj, user_id, user_type, user_name },
  })
  return response.data
}

export const deleteWishlist = async (table, arrayId, user_id, user_type, user_name) => {
  const response = await api.put('wishlist_management.php', {
    delete_wishlist: { table: table, id: arrayId, user_id, user_type, user_name },
  })
  return response.data
}

export const deletePetTransfer = async (arrayId, user_id, user_type) => {
  const response = await api.put('pet_transfer.php', {
    delete_pet_transfer: { arrayId, user_id, user_type },
  })
  return response.data
}

export const deletePetAdotpion = async (arrayId, user_id, user_type, user_name) => {
  const response = await api.put('adoption.php', {
    delete_pet_adotpion: { arrayId, user_id, user_type, user_name },
  })
  return response.data
}

export const addWishlist = async (obj, user_id, user_type, user_name) => {
  const response = await api.post('wishlist_management.php', {
    add_wishlist: { obj, user_id, user_type, user_name },
  })
  return response.data
}

export const addPetListRequest = async (obj, user_id, user_type) => {
  const response = await api.post('pet_transfer.php', {
    add_petList_request: { obj, user_id, user_type },
  })
  return response.data
}

export const sendEmailActiviationOtp = async (email, otp) => {
  const reponse = await onlineEndpoint.post('/send-activation-code', {
    email,
    otp,
  })

  return reponse.data
}

export const sendChangePasswordOtp = async (email, otp) => {
  const reponse = await onlineEndpoint.post('/send-change-password-code', {
    email,
    otp,
  })

  return reponse.data
}

export const sendChangeEmail = async (email, otp) => {
  const reponse = await onlineEndpoint.post('/send-change-email-code', {
    email,
    otp,
  })

  return reponse.data
}

export const getUserInfo = async (user_id) => {
  const response = await api.get('management_profile.php', {
    params: { get_user_info: user_id },
  })
  return response.data
}

export const getLogs = async () => {
  const response = await api.get('logs.php', {
    params: { get_logs: 'get_logs' },
  })
  return response.data
}

export const getNotif = async (arrOfUserKey) => {
  const response = await api.get('new_api.php', {
    params: { get_notif: arrOfUserKey },
  })
  return response.data.data
}
export const getAllAnnouncement = async () => {
  const response = await api.get('new_api.php', {
    params: { get_all_annoucement: 'get_all_annoucement' },
  })
  return response.data.data
}

export const getSpecificVolunteer = async (volunteer_id) => {
  const response = await api.get('new_api.php', {
    params: { get_specific_volunteer: volunteer_id },
  })
  return response.data.data
}
