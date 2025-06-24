import { api } from 'src/boot/axios'
import { uploadImages } from 'src/composable/latestComposable'

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

  return response.data.data
}

export const getPublicUserInfo = async (user_id) => {
  const response = await api.get('new_api.php', {
    params: { public_user_id: user_id },
  })
  return response.data
}

export const udpateUserInfo = async (obj) => {
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
    'file',
    'admin_id',
    'volunteer_id',
  ]

  const cleanedObj = Object.fromEntries(
    Object.entries(obj).filter(([key]) => !excludedKeys.includes(key)),
  )
  // const { file, ...new_data } = cleanedObj
  // if (file) {
  //   const res = await uploadImages([file])
  //   new_data.new_image = res.data.images[0]
  // }
  const response = await api.put('new_api.php', { update_public_user_details: cleanedObj })
  return response.data
}

export const updatePublicUserImage = async (file, user_id) => {
  if (file) {
    const res = await uploadImages([file])
    const response = await api.put('new_api.php', {
      update_public_user_image: { new_image: res.data.images[0], user_id },
    })
    return response.data
  }
}

export const updatePublicUserEmailAddress = async (new_email_address, user_id) => {
  const response = await api.put('new_api.php', {
    update_publicuser_email_address: { user_id, new_email_address },
  })

  return response.data
}

export const updatePublicUserPassword = async (new_password, user_id) => {
  const response = await api.put('new_api.php', { update_password: { new_password, user_id } })
  return response.data
}

export const submitPetTransfer = async (obj, user_id, user_type) => {
  const { file, ...data } = obj
  if (file) {
    const res = await uploadImages([file])
    data.new_image = res.data.images[0]
  }
  const response = await api.post('new_api.php', {
    submit_pet_transfer: { data, user_id, user_type },
  })
  return response.data
}

export const getPetTransferRequest = async (user_id) => {
  const response = await api.get('new_api.php', {
    params: {
      get_pet_transfer_request: user_id,
    },
  })
  return response.data.data
}

export const submitPublicDonation = async (obj) => {
  const { file, ...data } = obj
  if (file) {
    const res = await uploadImages([file])
    data.new_image = res.data.images[0]
  }
  const response = await api.post('donation.php', {
    add_donation: { donationData: data, user_id: obj.donor_id, user_type: 1 },
  })
  return response.data
}

export const getLikes = async (user_id) => {
  const response = await api.get('new_api.php', {
    params: { get_likes: user_id },
  })
  return response.data.data
}
export const likes = async (animal_ids, user_id) => {
  const response = await api.put('new_api.php', {
    like_animal: { animal_ids, user_id },
  })
  return response.data
}
export const removeLikes = async (animal_ids, user_id) => {
  const response = await api.put('new_api.php', {
    unlike_animal: { animal_ids, user_id },
  })
  return response.data
}
export const getFavorites = async (user_id) => {
  const response = await api.get('new_api.php', {
    params: { get_favorites: user_id },
  })
  return response.data.data
}
