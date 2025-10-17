<template>
  <v-navigation-drawer app permanent>
    <v-list nav density="comfortable">
      <!-- Dashboard -->
      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="Dashboard"
        to="/dashboard"
      />

      <!-- Tickets Dropdown -->
      <v-list-group prepend-icon="mdi-ticket" value="true">
        <template v-slot:activator="{ props }">
          <v-list-item v-bind="props" title="Tickets" />
        </template>

        <v-list-item
          prepend-icon="mdi-plus-box"
          title="Create Ticket"
          to="/tickets/create"
        />

        <!-- 👇 Only visible to agent or admin -->
        <template v-if="hasTicketAccess">
          <v-list-item
            prepend-icon="mdi-format-list-bulleted"
            title="All Tickets"
            to="/tickets"
          />

          <v-list-item
            prepend-icon="mdi-account-plus"
            title="Add Agent"
            to="/agents/add"
          />

          <v-list-item
            prepend-icon="mdi-account-group"
            title="Agents"
            to="/agents"
          />
        </template>


        <v-list-item
          prepend-icon="mdi-account-tie"
          title="My Tickets"
          to="/tickets/my"
        />
      </v-list-group>

      <!-- Settings -->
      <v-list-item
        prepend-icon="mdi-cog"
        title="Settings"
        to="/settings"
      />
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const store = useAuthStore()

// ✅ Computed property to check if user has any role with name 'admin' or 'agent'
const hasTicketAccess = computed(() => {
  if (!store.user?.roles) return false
  return store.user.roles.some(role =>
    ['admin', 'agent'].includes(role.name.toLowerCase())
  )
})
</script>
