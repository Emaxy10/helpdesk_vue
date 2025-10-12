<template>
  <v-card class="pa-4 rounded-lg elevation-2">
    <v-card-title>
      <span class="text-h6 font-weight-bold">Tickets</span>
    </v-card-title>

    <!-- 🔎 Filters -->
    <div class="d-flex mb-4 gap-4">
      <v-select
        v-model="statusFilter"
        :items="statusOptions"
        label="Filter by Status"
        clearable
        multiple
        dense
        class="mr-4"
      />

      <v-select
        v-model="priorityFilter"
        :items="priorityOptions"
        label="Filter by Priority"
        clearable
        multiple
        dense
      />
    </div>

    <!-- 🧾 Tickets Table -->
    <v-data-table
      :headers="headers"
      :items="filteredTickets"
      class="elevation-1"
      item-value="id"
    >
      <!-- Row Number -->
      <template v-slot:item.sn="{ index }">
        {{ index + 1 }}
      </template>

      <!-- Created By -->
      <template v-slot:item.user="{ item }">
        {{ item?.creator?.name || 'N/A' }}
      </template>

      <!-- Agent -->
      <template v-slot:item.agent="{ item }">
        {{ item?.agent?.name || 'N/A' }}
      </template>

      <!-- Actions -->
      <template v-slot:item.actions="{ item }">
        <!-- Edit (disabled if closed) -->
        <v-tooltip text="Edit">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              color="primary"
              size="small"
              :disabled="item.status?.toLowerCase() === 'closed'"
              @click="editTicket(item)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <!-- Info -->
        <v-tooltip text="View Details">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              color="info"
              size="small"
              @click="viewTicket(item)"
            >
              <v-icon>mdi-information</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <!-- Transfer -->
        <v-tooltip v-if="showTransferAccept(item.status)" text="Transfer">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              color="warning"
              size="small"
              @click="transferTicket(item)"
            >
              <v-icon>mdi-share</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <!-- Accept -->
        <v-tooltip v-if="showTransferAccept(item.status)" text="Accept">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              color="success"
              size="small"
              @click="acceptTicket(item)"
            >
              <v-icon>mdi-check</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <!-- Close -->
        <v-tooltip v-if="showCloseDelete(item.status)" text="Close">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              color="grey-darken-1"
              size="small"
              @click="closeTicket(item)"
            >
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </template>
        </v-tooltip>

        <!-- Delete -->
        <v-tooltip v-if="showCloseDelete(item.status)" text="Delete">
          <template #activator="{ props }">
            <v-btn
              v-bind="props"
              icon
              variant="text"
              color="red-darken-2"
              size="small"
              @click="confirmDelete(item)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-tooltip>
      </template>
    </v-data-table>

    <!-- 📄 Ticket Info Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card class="rounded-lg elevation-8">
        <v-card-title class="text-h6 font-weight-bold">
          Ticket Details
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text v-if="selectedTicket" class="pt-4">
          <div class="mb-3">
            <span class="font-weight-bold">Title:</span>
            <span>{{ selectedTicket.title || 'N/A' }}</span>
          </div>

          <div class="mb-3">
            <span class="font-weight-bold">Description:</span>
            <span>{{ selectedTicket.description || 'N/A' }}</span>
          </div>

          <div class="mb-3">
            <span class="font-weight-bold">Status:</span>
            <v-chip
              :color="getStatusColor(selectedTicket.status)"
              dark
              small
              class="ml-2"
            >
              {{ selectedTicket.status || 'N/A' }}
            </v-chip>
          </div>

          <div class="mb-3">
            <span class="font-weight-bold">Priority:</span>
            <v-chip
              :color="getPriorityColor(selectedTicket.priority)"
              dark
              small
              class="ml-2"
            >
              {{ selectedTicket.priority || 'N/A' }}
            </v-chip>
          </div>

          <div class="mb-3">
            <span class="font-weight-bold">Created By:</span>
            <span>{{ selectedTicket.creator?.name || 'N/A' }}</span>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- ❗ Confirm Close Dialog -->
    <v-dialog v-model="closeDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Confirm Close
        </v-card-title>
        <v-card-text>
          Are you sure you want to close
          <strong>{{ ticketToClose?.title }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="closeDialog = false">Cancel</v-btn>
          <v-btn color="grey-darken-1" text @click="confirmCloseTicket">
            Close Ticket
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/plugins/axios'

const headers = [
  { title: '#', key: 'sn', sortable: false },
  { title: 'Title', key: 'title' },
  { title: 'Description', key: 'description' },
  { title: 'Status', key: 'status' },
  { title: 'Priority', key: 'priority' },
  { title: 'Created By', key: 'user' },
  { title: 'Agent', key: 'agent' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const tickets = ref([])
const dialog = ref(false)
const selectedTicket = ref(null)
const closeDialog = ref(false)
const ticketToClose = ref(null)
const deleteDialog = ref(false)
const ticketToDelete = ref(null)
const statusFilter = ref([])
const priorityFilter = ref([])

// ✅ Button visibility logic
const showTransferAccept = (status) => {
  if (!status) return false
  const s = status.toLowerCase()
  return !['in_progress', 'in progress', 'closed', 'rejected'].includes(s)
}

const showCloseDelete = (status) => {
  if (!status) return false
  return status.toLowerCase() !== 'closed'
}

const getTickets = async () => {
  try {
    const response = await api.get('/ticket')
    tickets.value = response.data
  } catch (error) {
    console.error('Error fetching tickets:', error)
  }
}
onMounted(getTickets)

const viewTicket = (item) => {
  selectedTicket.value = item
  dialog.value = true
}

const editTicket = (item) => console.log('Edit', item)
const transferTicket = (item) => console.log('Transfer', item)
const acceptTicket = (item) => console.log('Accept', item)

const closeTicket = (item) => {
  ticketToClose.value = item
  closeDialog.value = true
}

const confirmCloseTicket = async () => {
  try {
    await api.patch(`/ticket/${ticketToClose.value.id}/close`)
    await getTickets()
    closeDialog.value = false
  } catch (error) {
    console.error(error)
  }
}

const confirmDelete = (item) => {
  ticketToDelete.value = item
  deleteDialog.value = true
}

const deleteTicket = async () => {
  try {
    await api.delete(`/ticket/${ticketToDelete.value.id}`)
    tickets.value = tickets.value.filter(t => t.id !== ticketToDelete.value.id)
    deleteDialog.value = false
  } catch (error) {
    console.error(error)
  }
}

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'open': return 'blue'
    case 'in progress':
    case 'in_progress': return 'orange'
    case 'closed': return 'green'
    case 'rejected': return 'red'
    default: return 'grey'
  }
}

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'low': return 'green'
    case 'medium': return 'orange'
    case 'high': return 'red'
    default: return 'grey'
  }
}

const statusOptions = ['Open', 'In Progress', 'Closed', 'Rejected']
const priorityOptions = ['Low', 'Medium', 'High']

const filteredTickets = computed(() => {
  return tickets.value.filter(t => {
    const status = t.status?.toLowerCase()
    const priority = t.priority?.toLowerCase()

    const matchesStatus =
      !statusFilter.value.length ||
      statusFilter.value.map(s => s.toLowerCase()).includes(status)

    const matchesPriority =
      !priorityFilter.value.length ||
      priorityFilter.value.map(p => p.toLowerCase()).includes(priority)

    return matchesStatus && matchesPriority
  })
})
</script>

<style scoped>
.v-data-table {
  border-radius: 10px;
}
</style>
