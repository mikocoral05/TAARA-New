<template>
  <q-page>
    <div class="row no-wrap justify-between items-center">
      <q-tabs dense v-model="tab" inline-label flat active-color="primary">
        <q-tab name="3" icon="sym_r_manage_accounts" label="Officials" no-caps />
        <q-tab name="2" icon="sym_r_person_raised_hand" label="Volunteer " no-caps />
        <q-tab name="1" icon="sym_r_identity_platform" label="Public  Users" no-caps />
      </q-tabs>
      <div class="row no-wrap justify-between items-center">
        <q-btn icon="sym_r_add" dense unelevated class="q-mr-md" />
        <q-btn icon="sym_r_upload" dense unelevated />
      </div>
    </div>
    <q-separator color="grey-3" class="q-mb-md" />
    <ReusableTable
      :rows="userRows"
      :columns="volunteerColumns"
      separator="vertical"
      :rows-per-page-options="[10]"
      :visible-columns="
        ['3', '2'].includes(tab)
          ? ['id', 'fullName', 'email', 'roles', 'age', 'profession', 'phone_number', 'btn']
          : ['id', 'fullName', 'email', 'age', 'profession', 'phone_number', 'btn']
      "
    >
      <template #cell-fullName="{ row }">
        <q-avatar size="30px" class="q-mr-md">
          <q-img
            :src="row.img_path || row.sex == 1 ? 'no-profile-male.svg' : 'no-profile-female.svg'"
          />
        </q-avatar>
        {{ row.first_name }}
        {{ row.middle_name }}
        {{ row.last_name }}
      </template>
      <!-- Button slot with icon -->
      <template #cell-btn="{ row }">
        <q-btn icon="sym_r_more_vert" dense flat size=".7rem" :ripple="false">
          <q-menu anchor="bottom left" self="top right">
            <q-list dense style="min-width: 100px">
              <q-item clickable v-close-popup @click="tableAction(row)">
                <q-item-section>View</q-item-section>
                <q-item-section side>
                  <q-icon name="sym_r_visibility" size="1.2rem" />
                </q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="tableAction(row)">
                <q-item-section>Archieve</q-item-section>
                <q-item-section side>
                  <q-icon name="sym_r_edit" size="1.2rem" />
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable @click="tableAction(row)">
                <q-item-section>Archieve</q-item-section>
                <q-item-section side>
                  <q-icon name="keyboard_arrow_right" size="1.2rem" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
    </ReusableTable>
    <q-dialog position="right" full-height v-model="showDialog">
      <q-card style="min-width: 800px; height: 500px" class="text-black">
        <q-card-section class="q-py-md row no-wrap justify-between items-center">
          <div>View</div>
          <q-icon name="close" size="1.2rem" @click="showDialog = !showDialog" />
        </q-card-section>
        <q-separator />
        <q-card-section class="q-px-lg row no-wrap justify-between items-center">
          <div class="column no-wrap" style="width: 30%">
            <q-avatar size="120px" class="q-mr-md">
              <q-img
                :src="
                  userData?.img_path || userData?.sex == 1
                    ? 'no-profile-male.svg'
                    : 'no-profile-female.svg'
                "
              />
            </q-avatar>
            <div class="text-body1">
              {{ userData?.first_name }} {{ userData?.middle_name }} {{ userData?.last_name }}
            </div>
            <div class="text-grey-7">{{ userData?.email_address }}</div>
          </div>
          <div class="row items-center justify-around" style="width: 70%">
            <div class="row no-wrap q-mr-md q-mb-md" style="white-space: nowrap; width: 35%">
              <div class="q-mr-md">Name:</div>
              <div class="text-grey-7">
                {{ userData?.first_name }} {{ userData?.middle_name }} {{ userData?.last_name }}
                {{ userData?.suffix }}
              </div>
            </div>
            <div class="row no-wrap q-mr-md q-mb-md" style="white-space: nowrap; width: 35%">
              <div class="q-mr-md">Birthdate:</div>
              <div class="text-grey-7">
                {{ userData?.birth_date }}
              </div>
            </div>
            <div class="row no-wrap q-mr-md q-mb-md" style="white-space: nowrap; width: 35%">
              <div class="q-mr-md">Civil status:</div>
              <div class="text-grey-7">
                {{ userData?.civil_status }}
              </div>
            </div>
            <div class="row no-wrap q-mr-md q-mb-md" style="white-space: nowrap; width: 35%">
              <div class="q-mr-md">Occupation:</div>
              <div class="text-grey-7">
                {{ userData?.occupation }}
              </div>
            </div>
            <div class="row no-wrap q-mr-md q-mb-md" style="white-space: nowrap; width: 35%">
              <div class="q-mr-md">Gender:</div>
              <div class="text-grey-7">
                {{ userData?.sex == 1 ? 'Male' : 'Female' }}
              </div>
            </div>
            <div class="row no-wrap q-mr-md q-mb-md" style="white-space: nowrap; width: 35%">
              <div class="q-mr-md">Phone no.:</div>
              <div class="text-grey-7">
                {{ userData?.phone_number }}
              </div>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div>Bio</div>
          <div class="text-grey-7 q-mt-sm">{{ userData?.Bio }}</div>
        </q-card-section>
        <q-card-section>
          <div>Address:</div>
          <div class="text-grey-7 q-mt-sm">
            {{ userData?.street }} {{ userData?.brgy_name }} {{ userData?.city_municipality }}
            {{ userData?.province }}
          </div>
        </q-card-section>
        <q-card-section>
          <div>Position:</div>
          <div class="text-grey-7 q-mt-sm">
            {{ userData?.position_title }}
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script>
import ReusableTable from 'src/components/ReusableTable.vue'
import { getUserByType } from 'src/composable/latestComposable'
import { ref, watchEffect } from 'vue'
export default {
  components: {
    ReusableTable,
  },
  setup() {
    const tab = ref('3')
    const userRows = ref([])
    const showDialog = ref(false)
    const userData = ref()
    const tableAction = (data) => {
      showDialog.value = !showDialog.value
      userData.value = data
    }
    watchEffect(() => {
      getUserByType(tab.value).then((response) => {
        console.log(response)
        userRows.value = response
      })
    })
    return {
      userData,
      showDialog,
      tableAction,
      userRows,
      tab,
      defaultAvatar: 'https://cdn.quasar.dev/img/avatar4.jpg', // Quasar default avatar
      volunteerColumns: [
        { name: 'id', label: 'ID', field: 'user_id', align: 'center' },
        {
          name: 'fullName',
          label: 'Full Name',
          field: 'first_name',
          sortable: true,
          align: 'left',
        },
        { name: 'email', label: 'Email', field: 'email_address', sortable: true, align: 'center' },
        { name: 'roles', label: 'Role', field: 'position_title', sortable: true, align: 'center' },
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
