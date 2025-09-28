<template>
  <v-layout>
    <!-- Shared navigation for all main pages -->
    <NavBar />
    <SideNav />

    <!-- Page content -->
    <v-main>
      <v-container fluid>
        <router-view />
      </v-container>
    </v-main>
  </v-layout>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import SideNav from '@/components/SideNav.vue'
</script>
