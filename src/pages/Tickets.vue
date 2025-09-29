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
      <template v-slot:item.actions="{ item }">
        <v-btn icon size="small" color="primary" @click="editTicket(item)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon size="small" color="info" @click="viewTicket(item)">
          <v-icon>mdi-information</v-icon>
        </v-btn>
        <v-btn icon size="small" color="warning" @click="transferTicket(item)">
          <v-icon>mdi-share</v-icon>
        </v-btn>
        <v-btn icon size="small" color="success" @click="acceptTicket(item)">
          <v-icon>mdi-check</v-icon>
        </v-btn>
        <v-btn icon size="small" color="error" @click="rejectTicket(item)">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-btn icon size="small" color="red-darken-2" @click="deleteTicket(item)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Title', key: 'title' },
  { title: 'Description', key: 'description' },
  { title: 'Status', key: 'status' },
  { title: 'Priority', key: 'priority' },
  { title: 'Created By', key: 'user' },
  { title: 'Actions', key: 'actions', sortable: false },
]

const tickets = ref([
  { id: 1, title: 'Login Issue', description: 'Unable to login', status: 'open', priority: 'high', user: 'John Doe' },
  { id: 2, title: 'Email not syncing', description: 'Outlook sync problem', status: 'in-progress', priority: 'medium', user: 'Jane Smith' },
  { id: 3, title: 'System crash', description: 'Blue screen error', status: 'resolved', priority: 'high', user: 'Michael Lee' },
  { id: 4, title: 'Printer issue', description: 'Not printing', status: 'open', priority: 'low', user: 'David Brown' },
])

// Action handlers (currently just log to console)
const editTicket = (item) => console.log('Edit', item)
const viewTicket = (item) => console.log('Info', item)
const transferTicket = (item) => console.log('Transfer', item)
const acceptTicket = (item) => console.log('Accept', item)
const rejectTicket = (item) => console.log('Reject', item)
const deleteTicket = (item) => console.log('Delete', item)
</script>
