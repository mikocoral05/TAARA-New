<template>
  <q-page>
    <!-- <div>
          <h4 class="text-center about-us q-mt-xl q-mb-md"><b>About Us</b></h4>

          <div class="flex justify-center items-center">
            <div class="aboutUsContainer q-mb-xl q-ma-lg">
              <p class="q-pa-lg aboutUsText">
                Welcome to our pet adoption website! We're thrilled that you're
                interested in learning more about us and the pets we<br />
                have available for adoption. <br /><br />

                At Tabaco Animal Rescue and Adoption, our mission is to help animals
                in need find loving homes. <br />
                We believe that every animal deserves a chance at a happy and
                healthy life, and we work tirelessly to make that a reality <br />
                for the pets in our care.<br /><br />
                Our team is made up of dedicated animal lovers who are passionate
                about animal welfare.<br />
                We have years of experience in animal rescue, rehabilitation, and
                adoption, and we bring that expertise to every animal we help.
                <br />
                <br />Since our founding in 2021, we have helped [Number of Pets
                Adopted] pets find loving homes. <br />
                We are proud to have earned [Achievements/Recognitions].<br />
                At Tabaco Animal Rescue and Adoption, we believe in treating every
                animal with the love, care, and respect they deserve.<br />
                We work hard to provide a safe and comfortable environment for the
                pets in our care, and we ensure that each<br />
                animal receives the medical attention and socialization they need to
                thrive.
                <br /><br />
                We are committed to promoting responsible pet ownership and
                education. We believe that by educating the public <br />on the
                importance of spaying/neutering, microchipping, and regular
                veterinary care, we can help reduce the number<br />
                of homeless pets. <br /><br />
                Thank you for taking the time to learn more about us and the pets we
                have available for adoption.<br />
                If you have any questions or would like to learn more about our
                adoption process, please don't hesitate to contact us.<br />
                We look forward to helping you find your new furry family member!
              </p>
            </div>
          </div>

        </div> -->
    <div class="column no-wrap container text-body1">
      <div class="first-layer row justify-start">
        <div class="text-div">
          <h4>About Us</h4>
          <p>
            Welcome to Tabaco Animal Rescue and Adoption! 🐾 We're thrilled that you're interested
            in learning more about us and the pets we have available for adoption. Our mission is to
            help animals in need find loving homes. We believe that every animal deserves a chance
            at a happy and healthy life, and we work tirelessly to make that a reality for the pets
            in our care.
          </p>
          <q-btn label="Learn More" class="bg-black text-white q-pa-sm q-mt-lg" flat no-caps />
        </div>
      </div>
      <div class="second-layer column justify-center items-center relative-position">
        <div class="text-center">
          <h4>Our Mission</h4>
          <p>
            "To rescue, rehabilitate and rehome abandoned and neglected animals, ensure healthy pets
            through education concerning animal welfare and animal care. And to provide affordable
            services through our partner animal clinics, and most importantly, to inspire a
            community where people value animals thus intensifying the animal-human bond."
          </p>
          <h4>Our Vission</h4>
          <p>
            "TAARA is a non-profit animal welfare organization geared towards inspiring a community
            where all animals are protected and treated with respect and kindness."
          </p>
        </div>
        <div class="shape-design absolute-left"></div>
      </div>
      <div class="third-layer row no-wrap justify-end items-center full-width relative-position">
        <div class="right-div q-pa-lg">
          <h5>Our Advocacy</h5>
          <p>
            "Tabaco Animal Rescue and Adoption (TAARA) is a non-profit animal welfare organization
            geared towards inspiring a community where all animals are protected and treated with
            respect and kindness. The organization aims to save, rehabilitate, and rehome animals in
            need, to support healthy pets through the use of education, advocacy, and low-cost
            services, and to create a community where the animal-human link is honored and
            maintained."
          </p>
        </div>
      </div>
      <div class="fourth-layer column no-wrap full-width">
        <div class="our-team column justify-center items-center no-wrap text-center full-width">
          <h4>Our Team</h4>
          <p>
            " Our team is made up of dedicated animal lovers who are passionate about animal
            welfare. We have years of experience in animal rescue, rehabilitation, and adoption, and
            we bring that expertise to every animal we help."
          </p>
        </div>
        <div class="team-container row justify-center items-center q-py-xl text-body1">
          <div
            v-for="data in allTaaraOfficialsInfo"
            :key="data"
            class="person-info q-ma-md column justify-center items-center"
          >
            <img :src="data.image" alt="" />
            <p class="text-center q-mt-sm q-mb-none">
              {{ data.first_name + ' ' + data.last_name }}
            </p>
            <p class="text-center text-overline text-grey-6 q-mt-none">
              {{ data.position }}
            </p>
          </div>
        </div>
        <div class="our-team column justify-center items-center no-wrap text-center full-width">
          <h4>Our Volunteer</h4>
          <p>
            “Volunteers are the backbone of our organization, bringing their unique skills and
            boundless passion to support our mission. Their dedication to animal welfare makes a
            significant difference, helping us rescue, rehabilitate, and rehome animals in need.”
          </p>
        </div>
        <div class="team-container row justify-center items-center q-py-xl text-body1">
          <div
            v-for="volunteer in allVolunteersInfo"
            :key="volunteer"
            class="person-info q-ma-md column justify-center items-center"
          >
            <img :src="volunteer.image" alt="" />
            <p class="text-center q-mt-sm q-mb-none">
              {{ volunteer.first_name + ' ' + volunteer.last_name }}
            </p>
            <p class="text-center text-overline text-grey-6 q-mt-none">
              {{ volunteer.position }}
            </p>
          </div>
        </div>
      </div>
      <div class="last-layer column justify-center items-center no-wrap text-center full-width">
        <h4>Ready to Meet Your New Furry Family Member? 🐾</h4>
        <p>
          Thank you for taking the time to learn more about us and the pets we have available for
          adoption. If you have any questions or would like to learn more about our adoption
          process, please don't hesitate to contact us. We look forward to helping you find your new
          furry family member!
        </p>
      </div>
    </div>
    <taaraFooter class="footer" />
  </q-page>
</template>

<script>
import taaraFooter from '../components/taaraFooter.vue'
import { onMounted } from 'vue'
import {
  allTaaraOfficials,
  allTaaraOfficialsInfo,
  allVolunteersInfo,
  allVolunteers,
} from 'src/composable/taaraComposable'
export default {
  components: {
    taaraFooter,
  },
  setup() {
    onMounted(() => {
      allTaaraOfficials(['first_name', 'last_name', 'image', 'position'])
      allVolunteers(['first_name', 'last_name', 'image', 'position'])
    })
    return {
      allTaaraOfficialsInfo,
      allVolunteersInfo,
    }
  },
}
</script>

<style lang="scss" scoped src="pages/taara/style/aboutUs.scss"></style>
