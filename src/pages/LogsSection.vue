<template>
  <q-page>
    <ReusableTable
      style="width: 100%"
      :rows="rows"
      :columns="columns"
      row-key="id"
      separator="vertical"
      :rows-per-page-options="[10]"
      :title="Logs"
      v-model="search"
    >
      <template #cell-id="{ rowIndex }">
        <div>{{ rowIndex + 1 }}</div>
      </template>
    </ReusableTable>
  </q-page>
</template>
<script>
import ReusableTable from 'src/components/ReusableTable.vue'
import { onMounted, ref } from 'vue'
import { globalStore } from 'src/stores/global-store'
import { getLogs } from 'src/composable/latestComposable'
export default {
  components: {
    ReusableTable,
  },
  setup() {
    const rows = ref([])
    const store = globalStore()

    onMounted(async () => {
      const response = await getLogs()
      rows.value = response.data
    })

    return {
      store,
      rows,
      columns: [
        { name: 'id', label: 'ID', field: 'id', align: 'center' },
        {
          name: 'created_at',
          label: 'Date and Time',
          field: 'created_at',
          sortable: true,
          align: 'center',
        },
        {
          name: 'user_type',
          label: 'User Type',
          field: 'user_type',
          align: 'center',
        },

        {
          name: 'user_id',
          label: 'User',
          field: 'user_id',
          align: 'center',
        },
        {
          name: 'action',
          label: 'Action',
          field: 'action',
          align: 'center',
        },
        {
          name: 'module',
          label: 'Module',
          field: 'module',
          align: 'center',
        },
      ],
    }
  },
}
</script>
