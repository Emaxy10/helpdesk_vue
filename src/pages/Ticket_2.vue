<template>
  <v-container class="py-8">
    <v-card class="pa-6 rounded-xl elevation-3">
      <!-- 🏷️ Header -->
      <v-card-title class="d-flex justify-space-between align-center">
        <div>
          <h2 class="text-h6 font-weight-bold mb-1">{{ ticket.title }}</h2>
          <div class="text-subtitle-2 text-grey-darken-1">
            <strong>Status:</strong>
            <v-chip
              :color="statusColor(ticket.status)"
              size="small"
              label
              class="mx-1 text-capitalize"
            >
              {{ ticket.status }}
            </v-chip>

            <strong>Priority:</strong>
            <v-chip
              :color="priorityColor(ticket.priority)"
              size="small"
              label
              class="mx-1 text-capitalize"
            >
              {{ ticket.priority }}
            </v-chip>
          </div>
        </div>
      </v-card-title>

      <v-divider class="my-3"></v-divider>

      <!-- 👥 Ticket Info -->
      <v-card-text>
        <v-row>
          <v-col cols="12" sm="6">
            <p><v-icon start color="primary">mdi-account</v-icon> <strong>Created by:</strong> {{ ticket.creator }}</p>
          </v-col>
          <v-col cols="12" sm="6">
            <p><v-icon start color="primary">mdi-account-tie</v-icon> <strong>Assigned to:</strong> {{ ticket.agent }}</p>
          </v-col>
        </v-row>

        <v-divider class="my-3"></v-divider>

        <!-- 📝 Description -->
        <div class="mt-2">
          <h3 class="text-subtitle-1 font-weight-bold mb-2">Description</h3>
          <p class="text-body-2">{{ ticket.description }}</p>
        </div>

        <!-- 📎 Attachments Section -->
        <div v-if="ticket.attachments.length" class="mt-6">
          <h3 class="text-subtitle-1 font-weight-bold mb-3">📎 Attachments</h3>

          <v-row dense>
            <v-col
              v-for="(file, index) in ticket.attachments"
              :key="index"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                class="pa-3 rounded-lg elevation-1 d-flex align-center justify-space-between hover:shadow-lg transition-all duration-300"
              >
                <div class="d-flex align-center">
                  <v-icon
                    :color="fileIconColor(file.name)"
                    size="28"
                    class="mr-2"
                  >
                    {{ fileIcon(file.name) }}
                  </v-icon>
                  <div>
                    <div class="font-weight-medium text-truncate" style="max-width: 160px">
                      Attachment {{ index + 1 }}
                    </div>
                    <small class="text-grey text-caption">Click to download</small>
                  </div>
                </div>

                <v-btn
                  icon
                  variant="text"
                  color="primary"
                  @click.stop="downloadFile(file.url, file.name)"
                >
                  <v-icon>mdi-download</v-icon>
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const ticket = ref({
  attachments: []
})

// 🎯 Fetch ticket
onMounted(async () => {
  try {
    const response = await axios.get(`/ticket/${route.params.id}`)
    ticket.value = response.data
  } catch (error) {
    console.error(error)
  }
})

// 📥 Download handler
const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Network error while downloading')
    const blob = await response.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  } catch (error) {
    console.error('Download failed:', error)
  }
}

// 🎨 Dynamic chip colors
const statusColor = status => {
  switch (status) {
    case 'open': return 'blue'
    case 'in-progress': return 'orange'
    case 'closed': return 'green'
    default: return 'grey'
  }
}

const priorityColor = priority => {
  switch (priority) {
    case 'high': return 'red'
    case 'medium': return 'amber'
    case 'low': return 'green'
    default: return 'grey'
  }
}

// 🧩 File type helpers
const fileIcon = name => {
  const ext = name.split('.').pop().toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'mdi-file-image'
  if (['pdf'].includes(ext)) return 'mdi-file-pdf'
  if (['doc', 'docx'].includes(ext)) return 'mdi-file-word'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'mdi-file-excel'
  if (['zip', 'rar', '7z'].includes(ext)) return 'mdi-folder-zip'
  return 'mdi-file'
}

const fileIconColor = name => {
  const ext = name.split('.').pop().toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'blue'
  if (['pdf'].includes(ext)) return 'red'
  if (['doc', 'docx'].includes(ext)) return 'indigo'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'green'
  if (['zip', 'rar', '7z'].includes(ext)) return 'amber'
  return 'grey'
}
</script>

<style scoped>
.hover\:shadow-lg:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}
.transition-all {
  transition: all 0.2s ease-in-out;
}
</style>









<template>
  <v-container>
    <v-card class="pa-6">
      <v-card-title class="text-h6 font-weight-bold">
        {{ ticket.title }}
      </v-card-title>

      <v-card-subtitle>
        <strong>Status:</strong> {{ ticket.status }} |
        <strong>Priority:</strong> {{ ticket.priority }}
      </v-card-subtitle>

      <v-card-text>
        <p><strong>Created by:</strong> {{ ticket.creator }}</p>
        <p><strong>Assigned to:</strong> {{ ticket.agent }}</p>
        <p class="mt-4">{{ ticket.description }}</p>

       <!-- 📎 Attachments Section -->
<div v-if="ticket.attachments.length" class="mt-6">
  <h3 class="text-h6 font-weight-bold mb-2">📎 Attachments</h3>

  <v-list dense>
    <v-list-item
      v-for="(file, index) in ticket.attachments"
      :key="index"
      @click="downloadFile(file.url, `Attachment_${index + 1}`)"
      class="cursor-pointer"
    >
      <v-list-item-title>
        📎 Download Attachment {{ index + 1 }}
      </v-list-item-title>

      <template #append>
        <v-btn
          icon
          variant="text"
          color="primary"
          @click.stop="downloadFile(file.url, `Attachment_${index + 1}`)"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </template>
    </v-list-item>
  </v-list>
</div>

      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from '@/plugins/axios'
import { useRoute } from 'vue-router'

const route = useRoute()
const ticket = ref({
  attachments: []
})

onMounted(async () => {
  try {
    const response = await axios.get(`/ticket/${route.params.id}`)
    ticket.value = response.data
  } catch (error) {
    console.error(error)
  }
})

const downloadFile = async (url, filename) => {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Network error while downloading')
    const blob = await response.blob()
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
  } catch (error) {
    console.error('Download failed:', error)
  }
}


</script>

