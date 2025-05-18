<template>
  <q-page>
    <!-- <div class="first-layer column justify-center items-center text-body1">
      <div class="inner-div column justify-center items-center relative-position">
        <div class="relative-position fi-container">
          <div class="bg-amber first-shape"></div>
          <div class="second-shape bg-blue"></div>
          <img src="../image/3343274.png" alt="" class="first-image" />
        </div>
        <div class="relative-position si-container">
          <div class="bg-info first-shape"></div>
          <div class="second-shape bg-purple"></div>
          <img src="../image/3797592.png" alt="" class="second-image" />
        </div>

        <h3 class="text-center">
          Become a Champion for Pets:<br />
          <span class="text-primary"> Volunteer</span> with Us!”
        </h3>
        <p>
          “Unite with fellow animal lovers and make a lasting difference in the lives of pets in
          need.”
        </p>
        <q-btn
          label="Get Started"
          class="bg-black text-white q-pa-sm q-mb-lg q-px-md"
          flat
          no-caps
        />
      </div>
    </div> -->
    <div
      class="second-layer q-pa-lg text-body1 q-mt-xl column no-wrap items-center relative-position"
    >
      <h4 class="q-mb-sm">Let's get you started</h4>
      <p class="q-mb-md">Enter the detials to get going</p>
      <div class="bg-amber first-shape"></div>
      <div class="second-shape bg-blue"></div>
      <div class="absolute-center third-shape bg-grey-1"></div>
      <div class="form-container column no-wrap">
        <q-stepper
          v-model="step"
          ref="stepper"
          color="primary"
          animated
          flat
          vertical
          class="full-height"
        >
          <q-step :name="1" title="Personal Information" icon="settings" :done="step > 1">
            <q-form class="full-width q-ma-none" @submit="step = 2">
              <div class="row no-wrap">
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">First Name</p>
                  <q-input
                    filled
                    dense
                    label="Ex: Juan"
                    stack-label
                    v-model="volunteer_form.first_name"
                    class="input"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                  />
                </div>
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Last Name</p>
                  <q-input
                    filled
                    dense
                    label="Ex: Juan"
                    stack-label
                    class="input"
                    v-model="volunteer_form.last_name"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                  />
                </div>
              </div>
              <div class="row no-wrap">
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Gender</p>
                  <q-select
                    filled
                    dense
                    class="age full-width"
                    map-options
                    emit-value
                    :options="sex_options"
                    label="Ex: Male"
                    stack-label
                    v-model="volunteer_form.sex"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                  />
                </div>
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Birth Date</p>

                  <q-input
                    filled
                    dense
                    class="input full-width"
                    stack-label
                    mask="####-##-##"
                    label="Ex: 2000/05/23"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                    v-model="volunteer_form.birth_date"
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date
                            minimal
                            today-btn
                            emit-immediately
                            mask="YYYY-MM-DD"
                            default-year-month="2000/01"
                            v-model="volunteer_form.birth_date"
                          >
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="row no-wrap">
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Phone No.</p>
                  <q-input
                    filled
                    dense
                    prefix="+63"
                    class="phone_number"
                    label="Ex: +63 (923) 456 - 7891"
                    stack-label
                    mask="phone"
                    v-model="volunteer_form.phone_number"
                    :rules="[
                      (val) => (!!val && val.length == 16) || '',
                      (val) => (val && val[1] === '9') || 'Phone number must start with 9',
                    ]"
                    hide-bottom-space
                  />
                </div>
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Civil Status</p>
                  <q-select
                    filled
                    dense
                    class="civil_status"
                    emit-value
                    :options="civil_status_options"
                    stack-label
                    label="Ex: Married"
                    v-model="volunteer_form.civil_status"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                  />
                </div>
              </div>
              <div class="row no-wrap occupation-container">
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Occupation</p>
                  <q-input
                    filled
                    dense
                    label="Ex: Juan"
                    stack-label
                    class="input"
                    v-model="volunteer_form.occupation"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                  />
                </div>
              </div>
              <p class="q-mt-md q-mb-none q-pl-sm label">Address</p>
              <div class="row no-wrap">
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Street</p>
                  <q-input
                    filled
                    dense
                    label="Ex: Juan"
                    stack-label
                    class="input"
                    v-model="volunteer_form.street"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                  />
                </div>
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Barangay</p>
                  <q-input
                    filled
                    dense
                    label="Ex: Juan"
                    stack-label
                    v-model="volunteer_form.brgy_name"
                    class="input"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                  />
                </div>
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Municipality</p>
                  <q-input
                    filled
                    dense
                    label="Ex: Juan"
                    stack-label
                    class="input"
                    v-model="volunteer_form.city_municipality"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                  />
                </div>
              </div>
              <div class="row no-wrap province-container">
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Province</p>
                  <q-input
                    filled
                    dense
                    label="Ex: Juan"
                    stack-label
                    class="input"
                    v-model="volunteer_form.province"
                    :rules="[(val) => !!val || '']"
                    hide-bottom-space
                  />
                </div>
              </div>
              <div class="row justify-end items-end q-pa-sm">
                <q-btn class="bg-primary text-white q-px-lg" label="Next" no-caps type="submit" />
              </div>
            </q-form>
          </q-step>

          <q-step :name="2" title="Background Check" icon="create_new_folder" :done="step > 2">
            <q-form @submit="step = 3" class="q-ma-none q-pa-none full-width">
              <div
                class="column justify-center items-center full-width background-check text-body1"
              >
                <div class="row items-center full-width">
                  <div class="q-ma-sm p-div">
                    <p>Are you a member of any other animal welfare organization?</p>
                  </div>
                  <div class="column justify-center radio-div">
                    <q-radio
                      v-model="volunteer_form.member_of_welfare_org"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="Yes"
                      label="Yes"
                    />
                    <q-radio
                      v-model="volunteer_form.member_of_welfare_org"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="No"
                      label="No"
                    />
                  </div>
                </div>
                <div class="row detials-conatiner items-center full-width">
                  <div class="q-ma-sm p-div">
                    <p>Do you have dogs/cats at home?</p>
                  </div>
                  <div class="column justify-center radio-div">
                    <q-radio
                      v-model="volunteer_form.have_pets"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="Yes"
                      label="Yes"
                    />
                    <q-radio
                      v-model="volunteer_form.have_pets"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="No"
                      label="No"
                    />
                  </div>
                </div>

                <div class="row detials-conatiner items-center full-width">
                  <div class="q-ma-sm p-div">
                    <p>Do you have children in your home?</p>
                  </div>
                  <div class="column justify-center radio-div">
                    <q-radio
                      v-model="volunteer_form.have_children"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="Yes"
                      label="Yes"
                    />
                    <q-radio
                      v-model="volunteer_form.have_children"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="No"
                      label="No"
                    />
                  </div>
                </div>

                <div class="row items-center detials-conatiner full-width">
                  <div class="q-ma-sm p-div">
                    <p>Do you have experience in rescuing stray animals?</p>
                  </div>
                  <div class="column justify-center radio-div">
                    <q-radio
                      v-model="volunteer_form.experience_in_recue"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="Yes"
                      label="Yes"
                    />
                    <q-radio
                      v-model="volunteer_form.experience_in_recue"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="No"
                      label="No"
                    />
                  </div>
                </div>

                <div class="column items-start detials-conatiner full-width">
                  <div class="q-ma-sm p-div">
                    <p>If yes, please tell us about it?</p>
                  </div>
                  <q-input
                    class="textarea q-mx-sm"
                    type="textarea"
                    :disable="
                      volunteer_form.experience_in_recue == 'No' ||
                      volunteer_form.experience_in_recue == null
                    "
                    :value="
                      volunteer_form.experience_in_recue == 'No'
                        ? (volunteer_form.experience_details = null)
                        : volunteer_form.experience_in_recue
                    "
                    outlined
                    v-model="volunteer_form.experience_details"
                    stack-label
                    dense
                    :rules="
                      volunteer_form.experience_in_recue == 'No' ? [(val) => val] : [(val) => !!val]
                    "
                  />
                </div>

                <div class="row items-center detials-conatiner full-width">
                  <div class="q-ma-sm p-div">
                    <p>Are vaccinated with the anti-rabies vaccine?</p>
                  </div>
                  <div class="column justify-center radio-div">
                    <q-radio
                      v-model="volunteer_form.vaccinated_anti_rabies"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="Yes"
                      label="Yes"
                    />
                    <q-radio
                      v-model="volunteer_form.vaccinated_anti_rabies"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="No"
                      label="No"
                    />
                  </div>
                </div>

                <div class="row items-center detials-conatiner full-width">
                  <div class="q-ma-sm p-div">
                    <p>If NO, are you willing to get vaccinated?</p>
                  </div>
                  <div class="column justify-center radio-div">
                    <q-radio
                      v-model="volunteer_form.willing_to_be_vaccinated"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="Yes"
                      label="Yes"
                    />
                    <q-radio
                      v-model="volunteer_form.willing_to_be_vaccinated"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="No"
                      label="No"
                    />
                  </div>
                </div>

                <div class="row items-center detials-conatiner full-width">
                  <div class="q-ma-sm p-div">
                    <p>Are your family members in favour of you being a volunteer?</p>
                  </div>
                  <div class="column justify-center radio-div">
                    <q-radio
                      v-model="volunteer_form.family_favor_being_volunteer"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="Yes"
                      label="Yes"
                    />
                    <q-radio
                      v-model="volunteer_form.family_favor_being_volunteer"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="No"
                      label="No"
                    />
                  </div>
                </div>

                <div class="row items-center detials-conatiner full-width">
                  <div class="q-ma-sm p-div">
                    <p>
                      Are you related to any members<br />
                      of TAARA?
                    </p>
                  </div>
                  <div class="column justify-center radio-div">
                    <q-radio
                      v-model="volunteer_form.related_member_in_organization"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="Yes"
                      label="Yes"
                    />
                    <q-radio
                      v-model="volunteer_form.related_member_in_organization"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="No"
                      label="No"
                    />
                  </div>
                </div>

                <div class="row items-center detials-conatiner mobile-column full-width">
                  <div class="q-ma-sm p-div">
                    <p>If yes, please indicate *?</p>
                  </div>
                  <div class="row no-wrap justify-center items-center" style="width: 80%">
                    <q-input
                      class="q-ma-sm"
                      :disable="
                        volunteer_form.related_member_in_organization == 'No' ||
                        volunteer_form.related_member_in_organization == null
                      "
                      :value="
                        volunteer_form.related_member_in_organization == 'No'
                          ? (volunteer_form.related_member_in_organization_name = null)
                          : volunteer_form.related_member_in_organization
                      "
                      filled
                      v-model="volunteer_form.related_member_in_organization_name"
                      label="Name: Ex: Jessy"
                      stack-label
                      dense
                      :rules="
                        volunteer_form.related_member_in_organization == 'Yes'
                          ? [(val) => !!val]
                          : [(val) => val]
                      "
                      hide-bottom-space
                    />
                    <q-input
                      class="q-ma-sm"
                      :disable="
                        volunteer_form.related_member_in_organization == 'No' ||
                        volunteer_form.related_member_in_organization == null
                      "
                      :value="
                        volunteer_form.related_member_in_organization == 'No'
                          ? (volunteer_form.related_member_in_organization_relationship = null)
                          : volunteer_form.related_member_in_organization
                      "
                      filled
                      v-model="volunteer_form.related_member_in_organization_relationship"
                      label="Relationship: Ex: Mother"
                      stack-label
                      dense
                      :rules="
                        volunteer_form.related_member_in_organization == 'Yes'
                          ? [(val) => !!val]
                          : [(val) => val]
                      "
                      hide-bottom-space
                    />
                  </div>
                </div>
                <div class="column items-start detials-conatiner mobile-column full-width">
                  <div class="p-div q-ma-sm">
                    <p>How did you know about our volunteer program?</p>
                  </div>
                  <div class="q-ma-sm autogrow-div column justify-center items-center">
                    <q-input
                      class="autogrow"
                      autogrow
                      filled
                      v-model="volunteer_form.how_know_organization"
                      stack-label
                      label="Ex: Friend"
                      dense
                      :rules="[(val) => !!val]"
                      hide-bottom-space
                    />
                  </div>
                </div>
                <div class="column items-start q-mt-md detials-conatiner full-width">
                  <div class="q-ma-sm p-div">
                    <p>
                      Please indicate your most available days and time that you can be active as a
                      volunteer of the TAARA. *
                    </p>
                  </div>
                  <div class="row no-wrap">
                    <div class="q-mx-xl q-option-group-div column justify-start items-start">
                      <p class="hidden">
                        {{ volunteer_form.most_available_day = group.join(',') }}
                      </p>
                      <q-option-group
                        v-model="group"
                        :options="options"
                        color="green"
                        type="checkbox"
                      />
                    </div>
                    <div class="q-mx-lg column justify-start items-start" style="width: 150px">
                      <q-radio
                        v-model="volunteer_form.most_available_time"
                        checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye"
                        val="1 hour"
                        label="1 hour"
                      />
                      <q-radio
                        v-model="volunteer_form.most_available_time"
                        checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye"
                        val="2 hour"
                        label="2 hour"
                      />
                      <q-radio
                        v-model="volunteer_form.most_available_time"
                        checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye"
                        val="3 hour"
                        label="3 hour"
                      />
                      <q-radio
                        v-model="volunteer_form.most_available_time"
                        checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye"
                        val="4 hour"
                        label="4 hour"
                      />
                      <q-radio
                        v-model="volunteer_form.most_available_time"
                        checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye"
                        val="5 hour"
                        label="5 hour"
                      />
                      <q-radio
                        v-model="volunteer_form.most_available_time"
                        checked-icon="task_alt"
                        unchecked-icon="panorama_fish_eye"
                        val=" "
                        label="others"
                      />
                      <q-input
                        v-if="volunteer_form.most_available_time == ' '"
                        dense
                        filled
                        v-model="volunteer_form.most_available_time"
                      />
                    </div>
                  </div>
                </div>

                <p class="text-red q-ma-sm text-center full-width" v-if="warning == true">
                  All fields are required!
                </p>

                <div class="row justify-between items-center q-pa-sm full-width q-mt-xl">
                  <q-btn
                    class="bg-primary text-white q-px-lg"
                    label="Back"
                    no-caps
                    @click="step = 1"
                  />
                  <q-btn class="bg-primary text-white q-px-lg" label="Next" no-caps type="submit" />
                </div>
              </div>
            </q-form>
          </q-step>

          <q-step :name="3" title="Skills and Experience" icon="assignment" :done="step > 3">
            <q-form @submit="step = 4" class="full-width q-ma-none q-pa-none">
              <div class="column justify-center items-center full-width skills">
                <div class="row justify-start items-start small-label full-width">
                  <h6>Skills & Experience</h6>
                </div>
                <div class="row items-center detials-conatiner">
                  <div class="q-ma-sm p-div">
                    <p>Have you had any formal education in pet care or animal welfare?</p>
                  </div>
                  <div class="q-ma-sm column justify-center radio-div">
                    <q-radio
                      v-model="volunteer_form.formal_education_pet_care"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="Yes"
                      label="Yes"
                    />
                    <q-radio
                      v-model="volunteer_form.formal_education_pet_care"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="No"
                      label="No"
                    />
                  </div>
                </div>

                <div class="row items-center detials-conatiner">
                  <div class="q-ma-sm p-div">
                    <p>Have you done any other volunteer work?</p>
                  </div>
                  <div class="q-ma-sm column justify-center radio-div">
                    <q-radio
                      v-model="volunteer_form.done_any_other_volunteer_work"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="Yes"
                      label="Yes"
                    />
                    <q-radio
                      v-model="volunteer_form.done_any_other_volunteer_work"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="No"
                      label="No"
                    />
                  </div>
                </div>

                <div class="justify-center column items-start detials-conatiner">
                  <div class="q-ma-sm p-div">
                    <p>If yes, indicate if any.</p>
                  </div>
                  <q-input
                    :disable="
                      volunteer_form.done_any_other_volunteer_work == 'No' ||
                      volunteer_form.done_any_other_volunteer_work == null
                    "
                    :value="
                      volunteer_form.done_any_other_volunteer_work == 'No'
                        ? (volunteer_form.done_any_other_volunteer_work_indicate = null)
                        : volunteer_form.done_any_other_volunteer_work_indicate
                    "
                    :rules="
                      volunteer_form.done_any_other_volunteer_work == 'Yes' ? [(val) => !!val] : []
                    "
                    hide-bottom-space
                    v-model="volunteer_form.done_any_other_volunteer_work_indicate"
                    filled
                    type="textarea"
                    class="second-text-area q-mx-sm"
                  />
                </div>
                <div class="row items-center detials-conatiner">
                  <div class="q-ma-sm p-div">
                    <p>Do you have any physical andpsychological limitations/disabilities?</p>
                  </div>
                  <div class="q-ma-sm column justify-center radio-div">
                    <q-radio
                      v-model="volunteer_form.physical_psychological_limitation"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="Yes"
                      label="Yes"
                    />
                    <q-radio
                      v-model="volunteer_form.physical_psychological_limitation"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="No"
                      label="No"
                    />
                  </div>
                </div>

                <div class="justify-center column items-start detials-conatiner">
                  <div class="q-ma-sm p-div">
                    <p>If yes, indicate if any.</p>
                  </div>
                  <q-input
                    :disable="
                      volunteer_form.physical_psychological_limitation == 'No' ||
                      volunteer_form.physical_psychological_limitation == null
                    "
                    :value="
                      volunteer_form.physical_psychological_limitation == 'No'
                        ? (volunteer_form.physical_psychological_limitation_indicate = null)
                        : volunteer_form.physical_psychological_limitation_indicate
                    "
                    :rules="
                      volunteer_form.physical_psychological_limitation == 'Yes'
                        ? [(val) => !!val]
                        : []
                    "
                    hide-bottom-space
                    v-model="volunteer_form.physical_psychological_limitation_indicate"
                    filled
                    type="textarea"
                    class="second-text-area q-mx-sm"
                  />
                </div>
                <div class="justify-center column items-start detials-conatiner">
                  <div class="q-mt-sm q-ml-sm p-div">
                    <p>Person to contact in case of emergency.</p>
                  </div>
                  <div
                    class="row no-wrap jutify-between items-center q-mt-none full-width second-input-div"
                  >
                    <q-input
                      class="q-mx-sm q-mr-lg"
                      standout
                      v-model="volunteer_form.contact_person_emergency_name"
                      label="Name"
                      stack-label
                      dense
                      type="text"
                      :rules="[(val) => !!val || 'Please type your name']"
                    />
                    <q-input
                      class="q-mx-lg"
                      mask="phone"
                      prefix="+63"
                      standout
                      v-model="volunteer_form.contact_person_emergency_number"
                      label="Contact"
                      stack-label
                      dense
                      :rules="[(val) => !!val || 'Please type your contact']"
                    />
                    <q-input
                      class="q-mx-lg"
                      standout
                      v-model="volunteer_form.contact_person_emergency_relationship"
                      label="Relationship: Ex: Mother"
                      stack-label
                      dense
                      :rules="[(val) => !!val || 'Please input relation']"
                    />
                  </div>
                </div>
                <div class="row justify-center items-center q-mt-md">
                  <q-radio
                    class="q-ma-sm"
                    v-model="volunteer_form.field_or_virtual_committee"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Field Committee"
                    label="Field Committe"
                  />
                  <q-radio
                    class="q-ma-sm"
                    v-model="volunteer_form.field_or_virtual_committee"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Virtual Committee"
                    label="Virtual Committee"
                  />
                </div>
                <p class="text-red text-center full-width" v-if="warning == true">
                  All fields are required!
                </p>
                <div class="row justify-between items-center q-pa-sm full-width q-mt-xl">
                  <q-btn
                    class="bg-primary text-white q-px-lg"
                    label="Back"
                    no-caps
                    @click="step = 2"
                  />
                  <q-btn class="bg-primary text-white q-px-lg" label="Next" no-caps type="submit" />
                </div>
              </div>
            </q-form>
          </q-step>

          <q-step :name="4" title="Desire Position" icon="add_comment" :done="step > 4">
            <q-form
              @submit="step = 5"
              class="full-width q-ma-none q-pa-none"
              v-if="volunteer_form.field_or_virtual_committee == 'Field Committee'"
            >
              <div class="column justify-center items-center full-width field-committee">
                <div class="row justify-start items-center">
                  <h6>Field Committee</h6>
                </div>

                <div class="choose-committee-pad">
                  <q-checkbox
                    v-model="chooseWork"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Rescue/Medical Committee"
                    label="Rescue/Medical Committee"
                  />
                  <p class="hidden">
                    {{ volunteer_form.field_or_virtual_committee_position = chooseWork.join(',') }}
                  </p>
                  <ul>
                    <li>Preferably 18 years old and above</li>
                    <li>willing to assist the head of a rescuer during rescue operation</li>
                    <li>
                      Preferably has knowledge in rescuing and/or 1st aid medication to injured
                      animals
                    </li>
                    <li>
                      In charge in rescuing animals in animals in the first district of Albay.
                    </li>
                    <li>Run errands related to TAARA.</li>
                  </ul>
                </div>
                <div class="choose-committee-pad">
                  <q-checkbox
                    v-model="chooseWork"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Animal Care Committee"
                    label="Animal Care Committee"
                  />
                  <ul>
                    <li>Manage the temporary Shelter</li>
                    <li>
                      Help in cleaning, feeding, taking medicine, walking, bathing the rescues
                    </li>
                    <li>Bring the rescues to the vet clinic on their schedule check-ups</li>
                  </ul>
                </div>
                <div class="choose-committee-pad">
                  <q-checkbox
                    v-model="chooseWork"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Adoption Committee"
                    label="Adoption Committee"
                  />
                  <ul>
                    <li>
                      Gather essential information and make posts of cats / dogs up for adoption
                    </li>
                    <li>
                      Record and screen adopters if they are qualified to become new furparents
                    </li>
                    <li>Bringing the adopted cats/dogs to their new home</li>
                  </ul>
                </div>
                <div class="choose-committee-pad">
                  <q-checkbox
                    v-model="chooseWork"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Awareness and Events Committee"
                    label="Awareness and Events Committee"
                  />
                  <ul>
                    <li>Can lead seminar/orientations</li>
                    <li>Can confidently talk in front of people</li>
                    <li>Has experience in coordinating and managing events</li>
                    <li>Can be the spokesperson of TAARA</li>
                  </ul>
                </div>
                <div class="choose-committee-pad">
                  <q-checkbox
                    v-model="chooseWork"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Foster Home Committee"
                    label="Foster Home Committee"
                  />
                  <ul>
                    <li>
                      Can scout for people that are also animal advocates that are willing to foster
                      the rescues
                    </li>
                    <li>
                      Can regularly monitor the well-being and sustenance of the fostered rescues by
                      their selected fosterer
                    </li>
                    <li>
                      willing to provide TEMPORARY SHELTER to the rescues while waiting for their
                      FURever home/fosterer
                    </li>
                    <li>
                      Distributing food support for the rescues while they are under the fosterer’s
                      care (1-2 weeks only)
                    </li>
                  </ul>
                </div>
                <div class="row justify-start items-start detials-conatiner">
                  <div class="q-ma-sm p-div">
                    <p>
                      Do you have any vehicle and would you be willing to drive it to transport
                      rescues or run errands for TAARA? *
                    </p>
                  </div>
                  <div class="column justify-center q-button-div">
                    <q-radio
                      v-model="volunteer_form.have_vehicle"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="Yes"
                      label="Yes"
                    />
                    <q-radio
                      v-model="volunteer_form.have_vehicle"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="No"
                      label="No"
                    />
                  </div>
                </div>

                <div class="column justify-start items-start detials-conatiner">
                  <div class="q-ma-sm p-div">
                    <p>If yes, what type of vehicle it is?</p>
                  </div>
                  <q-input
                    class="q-mx-sm"
                    filled
                    :disable="
                      volunteer_form.have_vehicle == 'No' || volunteer_form.have_vehicle == null
                    "
                    :value="
                      volunteer_form.have_vehicle == 'No'
                        ? (volunteer_form.vehicle_type = null)
                        : volunteer_form.vehicle_type
                    "
                    v-model="volunteer_form.vehicle_type"
                    label="Vehicale type"
                    stack-label
                    dense
                    :rules="volunteer_form.have_vehicle == 'Yes' ? [(val) => !!val] : []"
                    hide-bottom-space
                  />
                </div>

                <p class="text-red text-center full-width" v-if="warning == true">
                  All fields are required!
                </p>
                <div class="row justify-between items-center q-pa-sm full-width q-mt-xl">
                  <q-btn
                    class="bg-primary text-white q-px-lg"
                    label="Back"
                    no-caps
                    @click="step = 3"
                  />
                  <q-btn class="bg-primary text-white q-px-lg" label="Next" no-caps type="submit" />
                </div>
              </div>
            </q-form>
            <q-form
              @submit="step = 5"
              class="full-width q-ma-none q-pa-none"
              v-if="volunteer_form.field_or_virtual_committee == 'Virtual Committee'"
            >
              <div class="column justify-center items-center full-width virtual-committee">
                <div class="row justify-start items-center small-label">
                  <h6>Virtual Committee</h6>
                </div>
                <div class="choose-committee-pad">
                  <p class="hidden">
                    {{ volunteer_form.field_or_virtual_committee_position = chooseWork.join(',') }}
                  </p>
                  <q-checkbox
                    v-model="chooseWork"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Monitoring Committee"
                    label="Monitoring Committee"
                  />
                  <ul>
                    <li>
                      Monitoring the adopted cats/dogs by chatting with the adoptees on the
                      designated GC and checking for weekly picture updates
                    </li>
                    <li>
                      Requires home visit to the adoptees who doesn’t/no longer provide updates
                    </li>
                    <li>
                      managing messages from different people (emergency/adoption/missing) and
                      reporting directly to the coordinators
                    </li>
                  </ul>
                </div>
                <div class="choose-committee-pad">
                  <q-checkbox
                    v-model="chooseWork"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Partnership Committee"
                    label="Partnership Committee"
                  />
                  <ul>
                    <li>
                      Can scout and coordinate with any possible affiliations to TAARA that can
                      benefit the organization to help with its advocacies
                    </li>
                    <li>
                      Can monitor and manage offered/proposed sponsorship for events and in general
                    </li>
                    <li>Can speak in person with partners if need be</li>
                  </ul>
                </div>
                <div class="choose-committee-pad">
                  <q-checkbox
                    v-model="chooseWork"
                    checked-icon="task_alt"
                    unchecked-icon="panorama_fish_eye"
                    val="Arts and Crafts Committee"
                    label="Arts and Crafts Committee"
                  />
                  <ul>
                    <li>
                      Has knowledge of graphic design/presentation (can use different applications)
                    </li>
                    <li>
                      Content Writer for social media purposes and special days (ex. National Aspin
                      Day)
                    </li>
                    <li>Has experience in in photography and filming for documentations</li>
                  </ul>
                </div>

                <div class="row justify-start items-start detials-conatiner">
                  <div class="q-ma-sm p-div">
                    <p>Do you have any experience related to managing social media pages?</p>
                  </div>
                  <div class="column justify-center q-button-div">
                    <q-radio
                      v-model="volunteer_form.experience_managing_social_media"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="Yes"
                      label="Yes"
                    />
                    <q-radio
                      v-model="volunteer_form.experience_managing_social_media"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="No"
                      label="No"
                    />
                  </div>
                </div>
                <div class="column justify-start items-start detials-conatiner">
                  <div class="q-ma-sm p-div">
                    <p>
                      What software or applications do you use in creating layouts or designs?,
                      please indicate here
                    </p>
                  </div>
                  <q-input
                    class="q-mx-sm"
                    filled
                    :disable="
                      volunteer_form.experience_managing_social_media == 'No' ||
                      volunteer_form.experience_managing_social_media == null
                    "
                    :value="
                      volunteer_form.experience_managing_social_media == 'No'
                        ? (volunteer_form.software_use_in_design = null)
                        : volunteer_form.software_use_in_design
                    "
                    :rules="
                      volunteer_form.experience_managing_social_media == 'Yes'
                        ? [(val) => !!val]
                        : [(val) => val]
                    "
                    hide-bottom-space
                    v-model="volunteer_form.software_use_in_design"
                    label="Ex:Figma"
                    stack-label
                    dense
                  />
                </div>

                <div class="column justify-start items-start detials-conatiner">
                  <div class="q-ma-sm p-div">
                    <p>Do you have internet connection at home?</p>
                  </div>
                  <q-input
                    class="q-mx-sm"
                    filled
                    v-model="volunteer_form.have_internet_connection"
                    label="Ex: phone's data"
                    stack-label
                    dense
                    :rules="[(val) => !!val]"
                    hide-bottom-space
                  />
                </div>
                <div class="row justify-start items-start detials-conatiner">
                  <div class="q-ma-sm p-div">
                    <p>Do you have Desktop or Laptop?</p>
                  </div>
                  <div class="column justify-center">
                    <q-radio
                      v-model="volunteer_form.device_use"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="Yes"
                      label="Yes"
                    />
                    <q-radio
                      v-model="volunteer_form.device_use"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="No"
                      label="No"
                    />
                  </div>
                </div>
                <div class="row justify-start items-start detials-conatiner">
                  <div class="q-ma-sm p-div">
                    <p>Are you willing to use it for the task of the virtual committee?</p>
                  </div>
                  <div class="column justify-center">
                    <q-radio
                      v-model="volunteer_form.device_use_willing_to_use"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="Yes"
                      label="Yes"
                    />
                    <q-radio
                      v-model="volunteer_form.device_use_willing_to_use"
                      checked-icon="task_alt"
                      unchecked-icon="panorama_fish_eye"
                      val="No"
                      label="No"
                    />
                  </div>
                </div>
              </div>
              <div class="row justify-between items-center">
                <p class="text-red text-center full-width" v-if="warning == true">
                  All fields are required!
                </p>
                <div class="row justify-between items-center q-pa-sm full-width q-mt-xl">
                  <q-btn
                    class="bg-primary text-white q-px-lg"
                    label="Back"
                    no-caps
                    @click="step = 3"
                  />
                  <q-btn class="bg-primary text-white q-px-lg" label="Next" no-caps type="submit" />
                </div>
              </div>
            </q-form>
          </q-step>

          <q-step :name="5" title="Agreement" icon="add_comment" :done="step > 5">
            <div class="container1 column q-my-lg">
              <div class="row justify-center items-center">
                <q-img class="image" src="../image/TAARA_Logo.jpg" heigth="90px" width="90px" />
              </div>
              <div class="column justify-center items-center aggreement q-mt-md">
                <ul>
                  <li class="q-ma-sm">
                    IF ACCEPTED AS A TAARA’s VOLUNTEER, I UNDERSTAND AND AGREE TO THE FOLLOWING:
                  </li>
                  <li class="q-ma-sm">
                    I understand that my service in TAARA is purely voluntary and I will not receive
                    any compensation or salary in exchange to the services I rendered.
                  </li>
                  <li class="q-ma-sm">
                    I shall always exercise compassion and care to the animals I will encounter.
                  </li>
                  <li class="q-ma-sm">
                    I shall not do anything that may harm or cause trouble to the organization.
                  </li>
                  <li class="q-ma-sm">
                    I will keep all confidential information during and even after my service in the
                    group.
                  </li>
                  <li class="q-ma-sm">
                    I fully acknowledge and assume the responsibility in taking risk in all
                    TAARA-related activities.
                  </li>
                  <li class="q-ma-sm">
                    If I fail to follow the terms of this agreement, I will be terminated from the
                    group at the sole discretion of TAARA.
                  </li>
                </ul>

                <div class="row justify-between items-center q-pa-sm full-width q-mt-xl">
                  <q-btn
                    class="bg-primary text-white q-px-lg"
                    label="Back"
                    no-caps
                    @click="step = 4"
                  />
                  <q-btn
                    class="bg-primary text-white q-px-lg"
                    label="Agree"
                    no-caps
                    @click="step = 6"
                  />
                  <!-- @click="agreeMove(volunteer_form, logInDetails[0].user_id)" -->
                </div>
              </div>
            </div>
          </q-step>
        </q-stepper>
      </div>
    </div>
    <taaraFooter class="footer"></taaraFooter>
  </q-page>
</template>
<script src="pages/taara/script/volunteerForm"></script>

<style scoped lang="scss" src="pages/taara/style/volunteerForm.scss"></style>
