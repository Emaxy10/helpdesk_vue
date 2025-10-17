<template>
  <v-app-bar app color="green-darken-3" dark>
    <v-app-bar-title>My App</v-app-bar-title>

    <v-spacer></v-spacer>

    <template v-if="!store.isAuthenticated">
      <v-btn to="/login" variant="outlined" color="white" class="mr-2">
        Login
      </v-btn>
      <v-btn to="/register" variant="flat" color="secondary">
        Register
      </v-btn>
    </template>

    <template v-else>
      <div class="d-flex align-center">
        <span class="mr-4 text-subtitle-1 font-weight-medium">
          👋 Welcome, {{ store.user?.name || 'User' }}
        </span>
        <v-btn @click="store.logout" variant="outlined" color="white">
        Logout
      </v-btn>
      </div>
      
    </template>
  </v-app-bar>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const store = useAuthStore()

onMounted(async () => {
  try {
    await store.fetchUser()
    console.log('User fetched:', store.user)
  } catch (error) {
    console.error('Error fetching user:', error)
  }
})

</script>