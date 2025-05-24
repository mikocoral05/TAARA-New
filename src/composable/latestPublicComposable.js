import { api } from 'src/boot/axios'

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
  const response = await api.get('api.php', {
    params: {
      get_monthly_donation: 'get_monthly_donation',
      year: date,
    },
  })
  console.log(response.data)

  return response.data.data
}
