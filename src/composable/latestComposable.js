import { api } from 'src/boot/axios'
import { dateToday } from 'src/composable/simpleComposable'

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

const editAnimalInfo = (obj) => {
  const { image_gallery, ...animal_data } = obj
  return new Promise((resolve, reject) => {
    api
      .put('pet_info.php', {
        edit_animal_info: animal_data,
      })
      .then((response) => {
        if (response.data.status == 'success') {
          console.log(image_gallery)
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

export {
  getSchedule,
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
