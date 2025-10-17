<template>
  <v-container>
    <v-card class="pa-4 rounded-lg">
      <v-card-title class="text-h6 font-weight-bold">
        👥 Agents
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="agents"
        class="elevation-2 mt-4"
      >
        <!-- 🔢 Dynamic numbering column -->
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>

        <!-- 🧩 Custom Actions Column -->
        <template #item.actions="{ item }">
          <!-- Info Button with Tooltip -->
          <v-tooltip text="View Info" location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-information"
                variant="text"
                color="primary"
                @click="viewInfo(item)"
              />
            </template>
          </v-tooltip>

          <!-- Remove Button with Tooltip -->
          <v-tooltip text="Remove Agent" location="top">
            <template #activator="{ props }">
              <v-btn
                v-bind="props"
                icon="mdi-delete"
                variant="text"
                color="error"
                @click="removeAgent(item.id)"
              />
            </template>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "@/plugins/axios"

const agents = ref([])

// ✅ Add a header for dynamic numbering
const headers = [
  { title: "#", key: "index", sortable: false },
  { title: "Name", key: "name" },
  { title: "Email", key: "email" },
  { title: "Created At", key: "created_at" },
  { title: "Actions", key: "actions", sortable: false },
]

async function getAgent() {
  try {
    const response = await api.get("/agent")
    agents.value = response.data
  } catch (error) {
    console.error(error)
  }
}

async function removeAgent(id) {
  if (!confirm("Are you sure you want to remove this agent?")) return

  try {
    await api.delete(`/agent/${id}`)
    agents.value = agents.value.filter(agent => agent.id !== id)
  } catch (error) {
    console.error(error)
  }
}

function viewInfo(agent) {
  alert(`Agent Info:\n\nName: ${agent.name}\nEmail: ${agent.email}`)
}

onMounted(getAgent)
</script>
