<template>
  <v-card class="pa-4 rounded-lg elevation-2">
    <v-card-title>
      <span class="text-h6 font-weight-bold">Tickets</span>
    </v-card-title>

    <v-data-table
      :headers="headers"
      :items="tickets"
      class="elevation-1"
      item-value="id"
    >
      <!-- Dynamic numbering -->
      <template v-slot:item.sn="{ index }">
        {{ index + 1 }}
      </template>

      <!-- Created By -->
      <template v-slot:item.user="{ item }">
        {{ item.creator?.name || 'N/A' }}
      </template>

      <!-- Actions -->
    <template v-slot:item.actions="{ item }">
        <!-- Edit -->
        <v-tooltip text="Edit">
            <template #activator="{ props }">
            <v-btn
                v-bind="props"
                icon
                variant="text"
                color="primary"
                size="small"
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
        <v-tooltip text="Transfer">
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
  <v-tooltip text="Accept">
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
  <v-tooltip text="Close">
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
  <v-tooltip text="Delete">
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

    <!-- Ticket Info Dialog -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card class="rounded-lg elevation-8">
        <v-card-title class="text-h6 font-weight-bold">
          Ticket Details
        </v-card-title>

        <v-divider></v-divider>

        <v-card-text v-if="selectedTicket" class="pt-4">
          <!-- Title -->
          <div class="mb-3">
            <span class="font-weight-bold">Title:</span>
            <span>{{ selectedTicket.title || 'N/A' }}</span>
          </div>

          <!-- Description -->
          <div class="mb-3">
            <span class="font-weight-bold">Description:</span>
            <span>{{ selectedTicket.description || 'N/A' }}</span>
          </div>

          <!-- Status -->
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

          <!-- Priority -->
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

          <!-- Created By -->
          <div class="mb-3">
            <span class="font-weight-bold">Created By:</span>
            <span>{{ selectedTicket.agent?.name || 'N/A' }}</span>
          </div>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text color="primary" @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Confirm Delete Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Confirm Delete
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete
          <strong>{{ ticketToDelete?.title }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="red" text @click="deleteTicket">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

     <!-- Accept Ticket Dialog -->
    <v-dialog v-model="acceptDialog" max-width="500">
      <v-card class="rounded-lg elevation-8">
        <v-card-title class="text-h6 font-weight-bold">
          Accept Ticket
        </v-card-title>
        <v-divider></v-divider>

        <v-card-text v-if="ticketToAccept" class="pt-4">
          <!-- Ticket Info -->
          <div class="mb-3">
            <span class="font-weight-bold">Title:</span>
            <span>{{ ticketToAccept.title }}</span>
          </div>
          <div class="mb-3">
            <span class="font-weight-bold">Description:</span>
            <span>{{ ticketToAccept.description }}</span>
          </div>

              <!-- Date Picker -->
          <!-- <v-date-picker
            v-model="closingDate"
            title="Select Closing Date"
            elevation="2"
            :min="today"
          /> -->

          <v-date-picker v-model="closingDate" :min="today" />
        <v-time-picker v-model="closingTime" format="24hr" />


        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="acceptDialog = false">Cancel</v-btn>
          <v-btn
            color="success"
            text
            :disabled="!closingDate"
            @click="submitAccept"
          >
            Accept
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/plugins/axios'

const headers = [
  { title: '#', key: 'sn', sortable: false },
  { title: 'Title', key: 'title' },
  { title: 'Description', key: 'description' },
  { title: 'Status', key: 'status' },
  { title: 'Priority', key: 'priority' },
  { title: 'Created By', key: 'user' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const tickets = ref([])
const dialog = ref(false)
const selectedTicket = ref(null)

const deleteDialog = ref(false)
const ticketToDelete = ref(null)

const acceptDialog = ref(false)
const ticketToAccept = ref(null)
const closingDate = ref(null)
const closingTime = ref(null)

const today = new Date().toISOString().split('T')[0]  // YYYY-MM-DD


const getTickets = async () => {
  try {
    const response = await api.get('/ticket')
    tickets.value = response.data
  } catch (error) {
    console.error(error)
  }
}

onMounted(getTickets)

function formatDateTime(dateInput, timeStr) {
  if (!dateInput || !timeStr) return null;

  // Convert Date object -> YYYY-MM-DD
  let dateStr;
  if (dateInput instanceof Date) {
    dateStr = dateInput.toISOString().split("T")[0];
  } else {
    dateStr = dateInput; // already YYYY-MM-DD
  }

  // Normalize time
  let timePart = timeStr;
  if (/^\d{2}:\d{2}$/.test(timeStr)) {
    timePart = `${timeStr}:00`; // add seconds if missing
  }

  // Build valid datetime string
  return `${dateStr} ${timePart}`; // "2025-10-04 11:14:00"
}




// Action handlers
const editTicket = (item) => console.log('Edit', item)

const viewTicket = (item) => {
  selectedTicket.value = item
  dialog.value = true
}

const transferTicket = (item) => console.log('Transfer', item)

const acceptTicket = (item) => {
  ticketToAccept.value = item
  closingDate.value = null
  acceptDialog.value = true
}

const submitAccept = async () => {
  try {
    const fullCloseDate = formatDateTime(closingDate.value, closingTime.value);

    if (!fullCloseDate) {
      console.error("Please select both valid date and time");
      return;
    }

    console.log("Submitting close_date:", fullCloseDate); 
    // Example: "2025-10-11 11:20:00"

    const response = await api.patch(`/ticket/${ticketToAccept.value.id}/accept`, {
      close_date: fullCloseDate,
    });

    console.log("Ticket accepted:", response.data);

    await getTickets();
    acceptDialog.value = false;
  } catch (error) {
    console.error(error.response?.data || error);
  }
};



const closeTicket = (item) => console.log('Close', item)

const confirmDelete = (item) => {
  ticketToDelete.value = item
  deleteDialog.value = true
}

const deleteTicket = async () => {
  try {
    await api.delete(`/ticket/${ticketToDelete.value.id}`)
    tickets.value = tickets.value.filter((t) => t.id !== ticketToDelete.value.id)
    deleteDialog.value = false
  } catch (error) {
    console.error(error)
  }
}

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'blue'
    case 'in progress':
      return 'orange'
    case 'closed':
      return 'green'
    case 'rejected':
      return 'red'
    default:
      return 'grey'
  }
}

const getPriorityColor = (priority) => {
  switch (priority?.toLowerCase()) {
    case 'low':
      return 'green'
    case 'medium':
      return 'orange'
    case 'high':
      return 'red'
    default:
      return 'grey'
  }
}
</script>