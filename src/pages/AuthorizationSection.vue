<template>
  <q-page>
    <div class="row no-wrap justify-between items-center">
      <q-tabs dense v-model="tab" inline-label flat active-color="primary">
        <q-tab name="1" icon="sym_r_identity_platform" label="Public  Users" no-caps />
        <q-tab
          name="2"
          icon="sym_r_person_raised_hand"
          label="Volunteer "
          no-caps
          style="width: 170px"
          class="relative-position"
        >
          <div class="absolute-right" style="margin-right: -25px">
            <q-badge
              v-if="store.pendingVolunteer"
              color="red"
              align="middle"
              class="absolute-right relative-position"
              style="height: 20px; width: 20px"
            >
              <div class="absolute-center text-caption">
                {{ store.pendingVolunteer }}
              </div>
            </q-badge>
          </div></q-tab
        >
        <q-tab name="3" icon="sym_r_manage_accounts" label="Officials" no-caps />
      </q-tabs>
    </div>
    <q-separator color="grey-3" class="q-mb-md" />
    <ReusableTable
      row-key="user_id"
      :rows="userRows"
      :columns="userColumns"
      separator="vertical"
      :rows-per-page-options="[10]"
      :title="tableConfig.title"
      :visible-columns="tableConfig.columns"
      selection="multiple"
      v-model="search"
      v-model:selected="arrayOfId"
      v-model:confirm="confirm"
      :tableAction="tableAction"
      :preventAction="preventAction"
      :showBtns="false"
    >
      <template #cell-fullName="{ row }">
        <q-img
          height="30px"
          width="30px"
          class="radius-100 q-mr-sm"
          :src="
            row?.image_path
              ? getImageLink(row.image_path)
              : row.sex == 1
                ? 'no-profile-male.svg'
                : 'no-profile-female.svg'
          "
        />
        {{ row.first_name }}
        {{ row.middle_name }}
        {{ row.last_name }}
      </template>
      <template #cell-application_status="{ row }">
        <div
          class="row no-wrap q-px-sm radius-5 items-center text-white"
          :class="statusColor(row.application_status)"
        >
          <q-icon :name="statusIcon(row.application_status)" size="1rem" class="q-mr-sm" />
          {{ statusText(row.application_status) }}
        </div>
      </template>
      <template #cell-age="{ row }">
        {{ calculateAge(row.birth_date) }}
      </template>
      <template #cell-id="{ rowIndex }">
        {{ rowIndex + 1 }}
      </template>
      <template #cell-phone_number="{ row }"> +63 {{ row.phone_number }} </template>
      <template #cell-btn="{ row }">
        <q-btn icon="sym_r_more_vert" dense flat size=".7rem" :ripple="false">
          <q-menu anchor="bottom left" self="top right">
            <q-list dense style="min-width: 100px" v-if="tab != 2">
              <q-item clickable v-close-popup @click="tableAction(row, 'View')">
                <q-item-section>View</q-item-section>
                <q-item-section side>
                  <q-icon name="sym_r_visibility" size="1.2rem" />
                </q-item-section>
              </q-item>

              <q-item clickable v-close-popup @click="tableAction(row, 'Edit')">
                <q-item-section>Edit</q-item-section>
                <q-item-section side>
                  <q-icon name="sym_r_edit" size="1.2rem" />
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable @click="tableAction(row, 'Deactivate')">
                <q-item-section>{{
                  row.is_activated == 0 ? 'Activate' : 'Deactivate'
                }}</q-item-section>
                <q-item-section side>
                  <q-icon
                    :name="row.is_activated == 0 ? 'sym_r_toggle_off' : 'sym_r_toggle_on'"
                    size="1.2rem"
                    :color="row.is_activated == 0 ? 'negative' : 'positive'"
                  />
                </q-item-section>
              </q-item>
            </q-list>
            <q-list dense style="min-width: 100px" v-if="tab == 2">
              <q-item
                v-if="row.application_status != 1"
                clickable
                v-close-popup
                @click="tableAction(row, 'View')"
              >
                <q-item-section>View</q-item-section>
                <q-item-section side>
                  <q-icon name="sym_r_visibility" size="1.2rem" />
                </q-item-section>
              </q-item>
              <q-item
                v-if="row.application_status == 1"
                clickable
                v-close-popup
                @click="tableAction(row, 'View_Form')"
              >
                <q-item-section>View Form</q-item-section>
                <q-item-section side>
                  <q-icon name="sym_r_fact_check" size="1.2rem" />
                </q-item-section>
              </q-item>
              <q-item
                v-if="row.application_status == 1"
                clickable
                v-close-popup
                @click="tableAction(row, 'Approve')"
              >
                <q-item-section>Approve</q-item-section>
                <q-item-section side>
                  <q-icon name="sym_r_thumb_up" size="1.2rem" color="positive" />
                </q-item-section>
              </q-item>
              <q-item
                v-if="row.application_status == 1"
                clickable
                v-close-popup
                @click="tableAction(row, 'Disapprove')"
              >
                <q-item-section>Disapprove</q-item-section>
                <q-item-section side>
                  <q-icon name="sym_r_thumb_down" size="1.2rem" color="negative" />
                </q-item-section>
              </q-item>
              <q-item
                clickable
                v-close-popup
                @click="tableAction(row, 'Edit')"
                v-if="row.application_status != 1"
              >
                <q-item-section>Edit</q-item-section>
                <q-item-section side>
                  <q-icon name="sym_r_edit" size="1.2rem" />
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item
                clickable
                @click="tableAction(row, 'Deactivate')"
                v-if="row.application_status != 1"
              >
                <q-item-section>{{
                  row.is_activated == 0 ? 'Activate' : 'Deactivate'
                }}</q-item-section>
                <q-item-section side>
                  <q-icon
                    :name="row.is_activated == 0 ? 'sym_r_toggle_off' : 'sym_r_toggle_on'"
                    size="1.2rem"
                    :color="row.is_activated == 0 ? 'negative' : 'positive'"
                  />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
    </ReusableTable>
    <q-dialog position="right" full-height maximized v-model="editDialog">
      <q-card style="width: 50vw; height: 500px" class="text-black">
        <q-card-section class="q-py-md row no-wrap justify-between items-center">
          <div>{{ mode }}</div>
          <q-icon name="close" size="1.2rem" @click="editDialog = !editDialog" />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-px-lg row no-wrap justify-between items-center">
          <div class="column no-wrap w-100">
            <div class="row no-wrap justify-between items-start">
              <q-img
                :src="
                  previewImage
                    ? previewImage
                    : userData?.sex == 1
                      ? 'no-profile-male.svg'
                      : 'no-profile-female.svg'
                "
                height="120px"
                width="120px"
                class="radius-100"
              />
              <q-btn
                icon="sym_r_photo_camera"
                flat
                dense
                @click="triggerUpload()"
                :disable="mode == 'View'"
              />
              <q-file
                class="q-mt-sm hidden"
                v-model="fileStorage"
                outlined
                dense
                ref="myFile"
                @update:model-value="imageFnUpdate()"
              />
            </div>
            <div class="text-body1">
              {{ userData?.first_name }} {{ userData?.middle_name }} {{ userData?.last_name }}
            </div>
            <div class="text-grey-7">{{ userData?.email_address }}</div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-tabs
            v-model="editTab"
            dense
            class="text-grey"
            active-color="primary"
            indicator-color="primary"
            align="left"
            inline-label
            no-caps
          >
            <q-tab name="1" label="Personal Details" icon="person" />
            <q-tab name="2" label="Address" icon="travel_explore" />
            <q-tab name="3" label="Credentials" icon="admin_panel_settings" />
            <q-tab name="5" label="Others" icon="dynamic_feed" />
          </q-tabs>

          <q-separator />

          <q-tab-panels v-model="editTab" animated>
            <q-tab-panel name="1" class="column no-wrap justify-between" style="min-height: 380px">
              <div class="row items-start">
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">First name</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.first_name"
                    dense
                    placeholder="First name"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Middle name</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.middle_name"
                    dense
                    placeholder="First name"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Last name</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.last_name"
                    dense
                    placeholder="First name"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Suffix</div>
                  <q-select
                    :readonly="mode == 'View'"
                    class="q-mr-md q-mt-sm"
                    outlined
                    dense
                    v-model="userData.suffix"
                    :options="nameSuffixes"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Birthdate</div>
                  <q-input
                    :readonly="mode == 'View'"
                    class="q-mt-sm q-mr-md"
                    outlined
                    dense
                    v-model="userData.birth_date"
                    mask="date"
                    :rules="['date']"
                    error-message="Birthdate required!"
                    hide-bottom-space
                  >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-date v-model="userData.birth_date" mask="YYYY-MM-DD">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="Close" color="primary" flat />
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Civil status</div>
                  <q-select
                    :readonly="mode == 'View'"
                    class="q-mr-md q-mt-sm"
                    outlined
                    dense
                    v-model="userData.civil_status"
                    :options="civilStatusOption"
                    emit-value
                    map-options
                    :rules="[(val) => !!val || 'Civil status required!']"
                    hide-bottom-space
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Occupation</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.occupation"
                    dense
                    placeholder="Suffix"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Sex</div>
                  <q-select
                    :readonly="mode == 'View'"
                    class="q-mr-md q-mt-sm"
                    outlined
                    dense
                    v-model="userData.sex"
                    :options="sexOption"
                    map-options
                    emit-value
                    :rules="[(val) => !!val || 'Sex required!']"
                    hide-bottom-space
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Phone no.</div>
                  <q-input
                    :readonly="mode == 'View'"
                    dense
                    outlined
                    class="q-mt-sm q-mr-md"
                    v-model="userData.phone_number"
                    hide-bottom-space
                    :rules="[
                      (val) => !!val || 'Contact no. required!',
                      (val) =>
                        /^\+?[0-9]*$/.test(val) ||
                        'Only numbers and an optional + at the start are allowed',
                    ]"
                  />
                </div>
              </div>
              <div class="row no-wrap" v-if="mode == 'Edit'">
                <q-btn
                  label="Cancel"
                  v-close-popup
                  no-caps
                  outline
                  color="black"
                  class="q-mr-md"
                  style="width: 200px"
                  unelevated
                  :ripple="false"
                />
                <q-btn
                  label="Save"
                  @click="saveFn()"
                  :ripple="false"
                  no-caps
                  color="primary"
                  style="width: 200px"
                  unelevated
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="2" class="column no-wrap justify-between" style="min-height: 380px">
              <div class="row items-start">
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Street</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.street"
                    dense
                    placeholder="Street"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Brgy</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.brgy_name"
                    dense
                    placeholder="First name"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">City/Municipality</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.city_municipality"
                    dense
                    placeholder="First name"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Province</div>
                  <q-select
                    :readonly="mode == 'View'"
                    class="q-mr-md q-mt-sm"
                    outlined
                    dense
                    v-model="userData.province"
                    :options="nameSuffixes"
                  />
                </div>
              </div>
              <div class="row no-wrap" v-if="mode == 'Edit'">
                <q-btn
                  label="Cancel"
                  v-close-popup
                  no-caps
                  outline
                  color="black"
                  class="q-mr-md"
                  style="width: 200px"
                  unelevated
                  :ripple="false"
                />
                <q-btn
                  label="Save"
                  @click="saveFn()"
                  :ripple="false"
                  no-caps
                  color="primary"
                  style="width: 200px"
                  unelevated
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="3" class="column no-wrap justify-between" style="min-height: 380px">
              <div class="column no-wrap items-start">
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Email Address</div>
                  <q-input
                    :readonly="mode == 'View'"
                    dense
                    outlined
                    v-model="userData.email_address"
                    class="q-mt-sm q-mr-md"
                    :rules="[
                      (val) => !!val || 'Email address required!',
                      (val) => /.+@.+\..+/.test(val) || 'Enter a valid email address',
                    ]"
                    style="width: 400px"
                    hide-bottom-space
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Username</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.username"
                    dense
                    placeholder="First name"
                    class="q-mr-md q-mt-sm"
                  />
                </div>
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Password</div>
                  <q-input
                    :readonly="mode == 'View'"
                    v-model="userData.password"
                    dense
                    outlined
                    placeholder="***************"
                    class="q-mt-sm"
                    :type="isPwd ? 'password' : 'text'"
                    style="width: 400px"
                    hint="Type new password"
                  >
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </div>
              </div>
              <div class="row no-wrap" v-if="mode == 'Edit'">
                <q-btn
                  label="Cancel"
                  v-close-popup
                  no-caps
                  outline
                  color="black"
                  class="q-mr-md"
                  style="width: 200px"
                  unelevated
                  :ripple="false"
                />
                <q-btn
                  label="Save"
                  @click="saveFn()"
                  :ripple="false"
                  no-caps
                  color="primary"
                  style="width: 200px"
                  unelevated
                />
              </div>
            </q-tab-panel>

            <q-tab-panel name="5" class="column no-wrap justify-between" style="min-height: 380px">
              <div class="column items-start">
                <div class="column no-wrap q-mb-md">
                  <div class="q-mr-md">Bio</div>
                  <q-input
                    :readonly="mode == 'View'"
                    outlined
                    v-model="userData.Bio"
                    dense
                    type="textarea"
                    placeholder="First name"
                    class="q-mr-md q-mt-sm"
                    style="width: 600px"
                  />
                </div>
              </div>
              <div class="row no-wrap" v-if="mode == 'Edit'">
                <q-btn
                  label="Cancel"
                  v-close-popup
                  no-caps
                  outline
                  color="black"
                  class="q-mr-md"
                  style="width: 200px"
                  unelevated
                  :ripple="false"
                />
                <q-btn
                  label="Save"
                  @click="saveFn()"
                  :ripple="false"
                  no-caps
                  color="primary"
                  style="width: 200px"
                  unelevated
                />
              </div>
            </q-tab-panel>
          </q-tab-panels>
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirm" persistent>
      <q-card class="q-pa-md">
        <q-card-section class="column items-center">
          <q-icon name="sym_r_person_remove" color="primary" size="2.5rem" />
          <span class="q-ml-sm text-black text-body1 q-mt-md">
            Are you sure you want to archive this account?
          </span>
          <span class="q-ml-sm text-caption text-grey-7 q-mt-sm">
            This action is irreversible.
          </span>
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            outline
            label="Cancel"
            v-close-popup
            color="primary"
            no-caps
            style="width: 180px"
            dense
          />
          <q-btn
            label="Confirm"
            unelevated
            color="primary"
            no-caps
            dense
            v-close-popup
            style="width: 180px"
            @click="softDeleteFn()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog position="right" full-height maximized v-model="formDialog">
      <q-card style="width: 50vw; height: 500px" class="text-black">
        <q-card-section class="q-py-md row no-wrap justify-between items-center">
          <div>{{ mode }}</div>
          <q-icon name="close" size="1.2rem" @click="formDialog = !formDialog" />
        </q-card-section>
        <q-separator />
        <q-stepper v-model="step" ref="stepper" color="primary" animated flat class="full-height">
          <q-step
            :name="1"
            :title="step == 1 ? 'Personal Information' : ''"
            icon="settings"
            :done="step > 1"
          >
            <q-form class="full-width q-ma-none" @submit="step = 2">
              <div class="row no-wrap">
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">First Name</p>
                  <q-input
                    filled
                    dense
                    placeholder="Ex: Juan"
                    v-model="volunteerData.first_name"
                    class="input"
                    readonly
                  />
                </div>
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Last Name</p>
                  <q-input
                    filled
                    dense
                    placeholder="Ex: Juan"
                    class="input"
                    v-model="volunteerData.last_name"
                    readonly
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
                    :options="sexOption"
                    placeholder="Ex: Male"
                    v-model="volunteerData.sex"
                    readonly
                  />
                </div>
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Birth Date</p>

                  <q-input
                    filled
                    dense
                    class="input full-width"
                    mask="####-##-##"
                    placeholder="Ex: 2000/05/23"
                    readonly
                    v-model="volunteerData.birth_date"
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
                            v-model="volunteerData.birth_date"
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
                    placeholder="9234567891"
                    v-model="volunteerData.phone_number"
                  />
                </div>
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Civil Status</p>
                  <q-select
                    filled
                    dense
                    class="civil_status"
                    emit-value
                    map-options
                    :options="civilStatusOption"
                    placeholder="Ex: Married"
                    v-model="volunteerData.civil_status"
                    readonly
                  />
                </div>
              </div>
              <div class="row no-wrap occupation-container">
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Occupation</p>
                  <q-input
                    filled
                    dense
                    placeholder="Ex: Juan"
                    class="input"
                    v-model="volunteerData.occupation"
                    readonly
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
                    placeholder="Ex: Juan"
                    class="input"
                    v-model="volunteerData.street"
                    readonly
                  />
                </div>
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Barangay</p>
                  <q-input
                    filled
                    dense
                    placeholder="Ex: Juan"
                    v-model="volunteerData.brgy_name"
                    class="input"
                    readonly
                  />
                </div>
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Municipality</p>
                  <q-input
                    filled
                    dense
                    placeholder="Ex: Juan"
                    class="input"
                    v-model="volunteerData.city_municipality"
                    readonly
                  />
                </div>
              </div>
              <div class="row no-wrap province-container">
                <div class="q-pa-sm field-container">
                  <p class="q-ma-none q-ml-sm">Province</p>
                  <q-input
                    filled
                    dense
                    placeholder="Ex: Juan"
                    class="input"
                    v-model="volunteerData.province"
                    readonly
                  />
                </div>
              </div>
              <div class="row justify-end items-end q-pa-sm">
                <q-btn class="bg-primary text-white q-px-lg" label="Next" no-caps type="submit" />
              </div>
            </q-form>
          </q-step>

          <q-step
            :name="2"
            :title="step == 2 ? 'Background Check' : ''"
            icon="create_new_folder"
            :done="step > 2"
          >
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
                      readonly
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
                      readonly
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
                      readonly
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

          <q-step
            :name="3"
            :title="tab == 3 ? 'Skills and Experience' : ''"
            icon="assignment"
            :done="step > 3"
          >
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
                    readonly
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
                    readonly
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
                    readonly
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
                    readonly
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
                    readonly
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
        </q-stepper>
      </q-card>
    </q-dialog>
    <OutputDialog v-model:outputDialog="outputDialog" v-model:outputObj="outputObj" />
  </q-page>
