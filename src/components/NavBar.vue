<template>
  <v-app-bar app color="green-darken-3" dark>
    <v-app-bar-title class="d-flex align-center gap-2">
      <v-icon icon="mdi-headset" size="30" class="text-white" />
      <span class="text-h5 font-weight-bold text-white">HelpDesk</span>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <!-- Show when NOT logged in -->
    <template v-if="!store.isAuthenticated">
      <v-btn to="/login" variant="outlined" color="white" class="mr-2">
        Login
      </v-btn>
      <v-btn to="/register" variant="flat" color="secondary">
        Register
      </v-btn>
    </template>

    <!-- Show when logged in -->
    <template v-else>
      <div class="d-flex align-center">
        <span class="mr-4 text-subtitle-1 font-weight-medium">
          👋 Welcome, {{ store.user?.name || "User" }}
        </span>
        <v-btn @click="handleLogout" variant="outlined" color="white">
          Logout
        </v-btn>
      </div>
    </template>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted } from "vue"
import { useAuthStore } from "@/stores/auth"
import { useRouter } from "vue-router"

const store = useAuthStore()
const router = useRouter()
const username = ref("User") // default fallback

// Load persisted username from localStorage
onMounted(() => {
  const saved = localStorage.getItem("auth-store")
  if (saved) {
    const parsed = JSON.parse(saved)
    username.value = parsed.user?.name || "User"
    store.user = parsed.user || null
    store.token = parsed.token || null
  }
})

const handleLogout = () => {
  try {
    store.clearTokens()
    username.value = "User" // reset ref
    router.push("/login")
  } catch (error) {
    console.error("Logout error:", error)
  }
}

</script>
