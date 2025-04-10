import { ref } from 'vue'

const nameSuffixes = [
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
const civilStatusOption = ref(['Single', 'Married', 'Divorced', 'Widowed', 'Separated', 'Annulled'])
const sexOption = ref([
  { label: 'Male', value: 1 },
  { label: 'Female', value: 2 },
])

export { sexOption, nameSuffixes, civilStatusOption }
