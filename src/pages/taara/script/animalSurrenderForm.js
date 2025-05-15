import { addSurrenderForm } from 'src/composable/taaraComposable'
import { ref } from 'vue'
export default {
  setup() {
    let surrederFormDetails = ref({
      animal_name: null,
      breed: null,
      color: null,
      age: null,
      weight: null,
      socialization: null,
      health_status: null,
      surrender_reason: null,
      donation_amount: null,
    })
    return { addSurrenderForm, surrederFormDetails }
  },
}
