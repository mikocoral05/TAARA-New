<template>
  <q-page>
    <ReusableTable
      :rows="rows"
      :columns="columns"
      separator="vertical"
      title="Veterinary Schedule"
      v-model="search"
      :rows-per-page-options="[10]"
      :visible-columns="[
        'id',
        'schedule_name',
        'dose_number',
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
    </ReusableTable>
  </q-page>
</template>

<script>
import ReusableTable from 'src/components/ReusableTable.vue'
import { getSchedule } from 'src/composable/latestComposable'
import { onMounted } from 'vue'
import { ref } from 'vue'
export default {
  components: { ReusableTable },
  setup() {
    const rows = ref([])
    const search = ref(null)
    onMounted(() => {
      getSchedule().then((response) => {
        rows.value = response
        console.log(rows.value)
      })
    })
    return {
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
