<template>
  <q-page class="container column justify-start items-center relative-position">
    <div class="background-image absolute-top"></div>
    <div class="first-child">
      <h3 class="text-left title">Frequently Asked Questions</h3>
      <div class="row justify-start items-center tab-container">
        <q-btn
          class="q-px-lg q-mx-md text-body1"
          @click="tabReference = 1"
          label="Adoption"
          flat
          :ripple="false"
        />
        <q-btn
          class="q-px-lg q-mx-md text-body1"
          @click="tabReference = 2"
          label="Donations"
          flat
          :ripple="false"
        />
        <q-btn
          class="q-px-lg q-mx-md text-body1"
          @click="tabReference = 3"
          label="Rescuing"
          flat
          :ripple="false"
        />
        <q-btn
          @click="tabReference = 4"
          label="Pet Owners"
          flat
          class="text-body1"
          :ripple="false"
        />
      </div>
      <div
        v-if="tabReference == 1"
        class="row justify-start items-start q-my-xl tab-details"
      >
        <div
          class="four-div-container column justify-start items-center q-pb-lg text-black"
        >
          <div class="column q-my-sm full-width text-body1">
            <h6 class="q-mb-sm q-mt-md questions text-body1">
              What is your Adoption Process?
            </h6>
            <p class="q-my-md">
              Our adoption process consists of 3 simple steps!
            </p>
            <p>
              1. You may start by finding a list of our rescues at:
              <u>OUR PETS</u>
            </p>
            <p>
              2. Once you feel ready to welcome a new family member to your
              home, you may fill out our
              <u>ADOPTION FORM</u>.<br />
              An Adoption Coordinator will then contact you for an <br />
              interview.
            </p>
            <p>
              3. Once you pass our screening process, you may schedule a shelter
              visit to meet our<br />
              loving rescues, and take home your new best friend the same day!
            </p>
          </div>
          <div class="column q-ma-sm full-width text-body1">
            <h6 class="q-mb-sm q-mt-md questions">
              What are the Requirements to adopt?
            </h6>
            <p>
              We do not have specific requirements, just that you pass our
              detailed Adoption Screening Process.<br />
              Rest assured that all details you share with the team will be kept
              confidential and will only be used to assess <br />your
              compatibility with our Rescues.
            </p>
            <p>
              But all we really ask from potential adopters is a lifetime
              commitment to consider our rescues as part of the <br />
              family. This means ensuring their well-being at all times, and
              providing them with a loving environment for life.
            </p>
          </div>
          <div class="column q-ma-sm full-width text-body1">
            <h6 class="q-mb-sm q-mt-md questions">
              What are your Rescues’ Breeds?
            </h6>
            <p>
              Our rescues are proudly Aspins and Puspins! They are all unique in
              their own special ways, and we are excited<br />
              for everyone to see their lovely personalities.<br /><br />
              More than a dog or cat’s breed, physical characteristics,
              and/or<br />
              age, we suggest exploring their temperament to ensure their
              compatibility with your family and lifestyle.
            </p>
          </div>
          <div class="column q-ma-sm full-width text-body1">
            <h6 class="q-mb-sm q-mt-md questions">
              Can I adopt if I am far from your Shelters?
            </h6>
            <p>
              Due to limited resources and manpower, we are unable to
              accommodate if the adopter is unable to pick up their<br />
              chosen rescue from our shelter.
            </p>
          </div>
          <div class="column q-ma-sm q-ma-sm full-width text-body1">
            <h6 class="q-mb-sm q-mt-md questions">
              Do you deliver/transport Rescues to their Adopters for free?
            </h6>
            <p>
              We can only accommodate transportation in certain circumstances,
              such as if you already visited the shelter<br />
              (or have been to an in-person adoption event), and formed a
              special bond with your chosen rescue previously.<br /><br />
              You may raise this question with your assigned adoption
              coordinator, and if applicable, we are more than happy <br />to
              provide you with some options.
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="tabReference == 2"
        class="row justify-start items-start q-my-xl tab-details"
      >
        <div
          class="four-div-container column justify-start items-center q-pb-lg text-black text-body1"
        >
          <div class="column q-ma-sm full-width">
            <h6 class="q-mb-sm q-mt-md questions">
              What are your Official Donation Platforms?
            </h6>
            <p>Our official donation platforms are as follows:</p>

            <ul>
              <li>BDO 005150343294</li>
              <li>PayPal 0905-523-8105</li>
              <li>GCash 0905-523-8105 - Ednalyn C.</li>
            </ul>
          </div>
          <div class="column q-ma-sm full-width">
            <h6 class="q-mb-sm q-mt-md questions">
              What In-Kind Donations are needed? Where can we send them?
            </h6>

            <p>
              Our wishlist for in-kind donations and where to send them can be
              found at:
              <u @click="$router.push('/shelter-wishlist')">Shelter Wishlist</u>
            </p>
          </div>
          <div class="column q-ma-sm full-width">
            <h6 class="q-mb-sm q-mt-md questions">
              Do you have QR codes for your donation platforms?
            </h6>
            <p>
              Yes, we have QR codes for our G-Cash accounts, as well as BPI and
              BDO. They can be found at:

              <u @click="$router.push('/donation-channel')"
                >Our Donation<br />
                Channel</u
              >
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="tabReference == 3"
        class="row justify-start items-start q-my-xl tab-details"
      >
        <div
          class="four-div-container column justify-start items-center q-pb-lg text-black text-body1"
        >
          <div class="column q-ma-sm full-width">
            <h6 class="q-mb-sm q-mt-md questions">Do you rescue?</h6>
            <p>Our official donation platforms are as follows:</p>
            <p>
              We are more than willing to provide assistance as much as we can,
              considering there is already a concrete<br />
              plan for the animal in need (i.e., who will shoulder the expenses,
              and where to bring the animal upon rescue<br />
              and after beingcleared at the vet). Kindly please provide us with
              details, so we may know how to assist you<br />
              further.
            </p>
          </div>
          <div class="column q-ma-sm full-width">
            <h6 class="q-mb-none q-mt-md questions">
              How can I request for rescue assistance?
            </h6>
            <p>
              You may send us a message on our social media platforms or fill
              out a contact form at: Homepage.<br />
            </p>
            <p>
              Please note that we cannot accommodate all rescue requests due to
              limited manpower and resources.<br />
              Please include as many details as possible. If this is an
              emergency situation, we encourage reporters to bring<br />
              the rescue to a nearby veterinary hospital.
            </p>
          </div>
          <div class="column q-ma-sm full-width">
            <h6 class="q-mb-sm q-mt-md questions">
              What is your Shelter Acceptance Protocol?
            </h6>
            <p>
              Accepting new Rescues cases at our Shelters are the most
              challenging because these are animals who<br />
              we usually find in dire or critical situations. They can come with
              an array of health problems so it is crucial <br />
              that we take the necessary steps to ensure the healths of our
              current rescues are not compromised.<br /><br />
              Our first step is to always bring our rescues to the vet to make
              sure they are cleared from sickness. <br />
              But if we find that they need further treatment or they test
              positive from Distemper or Ehrlichia, we have<br />
              to either: urgently find a foster home or; confine the rescue with
              the Vet.<br /><br />
              This is the same support we ask from people asking Rescue
              Assistance. If they can already shoulder all<br />
              vet expenses and make sure the rescue is properly healed, we can
              help with using our Social Media Platforms <br />to look for
              adopters.
            </p>
          </div>
          <div class="column q-ma-sm full-width">
            <h6 class="q-mb-sm q-mt-md questions">
              How can I report an Animal Cruelty Case?
            </h6>
            <p>
              For cases of animal abuse, please seek assistance from your
              barangay/PNP/NBI or call 911 to report the<br />
              incident. Secure evidence such as photos and videos and find
              witnesses willing to testify and file an official<br />
              complaint to help move the case forward and ensure justice.<br /><br />
              Pawssion Project is not a government agency and does not have the
              authority to persecute suspects. Because<br />
              animal cruelty and pet neglect are criminal offenses, they must be
              reported to the authorities
            </p>
          </div>
          <div class="column q-ma-sm full-width">
            <h6 class="q-mb-sm q-mt-md questions">
              How can I report a Pet Neglect Case?
            </h6>
            <p>
              For owned pets, the first step is to talk to the owners and
              educate them on Responsible Pet Ownership. You <br />also need to
              get their explicit consent that they’re willing to have their pets
              adopted, otherwise it can be<br />
              considered trespassing or robbery.<br /><br />
              Unfortunately, we cannot just confiscate animals from cruel or
              neglectful owners as we are not a government<br />
              agency and does not have the authority to do this. Because animal
              cruelty and pet neglect are criminal<br />
              offenses, they must be reported to the authorities by calling 911
              or your barangay.
            </p>
          </div>
          <div class="column q-ma-sm full-width">
            <h6 class="q-mb-sm q-mt-md questions">
              How can I report Dog Meat Trading Cases?
            </h6>
            <p>
              If you suspect someone is participating in the dog meat trade,
              please call 911 or report them immediately to<br />
              your barangay or the police
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="tabReference == 4"
        class="row justify-start items-start q-my-xl tab-details"
      >
        <div
          class="four-div-container column justify-start items-center q-pb-lg text-black text-body1"
        >
          <div class="column q-ma-sm full-width">
            <h6 class="q-mb-sm q-mt-md questions">Can I surrender my pets?</h6>
            <p class="q-my-none q-mb-lg">
              Our official donation platforms are as follows:
            </p>

            <p class="q-mb-md">
              We strongly discourage pet surrenders since pet abandonment and
              irresponsible pet ownership are the root<br />
              causes of stray overpopulation. Thousands of abandoned pets/strays
              are euthanized every single day.<br /><br />
              For this reason, we strongly encourage exerting all possible
              efforts to keep your pets or rehome them to trusted<br />
              individuals, since they truly should be regarded as part of the
              family. And family means nobody gets left <br />behind.
            </p>
          </div>
          <div class="column q-ma-sm full-width">
            <h6 class="q-mb-none q-mt-md questions q-mb-md">
              Can my pet stay at your shelter temporarily?
            </h6>

            <p class="q-mb-md">
              Our shelters serve as temporary homes for rescued animals
              requiring rehabilitation. We unfortunately are<br />
              unable to provide boarding services. We suggest finding a foster
              home or a boarding facility for <br />your beloved pet prior to
              going on your vacation. We truly appreciate you not resorting to
              pet abandonment!
            </p>
          </div>
          <div class="column q-ma-sm full-width">
            <h6 class="q-mb-sm q-mt-md questions">
              My pet is exhibiting aggressive behaviours. Can we surrender our
              pet to <br />your facility?
            </h6>
            <p>
              We strongly discourage pet surrenders since pet abandonment and
              irresponsible pet ownership are the root <br />causes of stray
              overpopulation. We strongly encourage finding the root cause of
              their behaviours. <br /><br />
              Neutering your pet can resolve aggressiveness as well. Kindly
              consider consulting an animal behaviourist, or<br />
              searching on the internet how to use positive reinforcement to
              address undesirable behaviours. Sometimes,<br />
              all it takes is spending extra time with your pets to address such
              concerns.
            </p>
          </div>
          <div class="column q-ma-sm full-width">
            <h6 class="q-mb-sm q-mt-md questions">
              Help! My pet got sick but I cannot pay for his treatment. Can you
              adopt <br />him instead?
            </h6>
            <p>
              We are sorry to hear about your pet’s poor health. In your case,
              we advise fundraising for your beloved pet, and<br />
              seeking assistance from other animal welfare advocates by posting
              on different animal groups.<br /><br />
              Aside from asking for monetary assistance, you may also seek tips
              and guidelines on how to manage your pet’s <br />
              condition from other pet parents. It is best to include as many
              details as possible regarding your pet’s
              <br />condition.<br /><br />
              However, we strongly advise seeking veterinary care, since
              veterinarians are the experts and your <br />pet would have the
              highest chance of survival if given the appropriate treatment. We
              hope this helps and <br />we are sincerely hoping for your
              furbaby’s fast recovery.
            </p>
          </div>
        </div>
      </div>
    </div>
  </q-page>
  <taaraFooter />
</template>
<script>
import { ref } from "vue";
import taaraFooter from "src/components/taaraFooter.vue";

export default {
  components: {
    taaraFooter,
  },
  setup() {
    let tabReference = ref(1);
    return {
      tabReference,
    };
  },
};
</script>
<style lang="scss" scoped src="../pages/taara/style/taaraFaqs.scss"></style>
