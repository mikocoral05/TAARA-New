<template>
  <q-page>
    <q-scroll-observer @scroll="onScroll" />
    <div class="first-layer row justify-center items-center">
      <div class="row no-wrap q-my-lg first-child">
        <div class="intro-layer column no-wrap">
          <div class="heading-1 q-mb-lg fade-in">
            Find Your
            <span class="text-primary">
              Best<br />
              Friend</span
            >. Adopt<br />
            Today!
          </div>
          <div class="paragraph-1 q-mb-xl fade-in">
            TAARA provides an effective and loving<br />
            way to find your perfect pet.
          </div>
          <q-btn
            label="Get Started"
            class="bg-primary text-white q-pa-sm q-mb-lg show-in"
            flat
            no-caps
            @click="scrollToDiv('mission')"
          />
          <div class="row no-wrap paragraph-3 justify-between fade-in">
            <div class="row no-wrap">
              <q-icon class="q-mr-md" name="home" />
              <p class="q-ma-none">
                Giving Every<br />
                Pet a Chance
              </p>
            </div>
            <div class="row no-wrap">
              <q-icon class="q-mr-md" name="favorite" />
              <p class="q-ma-none">
                Providing <br />
                Love & Care
              </p>
            </div>
            <div class="row no-wrap" @click="$router.push('/volunteer-form')">
              <q-icon class="q-mr-md text-white" name="forum" />
              <p class="q-ma-none">
                Join Our<br />
                Community
              </p>
            </div>
          </div>
        </div>
        <div class="image-layer fade-in-left-right">
          <img src="../image/home_Image-ai-brush-removebg-yed4fhw.png" alt="" />
        </div>
      </div>
    </div>
    <div
      class="second-layer row no-wrap justify-center items-center"
      id="ourMission"
      ref="ourMission"
    >
      <h2
        class="mission-title row justify-start items-center pt-md q-ma-none"
        :class="maxScrollTop >= 200 ? 'show-in' : ''"
      >
        Our Mission
      </h2>
      <p
        class="mission-text row justify-start items-center q-ma-none"
        :class="maxScrollTop >= 200 ? 'show-in' : ''"
      >
        To rescue, rehabilitate and rehome abandoned and neglected animals, ensure healthy pets
        through education concerning animal welfare and animal care. And to provide affordable
        services through our partner animal clinics, and most importantly, to inspire a community
        where people value animals thus intensifying the animal-human bond.
      </p>
    </div>
    <div class="third-layer column items-center">
      <div class="first-child">
        <div class="f-c-container" :class="maxScrollTop >= 700 ? 'show-in' : ''">
          <div class="heading-2 q-mb-lg">What We Offer</div>
          <div class="paragraph-2 q-mb-xl">
            At TAARA, we offer a range of services including pet adoption,<br />
            fostering programs, medical care, and community education. We are<br />
            committed to providing comprehensive support for pets and their new<br />
            families.
          </div>
        </div>
      </div>
      <div class="second-child row no-wrap justify-between">
        <div class="column no-wrap">
          <img
            src="../image/adoption-image.jpg"
            alt=""
            class="q-mb-lg"
            :class="maxScrollTop >= 700 ? 'fade-in' : ''"
          />
          <div :class="maxScrollTop >= 1250 ? 'show-in' : ''">
            <h6 class="q-ma-none q-mb-md">Adoption Process</h6>
            <p class="q-ma-none">
              Our adoption process is designed to ensure that every pet finds the perfect home. We
              carefully match pets with potential adopters and provide guidance and support
              throughout the entire process.
            </p>
          </div>
        </div>
        <div class="column no-wrap">
          <img
            src="../image/community-image.jpg"
            alt=""
            class="q-mb-lg"
            :class="maxScrollTop >= 700 ? 'fade-in' : ''"
          />
          <div :class="maxScrollTop >= 1250 ? 'show-in' : ''">
            <h6 class="q-ma-none q-mb-md">Community Engagement</h6>
            <p class="q-ma-none">
              Join our community and become a part of the TAARA family. We offer various events,
              volunteer opportunities, and educational programs to promote responsible pet ownership
              and animal welfare.
            </p>
          </div>
        </div>
        <div class="column no-wrap" @click="$router.push('/rescue-reports')">
          <img
            src="../image/rescue-image.jpg"
            alt=""
            class="q-mb-lg"
            :class="maxScrollTop >= 700 ? 'fade-in' : ''"
          />
          <div :class="maxScrollTop >= 1250 ? 'show-in' : ''">
            <h6 class="q-ma-none q-mb-md">Report & Rescue</h6>
            <p class="q-ma-none">
              Our rescue process is designed to ensure that every animal in danger gets immediate
              help. We carefully assess the reported situations and provide swift action and support
              throughout the entire process.
            </p>
          </div>
        </div>
        <div class="column no-wrap" @click="$router.push('/pet-transfer')">
          <img
            src="../image/transfer-image.jpg"
            alt=""
            class="q-mb-lg"
            :class="maxScrollTop >= 700 ? 'fade-in' : ''"
          />
          <div :class="maxScrollTop >= 1250 ? 'show-in' : ''">
            <h6 class="q-ma-none q-mb-md">Pet Transfer</h6>
            <p class="q-ma-none">
              Our organization offers an Pet Transfer and Rehoming Service for pets needing a new
              environment. We ensure their care during the transition and strive to find them a
              loving, new home.
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="fourth-layer row no-wrap">
      <div
        :class="maxScrollTop >= 1662 ? 'fade-in' : ''"
        class="left-image column justify-center items-center relative-position"
      >
        <div class="absolute-left blue-circle"></div>
        <img src="../image/dedicated-team.jpg" alt="" />
        <div class="absolute square"></div>
      </div>
      <div class="right-description column justify-center items-center">
        <h2 class="q-ma-none" :class="maxScrollTop >= 1766 ? 'show-in' : ''">
          Dedicated to Animal<br />
          Welfare
        </h2>
        <p class="q-ma-none q-my-xl" :class="maxScrollTop >= 1896 ? 'show-in' : ''">
          At TAARA, we are committed to promoting animal welfare and advocating for the rights of
          all pets. Our dedicated team works tirelessly to ensure that every animal is treated with
          compassion and respect.
        </p>
        <div
          class="row no-wrap paragraph-3 justify-between"
          :class="maxScrollTop >= 2070 ? 'fade-in' : ''"
        >
          <div class="row no-wrap">
            <q-icon class="q-mr-md" name="home" />
            <p class="q-ma-none">
              Adoption<br />
              Toolkit
            </p>
          </div>
          <div class="row no-wrap">
            <q-icon class="q-mr-md" name="favorite" />
            <p class="q-ma-none">Pet Profiles</p>
          </div>
          <div class="row no-wrap">
            <q-icon class="q-mr-md" name="communities" />
            <p class="q-ma-none">Happy Tails</p>
          </div>
        </div>
      </div>
    </div>
    <div class="fifth-layer column justify-center items-center">
      <div class="first-child" :class="maxScrollTop >= 2636 ? 'show-in' : ''">
        <h2 class="q-ma-none q-mb-lg">Trusted Among Animal Lovers</h2>
        <p class="q-ma-none">
          We have gained the trust of countless animal lovers and adopters who have found their
          perfect companions through TAARA.
        </p>
      </div>
    </div>
    <div class="sixth-layer column justify-center items-center">
      <div class="first-child">
        <h2 :class="maxScrollTop >= 3110 ? 'show-in' : ''">What Our Adopters Say</h2>
        <div
          class="row no-wrap justify-between items-center"
          :class="maxScrollTop >= 3321 ? 'show-in' : ''"
        >
          <div class="column no-wrap feddback-container">
            <div class="head"></div>
            <div class="content column no-wrap justify-between items-center q-pa-md">
              <p class="q-ma-none q-px-lg q-pt-lg">
                “I found my furry best friend through TAARA. The adoption process was smooth, and
                the support provided was exceptional.”
              </p>
              <p class="q-ma-none bottom-text">Samantha Peterson, Happy Adopter</p>
            </div>
          </div>
          <div class="column no-wrap feddback-container">
            <div class="head"></div>
            <div class="content column no-wrap justify-between items-center q-pa-md">
              <p class="q-ma-none q-px-lg q-pt-lg">
                “I found my furry best friend through TAARA. The adoption process was smooth, and
                the support provided was exceptional.”
              </p>
              <p class="q-ma-none bottom-text">Samantha Peterson, Happy Adopter</p>
            </div>
          </div>
          <div class="column no-wrap feddback-container">
            <div class="head"></div>
            <div class="content column no-wrap justify-between items-center q-pa-md">
              <p class="q-ma-none q-px-lg q-pt-lg">
                “I found my furry best friend through TAARA. The adoption process was smooth, and
                the support provided was exceptional.”
              </p>
              <p class="q-ma-none bottom-text">Samantha Peterson, Happy Adopter</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="seventh-layer column justify-center items-center">
      <div class="first-child row no-wrap" :class="maxScrollTop >= 3900 ? 'fade-in' : ''">
        <div class="support-cause column no-wrap justify-center item-center">
          <h2 class="q-ma-none q-mb-lg">Support Our Cause</h2>
          <p class="q-ma-none">
            Your contributions and donations help us continue our mission of giving every pet a
            chance at a loving home. Explore our donation options and be a part of our journey.
          </p>
          <q-btn
            label="Donate Now"
            class="bg-black text-white q-pa-sm q-mt-xl"
            flat
            no-caps
            to="donation-channel"
            style="max-width: 200px"
          />
        </div>
        <div class="channel column justify-end items-end">
          <div class="column no-wrap best-value-container justify-center items-center">
            <div class="best-value bg-amber text-black text-center">Best Value</div>
            <div class="column no-wrap">
              <div class="bg-black text-white price column no-wrap q-pa-xl">
                <h6 class="q-my-md">Best amount</h6>
                <div class="row no-wrap">
                  <span class="text-caption">₱</span>
                  <h4 class="q-ma-none">500</h4>
                </div>
                <p class="text-caption">Donate anytime</p>
                <p class="">Your donation helps us provide care and shelter for animals in need.</p>
                <p class="text-caption">Can sustain 2 set of lunch</p>
                <div class="column justify-center items-center">
                  <q-btn
                    label="Get Started"
                    class="bg-white text-black q-pa-sm"
                    flat
                    no-caps
                    @click="scrollToDiv('mission')"
                    style="width: 200px"
                  />
                </div>
              </div>
              <div class="text-black benefit text-black q-pa-xl">
                <div class="row no-wrap justify-start items-center">
                  <q-icon name="task_alt" size="xs" class="q-mr-sm" />
                  <p class="text-caption q-ma-none">Can buy 1kg meat</p>
                </div>
                <div class="row no-wrap justify-start items-center">
                  <q-icon name="task_alt" size="xs" class="q-mr-sm" />
                  <p class="text-caption q-ma-none">Can buy 5kg Rice</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="eaight-layer column justify-center items-center no-wrap">
      <h2 class="q-ma-none q-my-xl" :class="maxScrollTop >= 4651 ? 'show-in' : ''">
        Join TAARA in maximizing the happiness and well-being of pets by adopting, volunteering, or
        making a donation. Let's make a difference together!
      </h2>
      <q-btn
        label="Get Involved"
        class="bg-black text-white q-pa-sm q-mb-lg q-px-md"
        flat
        no-caps
        to="volunteer-form"
      />

      <img
        src="../image/eight-layer-final-ai-brush-removebg-3a3jv43.png"
        alt=""
        :class="maxScrollTop >= 5100 ? 'show-in' : ''"
      />
    </div>
    <div id="footerDiv" ref="footerDiv">
      <taaraFooter />
    </div>
  </q-page>
</template>

<script src="../pages/taara/script/publicView"></script>

<style lang="scss" src="../pages/taara/style/publicView.scss" scoped></style>
