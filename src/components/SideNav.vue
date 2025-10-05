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

        <v-list-item
          prepend-icon="mdi-format-list-bulleted"
          title="All Tickets"
          to="/tickets"
        />

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
