<template>
  <q-page>
    <ReusableTable
      :rows="rows"
      :columns="columns"
      separator="vertical"
      title="Veterinary Schedule"
      v-model="search"
      :rows-per-page-options="[10]"
      selection="multiple"
      v-model:selected="arrayOfId"
      v-model:confirm="confirm"
      v-model:dialog="showDialog"
      :tableAction="tableAction"
      :visible-columns="[
        'id',
        'schedule_name',
        'dose_number',
        'dose_taken',
        'name',
        'scheduled_date',
        'next_due_interval',
        'next_due_date',
        'amount',
        'color',
        'behavior',
        'adoptedStatus',
        'btn',
      ]"
    >
      <template #cell-name="{ row }">
        <q-avatar size="30px" class="q-mr-md">
          <img :src="row.image || defaultImage" />
        </q-avatar>
        {{ row.name }}
      </template>
      <template #cell-next_due_interval="{ row }">
        {{ row.dose_taken == 1 ? 'Last Dose' : convertDaysToInterval(row.next_due_interval) }}
      </template>
      <template #cell-next_due_date="{ row }">
        {{ doseChecker(row.dose_number, row.dose_taken, row.next_due_date) }}
      </template>
      <template #cell-btn="{ row }">
        <q-btn icon="sym_r_more_vert" dense flat size=".7rem" :ripple="false">
          <q-menu anchor="bottom left" self="top right">
            <q-list dense style="min-width: 100px">
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
              <q-item clickable @click="tableAction(row, 'Archieve')">
                <q-item-section>Delete</q-item-section>
                <q-item-section side>
                  <q-icon name="sym_r_keyboard_arrow_right" size="1.2rem" />
                </q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </template>
    </ReusableTable>
    <q-dialog position="right" full-height v-model="showDialog">
      <q-card style="min-width: 750px; height: 500px" class="text-black column justify-between">
        <div class="column no-wrap">
          <q-card-section class="q-py-md row no-wrap justify-between items-center">
            <div class="text-body1">{{ mode }} {{ tableConfig.title }}</div>
            <q-icon name="close" size="1.2rem" @click="showDialog = !showDialog" />
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="text-grey-7" style="font-size: 12px">
              <span class="text-negative">*</span>All fields are mandatory, except mentioned as
              (optional).
            </div>
          </q-card-section>
          <q-card-section>
            <div class="row no-wrap q-mt-md">
              <div class="column no-wrap q-mr-md">
                <div class="text-capitalize">
                  {{ obj[tab] }} Name <span class="text-negative">*</span>
                </div>
                <q-input
                  outlined
                  v-model="dataStorage.item_name"
                  dense
                  class="q-mt-sm"
                  style="width: 300px"
                />
              </div>
              <div class="column no-wrap">
                <div class="text-capitalize">
                  {{ obj[tab] }} Group <span class="text-negative">*</span>
                </div>
                <q-select
                  outlined
                  v-model="dataStorage.group_name"
                  class="q-mt-sm"
                  :options="groupNameOptions"
                  emit-value
                  map-options
                  option-label="group_name"
                  option-value="id"
                  dense
                  style="width: 250px"
                  behavior="menu"
                />
              </div>
            </div>
            <div class="row no-wrap q-mt-md">
              <div class="column no-wrap q-mr-md">
                <div class="text-capitalize">Expiry Date<span class="text-negative">*</span></div>
                <q-input
                  dense
                  outlined
                  class="q-mt-sm"
                  v-model="dataStorage.expiration_date"
                  mask="####-##-##"
                  :rules="[(val) => !!val || '']"
                  hide-bottom-space
                >
                  <template v-slot:append>
                    <q-icon name="event" class="cursor-pointer">
                      <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                        <q-date v-model="dataStorage.expiration_date">
                          <div class="row items-center justify-end">
                            <q-btn v-close-popup label="Close" color="primary" flat />
                          </div>
                        </q-date>
                      </q-popup-proxy>
                    </q-icon>
                  </template>
                </q-input>
              </div>
              <div class="column no-wrap q-mr-md">
                <div class="text-capitalize">Quantity<span class="text-negative">*</span></div>
                <q-input
                  outlined
                  type="number"
                  v-model="dataStorage.quantity"
                  dense
                  class="q-mt-sm"
                />
              </div>
              <div class="column no-wrap">
                <div class="text-capitalize">Unit<span class="text-negative">*</span></div>
                <q-input outlined v-model="dataStorage.unit" dense class="q-mt-sm" />
              </div>
            </div>
            <div class="column no-wrap q-mt-md">
              <div class="text-capitalize">
                Description <span class="text-grey-7 text-caption"> (optional)</span>
              </div>
              <q-input
                outlined
                type="textarea"
                v-model="dataStorage.description"
                dense
                class="q-mt-sm"
              />
            </div>
            <div class="column no-wrap q-mt-md">
              <div class="text-capitalize">
                Notes <span class="text-grey-7 text-caption"> (optional)</span>
              </div>
              <q-input outlined autogrow v-model="dataStorage.notes" dense class="q-mt-sm" />
            </div>
          </q-card-section>
        </div>
        <q-card-section>
          <q-btn
            outline
            label="Cancel"
            v-close-popup
            color="primary"
            no-caps
            class="q-mr-md"
            style="width: 180px"
          />
          <q-btn
            label="Confirm"
            unelevated
            color="primary"
            no-caps
            v-close-popup
            style="width: 180px"
            @click="saveFn()"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="confirm" persistent>
      <q-card class="q-pa-md" style="width: 450px; min-height: 230px">
        <q-card-section class="column items-center">
          <q-icon name="sym_r_inventory_2" color="primary" size="2.5rem" />
          <span class="q-ml-sm text-black text-body1 q-mt-md text-center">
            Are you sure you want to Delete this Pet Record List?
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
  </q-page>
