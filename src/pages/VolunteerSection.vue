<template>
  <q-page>
    <div class="row no-wrap justify-between items-center">
      <div class="text-h5 q-mb-lg">Volunteer</div>
      <div class="row no-wrap justify-between items-center">
        <q-btn icon="add" unelevated color="white" class="text-black" />
      </div>
    </div>
    <q-separator color="grey-3" class="q-mb-md" />
    <ReusableTable
      :rows="volunteers"
      :columns="volunteerColumns"
      separator="vertical"
      :rows-per-page-options="[10]"
      :visible-columns="[
        'id',
        'fullName',
        'email',
        'role',
        'age',
        'profession',
        'experience',
        'status',
      ]"
    >
      <template #cell-fullName="{ row }">
        <q-avatar size="40px" class="q-mr-md">
          <img :src="row.avatar || defaultAvatar" />
        </q-avatar>
        {{ row.fullName }}
      </template>
    </ReusableTable>

    <!-- <q-table
      flat
      bordered
      class="radius-10"
      :rows="rows"
      :columns="columns"
      row-key="id"
      separator="vertical"
      :rows-per-page-options="[11]"
    >
      <template v-slot:body-cell-fullName="props">
        <q-td :props="props">
          <q-avatar size="40px" class="q-mr-md">
            <img :src="`https://cdn.quasar.dev/img/avatar${(props.rowIndex % 6) + 1}.jpg`" />
          </q-avatar>

          {{ props.row.fullName }}
        </q-td>
      </template>
    </q-table> -->
  </q-page>
</template>
<script>
import ReusableTable from 'src/components/ReusableTable.vue'
export default {
  components: {
    ReusableTable,
  },
  setup() {
    return {
      defaultAvatar: 'https://cdn.quasar.dev/img/avatar4.jpg', // Quasar default avatar
      volunteerColumns: [
        { name: 'id', label: 'ID', field: 'id', align: 'center' },
        { name: 'fullName', label: 'Full Name', field: 'fullName', sortable: true, align: 'left' },
        { name: 'email', label: 'Email', field: 'email', sortable: true, align: 'center' },
        { name: 'role', label: 'Applied Role', field: 'role', sortable: true, align: 'center' },
        { name: 'age', label: 'Age', field: 'age', sortable: true, align: 'center' },
        {
          name: 'profession',
          label: 'Profession',
          field: 'profession',
          sortable: true,
          align: 'center',
        },
        {
          name: 'experience',
          label: 'Experience (Years)',
          field: 'experience',
          sortable: true,
          align: 'center',
        },
        {
          name: 'status',
          label: 'Application Status',
          field: 'status',
          sortable: true,
          align: 'center',
        },
      ],
      volunteers: [
        {
          id: 1,
          fullName: 'Alice Johnson',
          email: 'alice.johnson@email.com',
          role: 'Animal Caretaker',
          age: 28,
          profession: 'Veterinary Technician',
          experience: 3,
          status: 'Pending',
          avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
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
          avatar: '',
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
          avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
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
          avatar: '',
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
          avatar: 'https://cdn.quasar.dev/img/avatar3.jpg',
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
          avatar: '',
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
          avatar: 'https://cdn.quasar.dev/img/avatar5.jpg',
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
          avatar: '',
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
          avatar: 'https://cdn.quasar.dev/img/avatar6.jpg',
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
          avatar: 'https://cdn.quasar.dev/img/avatar2.jpg',
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
          avatar: 'https://cdn.quasar.dev/img/avatar1.jpg',
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
          avatar: '',
        },
      ],
    }
  },
}
</script>
