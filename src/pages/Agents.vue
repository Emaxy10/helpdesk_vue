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
        <!-- Custom Actions Column -->
        <template #item.actions="{ item }">
          <v-btn
            icon="mdi-information"
            variant="text"
            color="primary"
            @click="viewInfo(item)"
          />

          <v-btn
            icon="mdi-delete"
            variant="text"
            color="error"
            @click="removeAgent(item.id)"
          />
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "@/plugins/axios"

const agents = ref([])

const headers = [
  { title: "ID", key: "id" },
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