</template>

<script>
import ReusableTable from 'src/components/ReusableTable.vue'
import { getSchedule } from 'src/composable/latestComposable'
import { convertDaysToInterval } from 'src/composable/simpleComposable'
import { onMounted } from 'vue'
import { ref } from 'vue'
export default {
  components: { ReusableTable },
  setup() {
    const rows = ref([])
    // const $q = useQuasar()
    const confirm = ref(false)
    const showDialog = ref(false)
    const dataStorage = ref({ file: [] })
    const mode = ref('')
    const itemsCount = ref([])
    const arrayOfId = ref([])
    const search = ref(null)

    const tableAction = (data, modeParam) => {
      mode.value = modeParam
      showDialog.value = !showDialog.value
      if (['Add', 'Edit', 'View'].includes(modeParam)) {
        if (modeParam == 'Add') {
          dataStorage.value = {}
        } else {
          dataStorage.value = data
          console.log(dataStorage.value)
        }
      } else {
        arrayOfId.value.push(data.animal_id)
        confirm.value = !confirm.value
      }
    }

    const doseChecker = (x, y, z) => {
      if (x == y) {
        return 'Finish'
      } else if (x - y == 1) {
        return 'Last Dose'
      }
      return z
    }
    onMounted(() => {
      getSchedule().then((response) => {
        rows.value = response
      })
    })
    return {
      tableAction,
      showDialog,
      mode,
      itemsCount,
      arrayOfId,
      confirm,
      dataStorage,
      doseChecker,
      convertDaysToInterval,
      rows,
      search,
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'center' },
        {
          name: 'name',
          label: 'Schedule For',
          field: 'name',
          sortable: true,
          align: 'left',
        },
        {
          name: 'schedule_name',
          label: 'Schedule Name',
          field: 'schedule_name',
          sortable: true,
          align: 'center',
        },
        {
          name: 'dose_number',
          label: 'Dose No.',
          field: 'dose_number',
          sortable: true,
          align: 'center',
        },
        {
          name: 'dose_taken',
          label: 'Dose Taken.',
          field: 'dose_taken',
          sortable: true,
          align: 'center',
        },
        {
          name: 'scheduled_date',
          label: 'Schedule Date',
          field: 'scheduled_date',
          sortable: true,
          align: 'center',
        },
        {
          name: 'next_due_interval',
          label: 'Next Due Interval',
          field: 'next_due_interval',
          sortable: true,
          align: 'center',
        },
        {
          name: 'next_due_date',
          label: 'Next Dose',
          field: 'next_due_date',
          sortable: true,
          align: 'center',
        },
        { name: 'amount', label: 'Amount', field: 'amount', align: 'center' },
        { name: 'btn', label: 'Action', field: 'btn', align: 'center' },
      ],
    }
  },
}
</script>
