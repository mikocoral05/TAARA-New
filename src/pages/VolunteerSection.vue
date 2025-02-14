<template>
  <q-page>
    <div class="text-h5 q-mb-lg">Volunteer</div>
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
      { name: 'fullName', label: 'Full Name', field: 'fullName', sortable: true },
      { name: 'email', label: 'Email', field: 'email', sortable: true },
      { name: 'role', label: 'Applied Role', field: 'role', sortable: true },
      { name: 'age', label: 'Age', field: 'age', sortable: true },
      { name: 'profession', label: 'Profession', field: 'profession', sortable: true },
      { name: 'experience', label: 'Experience (Years)', field: 'experience', sortable: true },
      { name: 'status', label: 'Application Status', field: 'status', sortable: true },
    ]

    const rows = [
      {
        id: 1,
        fullName: 'Alice Johnson',
        email: 'alice.johnson@email.com',
        role: 'Animal Caretaker',
        age: 28,
        profession: 'Veterinary Technician',
        experience: 3,
        status: 'Pending',
      },
      {
        id: 2,
        fullName: 'Brian Smith',
        email: 'brian.smith@email.com',
        role: 'Veterinary Assistant',
        age: 32,
        profession: 'Vet Nurse',
        experience: 5,
        status: 'Approved',
      },
      {
        id: 3,
        fullName: 'Catherine Lee',
        email: 'catherine.lee@email.com',
        role: 'Adoption Coordinator',
        age: 26,
        profession: 'Social Worker',
        experience: 2,
        status: 'Rejected',
      },
      {
        id: 4,
        fullName: 'David Kim',
        email: 'david.kim@email.com',
        role: 'Fundraising Coordinator',
        age: 30,
        profession: 'Marketing Specialist',
        experience: 4,
        status: 'Pending',
      },
      {
        id: 5,
        fullName: 'Emma Garcia',
        email: 'emma.garcia@email.com',
        role: 'Animal Transport Volunteer',
        age: 35,
        profession: 'Delivery Driver',
        experience: 6,
        status: 'Approved',
      },
      {
        id: 6,
        fullName: 'Felix Martinez',
        email: 'felix.martinez@email.com',
        role: 'Dog Walker & Trainer',
        age: 29,
        profession: 'Dog Trainer',
        experience: 4,
        status: 'Pending',
      },
      {
        id: 7,
        fullName: 'Grace Williams',
        email: 'grace.williams@email.com',
        role: 'Shelter Maintenance',
        age: 40,
        profession: 'Maintenance Worker',
        experience: 7,
        status: 'Approved',
      },
      {
        id: 8,
        fullName: 'Henry Adams',
        email: 'henry.adams@email.com',
        role: 'Social Media Manager',
        age: 27,
        profession: 'Content Creator',
        experience: 3,
        status: 'Pending',
      },
      {
        id: 9,
        fullName: 'Isabella Lopez',
        email: 'isabella.lopez@email.com',
        role: 'Emergency Rescue Volunteer',
        age: 33,
        profession: 'Firefighter',
        experience: 5,
        status: 'Rejected',
      },
      {
        id: 10,
        fullName: 'Jack Thompson',
        email: 'jack.thompson@email.com',
        role: 'Foster Care Provider',
        age: 45,
        profession: 'Retired Teacher',
        experience: 8,
        status: 'Approved',
      },
      {
        id: 11,
        fullName: 'Kimberly Evans',
        email: 'kimberly.evans@email.com',
        role: 'Medical Supplies Coordinator',
        age: 38,
        profession: 'Pharmacist',
        experience: 6,
        status: 'Pending',
      },
      {
        id: 12,
        fullName: 'Lucas Brown',
        email: 'lucas.brown@email.com',
        role: 'Community Outreach Volunteer',
        age: 31,
        profession: 'Public Speaker',
        experience: 4,
        status: 'Approved',
      },
      {
        id: 13,
        fullName: 'Mia Scott',
        email: 'mia.scott@email.com',
        role: 'Photography & Marketing',
        age: 29,
        profession: 'Photographer',
        experience: 3,
        status: 'Pending',
      },
      {
        id: 14,
        fullName: 'Nathan White',
        email: 'nathan.white@email.com',
        role: 'Wildlife Rehabilitation Assistant',
        age: 36,
        profession: 'Zoologist',
        experience: 5,
        status: 'Rejected',
      },
      {
        id: 15,
        fullName: 'Olivia Carter',
        email: 'olivia.carter@email.com',
        role: 'Volunteer Coordinator',
        age: 41,
        profession: 'HR Manager',
        experience: 7,
        status: 'Approved',
      },
    ]

    return { separator: ref('vertical'), columns, rows }
  },
}
</script>
