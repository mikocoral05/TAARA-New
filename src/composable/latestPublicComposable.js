import { api } from 'src/boot/axios'
import { uploadImages } from './latestComposable'

export const getMonthlyDonation = async (month, year) => {
  const response = await api.get('new_api.php', {
    params: {
      get_monthly_donation: { month: month, year: year },
    },
  })
  return response.data
}

export const getTotalRescue = async (month, year) => {
  const response = await api.get('new_api.php', {
    params: {
      get_monthly_rescue: { month: month, year: year },
    },
  })
  return response.data
}

export const getTotalAdoption = async (month, year) => {
  const response = await api.get('new_api.php', {
    params: {
      get_monthly_adoption: { month: month, year: year },
    },
  })
  return response.data
}
export const getMonthlyDonationByYear = async (date) => {
  const response = await api.get('new_api.php', {
    params: {
      get_monthly_donation_by_year: { year: date },
    },
  })
  console.log(response.data)

  return response.data.data
}

export const getPublicUserInfo = async (user_id) => {
  const response = await api.get('new_api.php', {
    params: { public_user_id: user_id },
  })
  return response.data
}

export const updatePublicUserDetails = async (obj) => {
  const excludedKeys = [
    'image_path',
    'id',
    'size',
    'date_created',
    'type',
    'position_title',
    'position_description',
    'updated_at',
    'category',
  ]

  const cleanedObj = Object.fromEntries(
    Object.entries(obj).filter(([key]) => !excludedKeys.includes(key)),
  )
  const { file, ...new_data } = cleanedObj
  if (file) {
    const res = await uploadImages([file])
    new_data.new_image = res.data.images[0]
  }
  const response = await api.put('new_api.php', { update_public_user_details: new_data })
  console.log(response)
  return response.data
}
