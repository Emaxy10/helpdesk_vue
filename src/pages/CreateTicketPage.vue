<template>
  <v-card class="mx-auto pa-6" max-width="600" elevation="6" rounded="xl">
    <v-card-title class="text-h5 font-weight-bold mb-4">
      🎫 Create New Ticket
    </v-card-title>

    <v-form v-model="valid" @submit.prevent="submitForm">
      <!-- Title -->
      <v-text-field
        v-model="ticket.title"
        label="Title"
        placeholder="Enter ticket title"
        :rules="[rules.required, rules.max255]"
        prepend-inner-icon="mdi-text"
        clearable
      />

      <!-- Description -->
      <v-textarea
        v-model="ticket.description"
        label="Description"
        placeholder="Describe the issue"
        prepend-inner-icon="mdi-text-box-outline"
        rows="3"
        auto-grow
        clearable
      />

      <!-- Status (disabled, default Open) -->
      <v-select
        v-model="ticket.status"
        :items="statuses"
        label="Status"
        prepend-inner-icon="mdi-progress-check"
        disabled
      />

      <!-- Priority -->
      <v-select
        v-model="ticket.priority"
        :items="priorities"
        label="Priority"
        placeholder="Select priority"
        prepend-inner-icon="mdi-alert-circle"
        :rules="[rules.required]"
      />

      <!-- User -->
      <v-select
        v-model="ticket.assign_to"
        :items="users"
        item-title="name"
        item-value="id"
        label="Assign to User"
        prepend-inner-icon="mdi-account"
        :rules="[rules.required]"
      />

      <!-- Actions -->
      <div class="d-flex justify-end mt-6">
        <v-btn text color="grey" @click="resetForm">Cancel</v-btn>
        <v-btn
          color="primary"
          type="submit"
          class="ml-4"
          :disabled="!valid"
          prepend-icon="mdi-content-save"
        >
          Save Ticket
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "@/plugins/axios"

const valid = ref(false)

const ticket = ref({
  title: "",
  description: "",
  status: "open",   // 👈 default to open
  priority: null,
  assign_to: null,
})

// Static options (mock data)
const statuses = ["open", "in-progress", "resolved", "closed"]
const priorities = ["low", "medium", "high"]
const users = ref([])

async function getAgent(){

    try{
        const response = await api.get('/agent');
        console.log(response.data)

        users.value = response.data
    }catch(error){
        console.error(error)
    }
    
}

onMounted( getAgent)

// Validation rules
const rules = {
  required: (v) => !!v || "This field is required",
  max255: (v) =>
    !v || v.length <= 255 || "Must be less than 255 characters",
}

const submitForm = () => {
  if (valid.value) {
    console.log("Submitting ticket:", ticket.value)
    // 🚀 Replace with your API call
  }
}

const resetForm = () => {
  ticket.value = {
    title: "",
    description: "",
    status: "open",   // 👈 reset to open again
    priority: null,
    assign_to: null,
  }
}
</script>
