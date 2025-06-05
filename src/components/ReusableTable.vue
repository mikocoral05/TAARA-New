<template>
  <q-table
    :rows="filteredRows"
    flat
    bordered
    class="radius-10"
    :columns="columns"
    :selection="showSelection ? selection : 'none'"
    :separator="separator"
    :rows-per-page-options="rowsPerPageOptions"
    :visible-columns="visibleColumns"
    v-model:selected="internalSelected"
  >
    <template v-for="col in columns" #[`body-cell-${col.name}`]="props" :key="col.name">
      <q-td :props="props">
        <slot :name="`cell-${col.name}`" v-bind="props">
          {{ props.row[col.field] }}
          <span class="text-grey-5" v-if="!props.row[col.field]"> N/a </span>
        </slot>
      </q-td>
    </template>
    <template v-slot:top>
      <slot name="top">
        <div class="row no-wrap full-width justify-between items-center">
          <div class="q-table__title q-ml-md" v-if="title">{{ title }}</div>
          <div class="row no-wrap justify-between" :class="{ 'w-100': title == null }">
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
            <q-select
              outlined
              dense
              v-if="showStatusFilter"
              :model-value="status"
              :options="statusOption"
              class="q-mr-md"
              emit-value
              map-options
              style="width: 150px"
              @update:model-value="(val) => emit('update:status', val)"
            />
            <div class="row no-wrap">
              <q-btn
                @click="tableActionFn(null, 'Download')"
                v-if="showDownload"
                icon="sym_r_download"
                dense
                flat
                class="q-mr-md"
              >
                <q-tooltip v-model="showingDownloadTooltip"
                  >Download example excel format</q-tooltip
                >
              </q-btn>
              <q-btn
                @click="tableActionFn(null, 'Upload')"
                v-if="showUpload"
                icon="sym_r_upload"
                dense
                flat
                class="q-mr-md"
              >
                <q-tooltip v-model="showingUploadTooltip">Upload a excel with pet info</q-tooltip>
              </q-btn>
              <q-btn
                icon="sym_r_add"
                dense
                flat
                class="q-mr-md"
                @click="tableActionFn(null, 'Add')"
              >
                <q-tooltip v-model="showingAddTooltip">Add {{ title }}</q-tooltip>
              </q-btn>
              <q-btn
                icon="sym_r_delete"
                dense
                flat
                color="negative"
                class="q-mr-md"
                @click="toggleSelection"
              >
                <q-tooltip v-model="showingDeleteTooltip">Delete {{ title }}</q-tooltip>
              </q-btn>
              <q-btn
                icon="sym_r_close"
                dense
                flat
                color="negative"
                v-if="showSelection"
                @click="closeSelection"
              >
                <q-tooltip v-model="showingCancelTooltip">Cancel</q-tooltip>
              </q-btn>
            </div>
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
    selection: { type: String, default: 'multiple' }, // "single" or "multiple"
    rows: { type: Array, required: true, default: () => [] },
    columns: { type: Array, required: true },
    title: { type: String, required: true },
    selected: { type: Array, default: () => [] },
    separator: { type: String, default: 'horizontal' },
    rowsPerPageOptions: { type: Array, default: () => [5, 10, 15] },
    visibleColumns: { type: Array, default: () => [] },
    confirm: { type: Boolean, default: false }, // Accept confirm as a prop
    tableAction: { type: Function, default: () => {} }, // Accept function as a prop
    status: { type: Number, default: 0 },
    showStatusFilter: { type: Boolean, default: false },
    statusOption: { type: Function, default: () => [] },
    showUpload: { type: Boolean, default: false },
    showDownload: { type: Boolean, default: false },
  },
  emits: ['update:modelValue', 'update:selected', 'update:status', 'update:confirm'],

  setup(props, { emit }) {
    const showingAddTooltip = ref(false)
    const showingUploadTooltip = ref(false)
    const showingDownloadTooltip = ref(false)
    const showingDeleteTooltip = ref(false)
    const internalSelected = ref(props.selected) // Mapping to only store IDs
    const showSelection = ref(false) // State to toggle selection visibility
    const filteredRows = computed(() => {
      if (!props.modelValue) return props.rows

      const keyword = props.modelValue.toLowerCase().trim()

      return props.rows.filter((row) =>
        Object.values(row).some((val) => String(val).toLowerCase().includes(keyword)),
      )
    })

    const toggleSelection = () => {
      if (showSelection.value) {
        if (internalSelected.value.length > 0) {
          emit('update:confirm', true)
        }
      } else {
        showSelection.value = !showSelection.value
      }
    }

    const closeSelection = () => {
      showSelection.value = !showSelection.value
      internalSelected.value = []
    }

    const tableActionFn = (row, mode) => {
      props.tableAction(row, mode)
    }

    watch(internalSelected, (val) => {
      emit(
        'update:selected',
        val.map((item) => item?.id || item?.user_id || item?.animal_id),
      )
    })

    return {
      showingDownloadTooltip,
      showingUploadTooltip,
      tableActionFn,
      closeSelection,
      showingCancelTooltip: ref(false),
      toggleSelection,
      showSelection,
      internalSelected,
      showingAddTooltip,
      showingDeleteTooltip,
      filteredRows,
      emit,
    }
  },
}
</script>
