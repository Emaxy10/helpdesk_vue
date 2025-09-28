<template>
    <!-- <v-app-bar title="Application bar"></v-app-bar> -->
     <v-app-bar app color="green-darken-3" dark>
    <v-app-bar-title>My App</v-app-bar-title>

    <v-spacer></v-spacer> <!-- pushes buttons to the right -->

    <v-btn to="/login" variant="outlined" color="white" class="mr-2">
      Login
    </v-btn>
    <v-btn to="/register" variant="flat" color="secondary">
      Register
    </v-btn>
  </v-app-bar>
</template>