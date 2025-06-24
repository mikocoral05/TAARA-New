<template>
  <q-page>
    <ReusableTable
      style="width: 100%"
      :rows="rows"
      :columns="columns"
      row-key="id"
      :rows-per-page-options="[20]"
      title="Logs"
      :visible-columns="['id', 'created_at', 'user_id', 'action', 'module']"
      v-model="search"
      :showBtns="false"
    >
      <template #cell-id="{ rowIndex }">
        <div>{{ rowIndex + 1 }}</div>
      </template>
      <template #cell-created_at="{ row }">
        <div>{{ formattedString(row.created_at) }}</div>
      </template>
      <template #cell-user_id="{ row }">
        <div class="column no-wrap items-start justify-start">
          <div class="text-bold">{{ row.first_name + ' ' + row.last_name }}</div>
          <div class="text-grey-7">{{ row.email_address }}</div>
          <div class="text-primary">{{ obj[row.user_type] }}</div>
        </div>
      </template>
    </ReusableTable>
  </q-page>
</template>
<script>
import ReusableTable from 'src/components/ReusableTable.vue'
import { onMounted, ref } from 'vue'
import { globalStore } from 'src/stores/global-store'
import { getLogs } from 'src/composable/latestComposable'
import { date } from 'quasar'
export default {
  components: {
    ReusableTable,
  },
  setup() {
    const rows = ref([])
    const store = globalStore()
    const search = ref('')
    const obj = { 1: 'Public', 2: 'Volunteer', 3: 'Official' }
    const formattedString = (dateP) => {
      const result = date.formatDate(dateP, 'YYYY-MM-DD, hh:mm A')
      return result
    }
    onMounted(async () => {
      const response = await getLogs()
      rows.value = response.data
    })

    return {
      search,
      obj,
      formattedString,
      store,
      rows,
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
        {
          name: 'created_at',
          label: 'Date and Time',
          field: 'created_at',
          sortable: true,
          align: 'left',
          style: 'width:250px',
        },

        {
          name: 'user_id',
          label: 'User',
          field: 'user_id',
          align: 'left',
          style: 'width:250px',
        },
        {
          name: 'action',
          label: 'Action',
          field: 'action',
          align: 'left',
        },
        {
          name: 'module',
          label: 'Module',
          field: 'module',
          align: 'left',
        },
      ],
    }
  },
}
</script>
