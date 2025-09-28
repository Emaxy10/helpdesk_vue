<template>
  <v-container fluid>
    <!-- Ticket Stats -->
    <v-row>
      <v-col cols="12" md="3" v-for="card in stats" :key="card.title">
        <v-card class="pa-4" elevation="2">
          <v-card-title class="d-flex align-center justify-space-between">
            <span class="font-weight-bold">{{ card.title }}</span>
            <v-icon :color="card.color" size="28">{{ card.icon }}</v-icon>
          </v-card-title>
          <v-card-text>
            <span class="text-h5 font-weight-bold">{{ card.value }}</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Tickets -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="font-weight-bold">
            Recent Tickets
          </v-card-title>
          <v-divider></v-divider>
          <v-data-table
            :headers="ticketHeaders"
            :items="recentTickets"
            class="elevation-1"
          >
            <template v-slot:item.status="{ item }">
              <v-chip
                :color="statusColor(item.status)"
                variant="flat"
                size="small"
              >
                {{ item.status }}
              </v-chip>
            </template>
            <template v-slot:item.priority="{ item }">
              <v-chip
                :color="priorityColor(item.priority)"
                variant="flat"
                size="small"
              >
                {{ item.priority }}
              </v-chip>
            </template>
          </v-data-table>
        </v-card>
      </v-col>

      <!-- Activity Feed -->
      <v-col cols="12" md="4">
   
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref } from "vue"

const stats = ref([
  { title: "Open Tickets", value: 124, color: "red", icon: "mdi-alert-circle" },
  { title: "In Progress", value: 32, color: "blue", icon: "mdi-progress-clock" },
  { title: "Resolved", value: 210, color: "green", icon: "mdi-check-circle" },
  { title: "Closed", value: 89, color: "grey", icon: "mdi-close-circle" },
])

const ticketHeaders = [
  { title: "Ticket ID", key: "id" },
  { title: "Title", key: "title" },
  { title: "Status", key: "status" },
  { title: "Priority", key: "priority" },
]

const recentTickets = ref([
  { id: "TCK-001", title: "Email not working", status: "open", priority: "high" },
  { id: "TCK-002", title: "Laptop slow", status: "in-progress", priority: "medium" },
  { id: "TCK-003", title: "VPN issue", status: "resolved", priority: "low" },
  { id: "TCK-004", title: "Software installation", status: "closed", priority: "medium" },
])

const activities = ref([
  { text: "Emmanuel resolved ticket #003", time: "2 hours ago" },
  { text: "Grace created new ticket #005", time: "4 hours ago" },
  { text: "John updated ticket #002", time: "6 hours ago" },
])

const statusColor = (status) => {
  switch (status) {
    case "open": return "red"
    case "in-progress": return "blue"
    case "resolved": return "green"
    case "closed": return "grey"
    default: return "primary"
  }
}

const priorityColor = (priority) => {
  switch (priority) {
    case "high": return "red"
    case "medium": return "orange"
    case "low": return "green"
    default: return "grey"
  }
}
</script>
