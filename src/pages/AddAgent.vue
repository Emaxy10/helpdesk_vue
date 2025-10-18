<template>
  <v-container>
    <v-card class="pa-6 rounded-lg">
      <v-card-title class="text-h6 font-weight-bold">
        ➕ Add Agent
      </v-card-title>

      <!-- 🔍 Search Section -->
      <v-card-text>
        <v-text-field
          v-model="query"
          label="Search User (name or email)"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          clearable
          hide-details
        />

        <v-btn
          color="primary"
          class="mt-3"
          :loading="loadingSearch"
          @click="searchUser"
        >
          Search
        </v-btn>
      </v-card-text>

      <!-- 🧍‍♂️ User Found Section -->
      <v-expand-transition>
        <div v-if="user" class="mt-6">
          <v-divider class="mb-4"></v-divider>

          <v-card-subtitle>User Found:</v-card-subtitle>
          <v-card class="pa-4 mt-2" variant="tonal">
            <div class="d-flex align-center justify-space-between">
              <div>
                <p class="mb-1"><strong>Name:</strong> {{ user.name }}</p>
                <p class="mb-1"><strong>Email:</strong> {{ user.email }}</p>
                <p class="mb-0">
                  <strong>Created At:</strong>
                  {{ new Date(user.created_at).toLocaleDateString() }}
                </p>
              </div>

              <v-btn
                color="success"
                prepend-icon="mdi-account-plus"
                :loading="loadingAdd"
                @click="addAsAgent(user.id)"
              >
                Add as Agent
              </v-btn>
            </div>
          </v-card>
        </div>
      </v-expand-transition>

      <!-- ❌ No user found -->
      <v-alert
        v-if="notFound"
        type="error"
        class="mt-6"
        border="start"
        prominent
      >
        No user found with that name or email.
      </v-alert>

      <!-- ✅ Success message -->
      <v-snackbar
        v-model="success"
        color="green"
        timeout="3000"
        location="bottom right"
      >
        ✅ User added as agent successfully!
        <template #actions>
          <v-btn variant="text" @click="success = false">Close</v-btn>
        </template>
      </v-snackbar>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue"
import api from "@/plugins/axios"
import router from "@/router"

const query = ref("")
const user = ref(null)
const notFound = ref(false)
const success = ref(false)
const loadingSearch = ref(false)
const loadingAdd = ref(false)

// 🔍 Search user by email or name
async function searchUser() {
  if (!query.value.trim()) return

  loadingSearch.value = true
  notFound.value = false
  user.value = null

  try {
    const response = await api.get(`/user/search/${query.value }`)
    if (response.data) {
      user.value = response.data
    } else {
      notFound.value = true
    }
  } catch (error) {
    console.error(error)
    notFound.value = true
  } finally {
    loadingSearch.value = false
  }
}

// ➕ Add the found user as agent
async function addAsAgent(id) {
  loadingAdd.value = true
  try {
    await api.post(`/agent/add`, { user_id: id })
    success.value = true
    user.value = null
    query.value = ""
    router.push('/agents')
  } catch (error) {
    console.error(error)
  } finally {
    loadingAdd.value = false
  }
}
</script>
