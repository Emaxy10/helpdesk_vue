<template>
  <v-container>
    <v-card class="pa-4 rounded-lg">
      <v-card-title class="d-flex justify-space-between align-center">
        <span class="text-h6 font-weight-bold">👥 Agents</span>

        <!-- 🔍 Search Field -->
        <v-text-field
          v-model="search"
          label="Search Agents"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          hide-details
          dense
          style="max-width: 300px"
        />
      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="filteredAgents"
        class="elevation-2 mt-4"
      >
        <!-- 🔢 Dynamic numbering -->
        <template #item.index="{ index }">
          {{ index + 1 }}
        </template>

        <!-- 🧩 Actions Column -->
        <template #item.actions="{ item }">
          <!-- Info Button -->
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

          <!-- Remove Button -->
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
import { ref, onMounted, computed } from "vue"
import api from "@/plugins/axios"

const agents = ref([])
const search = ref("")

// ✅ Table headers
const headers = [
  { title: "#", key: "index", sortable: false },
  { title: "Name", key: "name" },
  { title: "Email", key: "email" },
  { title: "Actions", key: "actions", sortable: false },
]

// ✅ Computed: filters agents based on search
const filteredAgents = computed(() => {
  if (!search.value) return agents.value
  return agents.value.filter(agent =>
    [agent.name, agent.email]
      .some(field => field?.toLowerCase().includes(search.value.toLowerCase()))
  )
})

// ✅ Fetch agents
async function getAgent() {
  try {
    const response = await api.get("/agent")
    agents.value = response.data
  } catch (error) {
    console.error(error)
  }
}

// ✅ Remove agent
async function removeAgent(id) {
  if (!confirm("Are you sure you want to remove this agent?")) return

  try {
    await api.delete(`/agent/${id}`)
    agents.value = agents.value.filter(agent => agent.id !== id)
  } catch (error) {
    console.error(error)
  }
}

// ✅ View agent info
function viewInfo(agent) {
  alert(`Agent Info:\n\nName: ${agent.name}\nEmail: ${agent.email}`)
}

onMounted(getAgent)
</script>
