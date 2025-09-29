<template>
  <v-container class="fill-height d-flex align-center justify-center" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <v-card elevation="8" class="pa-6 rounded-xl">
          <v-card-title class="text-h5 font-weight-bold text-center">
            Welcome Back 👋
          </v-card-title>
          <v-card-subtitle class="text-center mb-6">
            Login to continue
          </v-card-subtitle>

          <!-- Form -->
          <form @submit.prevent="loginUser">
            <!-- Email -->
            <v-text-field
              v-model="state.email"
              label="Email Address"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-email"
              required
              :error-messages="v$.email.$errors.map(e => e.$message)"
              @blur="v$.email.$touch"
              @input="v$.email.$touch"
              class="mb-3"
            />

            <!-- Password -->
            <v-text-field
              v-model="state.password"
              :type="showPassword ? 'text' : 'password'"
              label="Password"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-lock"
              required
              :error-messages="v$.password.$errors.map(e => e.$message)"
              @blur="v$.password.$touch"
              @input="v$.password.$touch"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              class="mb-2"
            />

            <!-- Remember me -->
            <v-checkbox
              v-model="state.remember"
              label="Remember me"
              color="primary"
              hide-details
              class="mb-4"
            />

            <!-- Submit -->
            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              rounded="lg"
              :disabled="v$.$invalid"
            >
              Login
            </v-btn>

            <!-- Register Link -->
            <div class="text-center mt-4">
              <span>Don’t have an account?</span>
              <v-btn variant="text" color="primary" @click="$router.push('/register')">
                Register
              </v-btn>
            </div>
          </form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useVuelidate } from '@vuelidate/core'
import { email, required } from '@vuelidate/validators'
import api from '@/plugins/axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const state = reactive({
  email: '',
  password: '',
  remember: false,
})

const showPassword = ref(false)

const router = useRouter()

// validation rules
const rules = {
  email: { required, email },
  password: { required },
}

const v$ = useVuelidate(rules, state)

// login function
async function loginUser() {
  const success = await v$.value.$validate()
  if (!success) return

  try {
    await authStore.login(state)  // use Pinia action
    router.push('/dashboard')
  } catch (error) {
    console.error('Login error:', error.response?.data || error.message)
  }
}

</script>
