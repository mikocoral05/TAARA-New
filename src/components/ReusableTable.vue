<template>
  <!-- :rows="rows" -->
  <q-table
    :rows="filteredRows"
    flat
    bordered
    class="radius-10"
    :columns="columns"
    row-key="id"
    :separator="separator"
    :rows-per-page-options="rowsPerPageOptions"
    :visible-columns="visibleColumns"
  >
    <template v-for="col in columns" #[`body-cell-${col.name}`]="props" :key="col.name">
      <q-td :props="props">
        <slot :name="`cell-${col.name}`" v-bind="props">
          {{ props.row[col.field] }}
        </slot>
      </q-td>
    </template>
    <template #top>
      <slot name="top">
        <div class="row no-wrap full-width justify-between items-center">
          <div class="q-table__title">{{ title }}</div>
          <div class="row no-wrap">
            <q-input
              borderless
              style="width: 300px"
              class="bg-default radius-10 q-px-md q-mr-xl"
              placeholder="Search"
              dense
              :model-value="modelValue"
              @update:model-value="(val) => emit('update:modelValue', val)"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-btn icon="sym_r_add" dense flat class="q-mr-md">
              <q-tooltip v-model="showingAddTooltip">Add {{ title }}</q-tooltip>
            </q-btn>
            <q-btn icon="sym_r_delete" dense flat color="negative">
              <q-tooltip v-model="showingDeleteTooltip">Delete {{ title }}</q-tooltip>
            </q-btn>
          </div>
        </div>
      </slot>
    </template>
  </q-table>
</template>

<script>
import { watch } from 'vue'
import { computed, ref } from 'vue'

export default {
  name: 'ReusableTable',
  props: {
    modelValue: {
      type: String,
      default: '',
    },
    rows: { type: Array, required: true, default: () => [] },
    columns: { type: Array, required: true },
    title: { type: String, required: true },
    separator: { type: String, default: 'horizontal' },
    rowsPerPageOptions: { type: Array, default: () => [5, 10, 15] },
    visibleColumns: { type: Array, default: () => [] },
  },
  emits: ['update:modelValue'],

  setup(props, { emit }) {
    const showingAddTooltip = ref(false)
    const showingDeleteTooltip = ref(false)

    const filteredRows = computed(() => {
      if (!props.modelValue) return props.rows

      const keyword = props.modelValue.toLowerCase().trim()

      return props.rows.filter((row) =>
        Object.values(row).some((val) => String(val).toLowerCase().includes(keyword)),
      )
    })
    watch(
      () => props.rows,
      (val) => {
        console.log('Rows updated:', val)
      },
    )

    return {
      showingAddTooltip,
      showingDeleteTooltip,
      filteredRows,
      emit,
    }
  },
}
</script>
