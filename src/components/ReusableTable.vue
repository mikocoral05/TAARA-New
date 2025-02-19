<template>
  <q-table
    flat
    bordered
    class="radius-10"
    :rows="rows"
    :columns="columns"
    row-key="id"
    :separator="separator"
    :rows-per-page-options="rowsPerPageOptions"
    :visible-columns="visibleColumns"
  >
    <!-- Slot for custom cell rendering -->
    <template v-for="col in columns" #[`body-cell-${col.name}`]="props" :key="col.name">
      <q-td :props="props">
        <slot :name="`cell-${col.name}`" v-bind="props">
          {{ props.row[col.field] }}
        </slot>
      </q-td>
    </template>
  </q-table>
</template>

<script>
export default {
  props: {
    rows: { type: Array, required: true },
    columns: { type: Array, required: true },
    separator: { type: String, default: 'horizontal' },
    rowsPerPageOptions: { type: Array, default: () => [5, 10, 15] },
    visibleColumns: { type: Array, default: () => [] },
  },
}
</script>
