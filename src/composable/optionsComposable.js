import { ref } from 'vue'

export const nameSuffixes = [
  'none',
  'Jr.',
  'Sr.',
  'II',
  'III',
  'IV',
  'V',
  'MD',
  'PhD',
  'Esq.',
  'CPA',
  'DDS',
  'DVM',
  'RN',
  'DO',
  'JD',
  'MBA',
  'EdD',
  'MS',
  'MA',
  'PE',
]

export const civilStatusOption = ref([
  { label: 'Single', value: 1 },
  { label: 'Married', value: 2 },
  { label: 'Divorced', value: 3 },
  { label: 'Widowed', value: 4 },
  { label: 'Separated', value: 5 },
  { label: 'Annulled', value: 6 },
])

export const sexOption = ref([
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
])
