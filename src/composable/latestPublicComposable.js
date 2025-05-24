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
      rescue_report: { month: month, year: year },
    },
  })
  return response.data
}

export const getTotalAdoption = async (month, year) => {
  const response = await api.get('new_api.php', {
    params: {
      get_monthly_donation: { month: month, year: year },
    },
  })
  return response.data
}
