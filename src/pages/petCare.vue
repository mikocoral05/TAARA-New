<template>
  <q-page>
    <div class="column no-wrap justify-center items-center container">
      <div
        class="title-container column no-wrap full-width justify-center items-center q-py-lg bg-primary text-white"
      >
        <h6 class="q-ma-none q-mb-md text-center">Simple steps to</h6>
        <h3 class="q-ma-none text-center">Pet Care</h3>
      </div>
      <div class="row no-wrap justify-around details full-width">
        <div class="column no-wrap justify-center items-center details-container">
          <q-icon name="pets" size="xl" />
          <h3 class="q-ma-none text-center q-mb-xl">Dogs</h3>
          <h6 class="text-body1">
            Dogs have basic needs that must be met to keep them happy and healthy. These needs
            include:
          </h6>
          <p class="text-body1">
            1. Food and Water: Dogs need a balanced diet that includes protein, carbohydrates, and
            fats. The amount of food your dog needs depends on its breed, size, age, and activity
            level. Make sure your dog always has access to clean, fresh water.
          </p>
          <p class="text-body1">
            2. Exercise: Dogs need exercise to maintain a healthy weight, strengthen their muscles,
            and improve their mental health. The amount of exercise your dog needs depends on its
            breed, size, age, and energy level. Take your dog for a walk or play fetch reqularly.
          </p>
          <p class="text-body1">
            3. Shelter: Dogs need a safe and comfortable place to rest and sleep. Provide your dog
            with a warm and dry place to sleep, aways from any drafts. Make sure your dog's living
            place is clean and well-ventilated
          </p>

          <h6 class="text-body1">
            Regular grooming is essential for your dog's health and well-being. Here are some tips
            for grooming your dog:
          </h6>
          <p class="text-body1">
            1. Bathing: Bathe your dog regularly using a dog-specific shampoo. The frequency of
            baths depends on your dog's breed, size, and activity level. Some dogs may require more
            frequent baths than others.
          </p>
          <p class="text-body1">
            2. Brushing: Brush your dog's coat reqularly to remove loose hair, dirt, and debris.
            This can help prevent mats and tangles from forming and keep your dog's coat healthy and
            shiny
          </p>
          <p class="text-body1">
            3. Nail Trimming: Trim your dog's nails regularly to prevent them from becoming too long
            and causing discomfort or injury. Be careful not to cut the quick, which is the blood
            vessel inside the nail.
          </p>
          <h6 class="text-body1">
            Regular veterinary care is important for your dog's health. Here are some healthcare
            tips:
          </h6>
          <p class="text-body1">
            1. Vaccinations: Vaccinate your dog against common diseases, such as rabies, distemper,
            and parvovirous. Your veterinarian can advise you on the appropriate vaccination
            schedule for your dog.
          </p>

          <p class="text-body1">
            2. Parasite Control: Protect your dog from fleas, ticks, and other parasites. Your
            veterinarian can prescribe appropriate flea and tick prevention medications.
          </p>

          <p class="text-body1">
            3. Dental Care: Dental care is essential for your dog's health. Brush your dog's teeth
            regularly and provide dental treats or toys to help keep teeth clean.
          </p>
        </div>
        <div class="column no-wrap justify-center items-center details-container">
          <q-icon name="pets" size="xl" />
          <h3 class="q-ma-none text-center q-mb-xl">Dogs</h3>
          <h6 class="text-body1">
            Dogs have basic needs that must be met to keep them happy and healthy. These needs
            include:
          </h6>
          <p class="text-body1">
            1. Food and Water: Dogs need a balanced diet that includes protein, carbohydrates, and
            fats. The amount of food your dog needs depends on its breed, size, age, and activity
            level. Make sure your dog always has access to clean, fresh water.
          </p>
          <p class="text-body1">
            2. Exercise: Dogs need exercise to maintain a healthy weight, strengthen their muscles,
            and improve their mental health. The amount of exercise your dog needs depends on its
            breed, size, age, and energy level. Take your dog for a walk or play fetch reqularly.
          </p>
          <p class="text-body1">
            3. Shelter: Dogs need a safe and comfortable place to rest and sleep. Provide your dog
            with a warm and dry place to sleep, aways from any drafts. Make sure your dog's living
            place is clean and well-ventilated
          </p>

          <h6 class="text-body1">
            Regular grooming is essential for your dog's health and well-being. Here are some tips
            for grooming your dog:
          </h6>
          <p class="text-body1">
            1. Bathing: Bathe your dog regularly using a dog-specific shampoo. The frequency of
            baths depends on your dog's breed, size, and activity level. Some dogs may require more
            frequent baths than others.
          </p>
          <p class="text-body1">
            2. Brushing: Brush your dog's coat reqularly to remove loose hair, dirt, and debris.
            This can help prevent mats and tangles from forming and keep your dog's coat healthy and
            shiny
          </p>
          <p class="text-body1">
            3. Nail Trimming: Trim your dog's nails regularly to prevent them from becoming too long
            and causing discomfort or injury. Be careful not to cut the quick, which is the blood
            vessel inside the nail.
          </p>
          <h6 class="text-body1">
            Regular veterinary care is important for your dog's health. Here are some healthcare
            tips:
          </h6>
          <p class="text-body1">
            1. Vaccinations: Vaccinate your dog against common diseases, such as rabies, distemper,
            and parvovirous. Your veterinarian can advise you on the appropriate vaccination
            schedule for your dog.
          </p>

          <p class="text-body1">
            2. Parasite Control: Protect your dog from fleas, ticks, and other parasites. Your
            veterinarian can prescribe appropriate flea and tick prevention medications.
          </p>

          <p class="text-body1">
            3. Dental Care: Dental care is essential for your dog's health. Brush your dog's teeth
            regularly and provide dental treats or toys to help keep teeth clean.
          </p>
        </div>
      </div>

      <p class="text-body1 q-mt-xl">
        In conclusion, taking care of a dog requires a commitment of time, effort, and resources. By
        meeting your dog's basic needs,<br />
        grooming regularly, and providing regular veterinary care, you can help ensure that your
        furry friend lives a happy and healthy life.
      </p>
    </div>
    <TaaraFooter class="footer" />
  </q-page>
</template>

<script>
import { ref } from 'vue'
// import PageFooter from "src/components/PageFooter.vue";
import TaaraFooter from 'src/components/TaaraFooter.vue'
export default {
  components: {
    TaaraFooter,
  },
  setup() {
    return {
      // PageFooter,
      menu1: ref(false),
      menu2: ref(false),
      menu3: ref(false),
    }
  },
}
</script>

<style lang="scss" scoped src="../pages/taara/style/aboutPetCare.scss"></style>