</template>
<script>
import ReusableTable from 'src/components/ReusableTable.vue'
import { civilStatusOption, nameSuffixes, sexOption } from 'src/composable/optionsComposable'
import {
  activateOrDeactivate,
  approveDisapproveVolunteer,
  getSpecificVolunteer,
  getUserByType,
  softDeleteUser,
  updateUser,
} from 'src/composable/latestComposable'
import { ref, watchEffect } from 'vue'
import { useQuasar } from 'quasar'
import { calculateAge, getImageLink } from 'src/composable/simpleComposable'
import { globalStore } from 'src/stores/global-store'
import { updatePublicUserImage } from 'src/composable/latestPublicComposable'
import { watch } from 'vue'
import OutputDialog from 'src/components/OutputDialog.vue'
export default {
  components: {
    ReusableTable,
    OutputDialog,
  },
  setup() {
    const obj = { 3: 'Officials', 2: 'Volunteer', 1: 'Public Users' }
    const $q = useQuasar()
    const tab = ref('2')
    const editTab = ref('1')
    const search = ref(null)
    const userRows = ref([])
    const confirm = ref(false)
    const editDialog = ref(false)
    const pages = ref([])
    const userData = ref()
    const mode = ref('')
    const myFile = ref(null)
    const arrayOfId = ref([])
    const tableConfig = ref({ title: '', columns: [] })
    const store = globalStore()
    const fileStorage = ref(null)
    const outputDialog = ref(false)
    const formDialog = ref(true)
    const outputObj = ref({})
    const step = ref(1)
    const volunteerData = ref({})
    const tableAction = async (data, modeParam) => {
      editTab.value = '1'
      mode.value = modeParam
      userData.value = { ...data }
      console.log(userData.value)

      previewImage.value = data.image_path
      if (['Edit', 'View'].includes(modeParam)) {
        editDialog.value = !editDialog.value
      } else if (modeParam == 'Deactivate') {
        const text = data.is_activated == 0 ? 'Activating' : 'Deactivating'
        $q.loading.show({ group: 'update', message: `${text}. please wait ...` })
        const response = await activateOrDeactivate(
          data.is_activated == 0 ? 1 : 0,
          data.user_id,
          store.userData.user_id,
          store.userData.user_type,
        )
        setTimeout(() => {
          const text1 = data.is_activated == 0 ? 'Activated' : 'Deactivated'
          $q.loading.hide()
          outputDialog.value = true
          outputObj.value = {
            icon: 'check_circle',
            title: response.message,
            subtext: `The user has been successfully ${text1}.`,
          }
          fetchFn()
        }, 1000)
      } else if (modeParam == 'Approve') {
        $q.loading.show({ group: 'update', message: `Approving Volunteer. please wait ...` })
        const response = await approveDisapproveVolunteer(
          2,
          data.user_id,
          store.userData.user_id,
          store.userData.user_type,
        )
        setTimeout(() => {
          $q.loading.hide()
          outputDialog.value = true
          outputObj.value = {
            icon: 'check_circle',
            title: response.message,
            subtext: `The volunteer has been successfully Approve.`,
          }
          fetchFn()
        }, 1000)
      } else if (modeParam == 'Disapprove') {
        $q.loading.show({ group: 'update', message: `Disapproving Volunteer. please wait ...` })
        const response = await approveDisapproveVolunteer(
          3,
          data.user_id,
          data.volunteer_id,
          store.userData.user_id,
          store.userData.user_type,
        )
        setTimeout(() => {
          $q.loading.hide()
          outputDialog.value = true
          outputObj.value = {
            icon: 'check_circle',
            title: response.message,
            subtext: `The volunteer has been successfully Disapprove.`,
          }
          fetchFn()
        }, 1000)
      } else if (modeParam == 'View_Form') {
        formDialog.value = !formDialog.value
        volunteerData.value = await getSpecificVolunteer(data.volunteer_id)
      } else {
        arrayOfId.value.push(data.user_id)
        confirm.value = !confirm.value
      }
    }

    const saveFn = () => {
      $q.loading.show({
        group: 'update',
        message: 'Updating. Please wait...',
      })

      updateUser(userData.value, store.userData.user_id, store.userData.user_type).then(
        (response) => {
          setTimeout(() => {
            $q.loading.show({
              group: 'update',
              message: response.message,
            })
          }, 500)
          if (response.status == 'success') {
            const index = userRows.value.findIndex((row) => row.user_id === userData.value.user_id)

            if (index !== -1) {
              userRows.value[index] = { ...userData.value }
            }
          }
          setTimeout(() => {
            editDialog.value = false
            $q.loading.hide()
          }, 1000)
        },
      )
    }

    const softDeleteFn = () => {
      $q.loading.show({
        group: 'update',
        message: 'Archieving user. Please wait...',
      })
      softDeleteUser(arrayOfId.value, store.userData.user_id, store.userData.type).then(
        (response) => {
          if (response.status == 'success') {
            setTimeout(() => {
              $q.loading.show({
                group: 'update',
                message: response.message,
              })
            }, 1000)
            setTimeout(() => {
              $q.loading.hide()
            }, 2000)
            getUserByType(tab.value).then((response) => {
              userRows.value = response
            })
          }
        },
      )
    }

    const fetchFn = () => {
      tableConfig.value.title = `${obj[tab.value]} List`
      tableConfig.value.columns = ['3', '2'].includes(tab.value)
        ? ['id', 'fullName', 'email', 'roles', 'age', 'profession', 'phone_number', 'btn']
        : ['id', 'fullName', 'email', 'age', 'profession', 'phone_number', 'btn']
      if (tab.value == 2) {
        tableConfig.value.columns.push('application_status')
      }
      getUserByType(tab.value).then((response) => {
        userRows.value = response
        console.log(userRows.value)
      })
    }

    watchEffect(() => {
      fetchFn()
    })

    const previewImage = ref(null)
    const imageFnUpdate = () => {
      previewImage.value = URL.createObjectURL(fileStorage.value)
    }

    const statusColor = (status) => {
      const obj = {
        1: 'bg-orange  ',
        2: 'bg-positive q-px-sm',
        3: 'bg-negative q-px-sm',
      }
      return obj[status]
    }

    const statusIcon = (status) => {
      const obj = {
        1: 'sym_r_assignment',
        2: 'sym_r_thumb_up',
        3: 'sym_r_thumb_down',
      }
      return obj[status]
    }

    const statusText = (status) => {
      const obj = {
        1: 'Pending',
        2: 'Approved',
        3: 'Disapproved',
      }
      return obj[status]
    }

    const triggerUpload = () => {
      myFile.value.pickFiles()
    }

    const showNoAccess = ref(false)
    const preventAction = () => {
      const userType = store.userData.user_type
      const userRole = store.userData.roles

      const official = [1, 2, 3].includes(userRole) && userType == 3
      const volunteer = [5].includes(userRole) && userType == 2
      const result = userType == 3 ? official : volunteer

      if (!result) {
        showNoAccess.value = true
        return false
      }
      return true
    }

    watch(
      () => fileStorage.value,
      async (newVal, oldVal) => {
        if (newVal != oldVal) {
          $q.loading.show({ group: 'update', message: 'Update your image. Please wait ...' })
          const response = await updatePublicUserImage(newVal, userData.value.user_id)
          $q.loading.show({ group: 'update', message: response.message })
          if (response.status == 'success') {
            fetchFn()
          }
          setTimeout(() => {
            $q.loading.hide()
          }, 500)
        }
      },
    )
    return {
      volunteerData,
      formDialog,
      outputObj,
      outputDialog,
      preventAction,
      showNoAccess,
      triggerUpload,
      fileStorage,
      myFile,
      previewImage,
      imageFnUpdate,
      calculateAge,
      store,
      statusText,
      statusColor,
      statusIcon,
      getImageLink,
      search,
      softDeleteFn,
      arrayOfId,
      tableConfig,
      pages,
      saveFn,
      confirm,
      isPwd: ref(true),
      civilStatusOption,
      nameSuffixes,
      sexOption,
      editTab,
      editDialog,
      step,
      mode,
      userData,
      tableAction,
      userRows,
      tab,
      userColumns: [
        { name: 'id', label: 'ID', field: 'user_id', align: 'center' },
        {
          name: 'fullName',
          label: 'Full Name',
          field: 'first_name',
          sortable: true,
          align: 'left',
        },
        { name: 'email', label: 'Email', field: 'email_address', sortable: true, align: 'center' },
        {
          name: 'roles',
          label: 'Role',
          field: 'position_title',
          sortable: true,
          align: 'center',
          style: 'max-width: 150px; word-wrap: break-word; white-space: normal;',
        },
        { name: 'age', label: 'Age', field: 'birth_date', sortable: true, align: 'center' },
        {
          name: 'profession',
          label: 'Profession',
          field: 'occupation',
          sortable: true,
          align: 'center',
        },
        {
          name: 'phone_number',
          label: 'Phone no.',
          field: 'phone_number',
          sortable: true,
          align: 'center',
        },
        {
          name: 'application_status',
          label: 'Status',
          field: 'application_status',
          align: 'center',
        },
        {
          name: 'btn',
          label: '',
          field: 'btn',
          sortable: true,
          align: 'center',
        },
      ],
    }
  },
}
</script>
