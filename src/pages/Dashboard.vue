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

    <!-- Recent Tickets & Chart -->
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

      <!-- Priority Bar Chart -->
      <v-col cols="12" md="4">
        <v-card>
          <v-card-title class="font-weight-bold">Priority Distribution</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <canvas id="priorityChart" height="200"></canvas>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue"
import api from "@/plugins/axios"
import Chart from "chart.js/auto"

const stats = ref([
  { title: "Open Tickets", value: 0, color: "red", icon: "mdi-alert-circle" },
  { title: "In Progress", value: 0, color: "blue", icon: "mdi-progress-clock" },
  { title: "Resolved", value: 0, color: "green", icon: "mdi-check-circle" },
  { title: "Closed", value: 0, color: "grey", icon: "mdi-close-circle" },
])

const tickets = ref([])
const recentTickets = ref([])
let chartInstance = null
let refreshInterval = null

const ticketHeaders = [
  { title: "ID", key: "ticket_number" },
  { title: "Title", key: "title" },
  { title: "Status", key: "status" },
  { title: "Priority", key: "priority" },
]


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

// Fetch and update dashboard data
const ticketInfo = async () => {
  try {
    const response = await api.get("/ticket")
    tickets.value = response.data

    // Compute stats
    const open = tickets.value.filter(t => t.status === "open").length
    const inProgress = tickets.value.filter(t => t.status === "in-progress").length
    const resolved = tickets.value.filter(t => t.status === "closed").length
    const closed = tickets.value.filter(t => t.status === "closed").length

    stats.value = [
      { title: "Open Tickets", value: open, color: "red", icon: "mdi-alert-circle" },
      { title: "In Progress", value: inProgress, color: "blue", icon: "mdi-progress-clock" },
      { title: "Resolved", value: resolved, color: "green", icon: "mdi-check-circle" },
      { title: "Closed", value: closed, color: "grey", icon: "mdi-close-circle" },
    ]

    // Recent 5 tickets
    const recent = tickets.value.slice(-5).reverse()

    // Add a dynamic Ticket ID (TCK-001, TCK-002, etc.)
    recentTickets.value = recent.map((t, index) => ({
      ...t,
      ticket_number: `${String(index + 1)}`,
    }))


    // Redraw chart
    await nextTick()
    updatePriorityChart()
  } catch (error) {
    console.error("Error fetching tickets:", error)
  }
}

// Draw or update the chart dynamically
const updatePriorityChart = () => {
  const ctx = document.getElementById("priorityChart")
  if (!ctx) return

  const priorities = { high: 0, medium: 0, low: 0 }
  tickets.value.forEach(ticket => {
    const p = ticket.priority?.toLowerCase()
    if (priorities[p] !== undefined) priorities[p]++
  })

  const chartData = {
    labels: ["High", "Medium", "Low"],
    datasets: [
      {
        label: "Tickets",
        data: [priorities.high, priorities.medium, priorities.low],
        backgroundColor: ["#ef5350", "#ffa726", "#66bb6a"],
        borderRadius: 6,
      },
    ],
  }

  if (chartInstance) {
    // Update existing chart data instead of recreating it
    chartInstance.data = chartData
    chartInstance.update()
  } else {
    chartInstance = new Chart(ctx, {
      type: "bar",
      data: chartData,
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
      },
    })
  }
}

onMounted(() => {
  ticketInfo()

  // Refresh data every 30 seconds
  refreshInterval = setInterval(ticketInfo, 30000)
})

onUnmounted(() => {
  // Clean up interval when component is destroyed
  if (refreshInterval) clearInterval(refreshInterval)
  if (chartInstance) chartInstance.destroy()
})
</script>
