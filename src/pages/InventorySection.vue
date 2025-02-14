<template>
  <q-page>
    <div class="text-h5 q-mb-lg">Invetory</div>
    <q-separator color="grey-3" class="q-mb-md" />
    <q-table
      flat
      bordered
      class="radius-10"
      :rows="rows"
      :columns="columns"
      row-key="name"
      separator="vertical"
      :rows-per-page-options="[11]"
    />
  </q-page>
</template>
<script>
import { ref } from 'vue'

export default {
  setup() {
    const columns = [
      { name: 'id', label: 'ID', field: 'id', sortable: true },
      { name: 'name', label: 'Item Name', field: 'name', sortable: true },
      { name: 'type', label: 'Category', field: 'type', sortable: true },
      { name: 'quantity', label: 'Stock Quantity', field: 'quantity', sortable: true },
      { name: 'unit', label: 'Unit', field: 'unit', sortable: true },
      { name: 'expiryDate', label: 'Expiration Date', field: 'expiryDate', sortable: true },
      { name: 'status', label: 'Status', field: 'status', sortable: true },
    ]

    const rows = [
      {
        id: 1,
        name: 'Pedigree Dry Dog Food',
        type: 'Pet Food',
        quantity: 20,
        unit: 'kg',
        expiryDate: '2025-06-15',
        status: 'Available',
      },
      {
        id: 2,
        name: 'Whiskas Wet Cat Food',
        type: 'Pet Food',
        quantity: 15,
        unit: 'cans',
        expiryDate: '2024-12-10',
        status: 'Low Stock',
      },
      {
        id: 3,
        name: 'Royal Canin Puppy Food',
        type: 'Pet Food',
        quantity: 10,
        unit: 'bags',
        expiryDate: '2025-09-01',
        status: 'Available',
      },
      {
        id: 4,
        name: 'Doxycycline',
        type: 'Medicine (Antibiotic)',
        quantity: 50,
        unit: 'tablets',
        expiryDate: '2024-08-30',
        status: 'Expiring Soon',
      },
      {
        id: 5,
        name: 'Amoxicillin',
        type: 'Medicine (General)',
        quantity: 30,
        unit: 'capsules',
        expiryDate: '2025-02-20',
        status: 'Available',
      },
      {
        id: 6,
        name: 'Rabies Vaccine',
        type: 'Vaccine (Core)',
        quantity: 25,
        unit: 'doses',
        expiryDate: '2024-11-15',
        status: 'Low Stock',
      },
      {
        id: 7,
        name: 'Canine Distemper Vaccine',
        type: 'Vaccine (Core)',
        quantity: 20,
        unit: 'doses',
        expiryDate: '2025-04-10',
        status: 'Available',
      },
      {
        id: 8,
        name: 'Parvovirus Vaccine',
        type: 'Vaccine (Core)',
        quantity: 18,
        unit: 'doses',
        expiryDate: '2025-07-30',
        status: 'Available',
      },
      {
        id: 9,
        name: 'Bordetella Vaccine',
        type: 'Vaccine (Non-Core)',
        quantity: 12,
        unit: 'doses',
        expiryDate: '2024-09-25',
        status: 'Expiring Soon',
      },
      {
        id: 10,
        name: 'Vitamin B Complex',
        type: 'Vitamins (Supplement)',
        quantity: 40,
        unit: 'bottles',
        expiryDate: '2025-05-20',
        status: 'Available',
      },
      {
        id: 11,
        name: 'Omega-3 Fish Oil',
        type: 'Vitamins (Supplement)',
        quantity: 35,
        unit: 'bottles',
        expiryDate: '2025-03-10',
        status: 'Available',
      },
      {
        id: 12,
        name: 'Calcium Syrup',
        type: 'Vitamins (Syrup)',
        quantity: 20,
        unit: 'bottles',
        expiryDate: '2024-12-05',
        status: 'Low Stock',
      },
      {
        id: 13,
        name: 'Metronidazole',
        type: 'Medicine (General)',
        quantity: 45,
        unit: 'tablets',
        expiryDate: '2025-06-25',
        status: 'Available',
      },
      {
        id: 14,
        name: 'Ivermectin',
        type: 'Medicine (General)',
        quantity: 25,
        unit: 'bottles',
        expiryDate: '2024-10-01',
        status: 'Expiring Soon',
      },
      {
        id: 15,
        name: 'Probiotics for Pets',
        type: 'Vitamins (Supplement)',
        quantity: 30,
        unit: 'packs',
        expiryDate: '2025-08-18',
        status: 'Available',
      },
    ]

    return { separator: ref('vertical'), columns, rows }
  },
}
</script>
