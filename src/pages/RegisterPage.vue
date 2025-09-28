<template>
  <v-container class="fill-height d-flex align-center justify-center" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="5">
        <v-card elevation="8" class="pa-6 rounded-xl">
          <v-card-title class="text-h5 font-weight-bold text-center">
            Create Your Account
          </v-card-title>
          <v-card-subtitle class="text-center mb-6">
            Sign up to get started 🚀
          </v-card-subtitle>

          <!-- Form -->
          <form @submit.prevent="submitForm">
            <!-- Name -->
            <v-text-field
              v-model="state.name"
              label="Full Name"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-account"
              required
              :error-messages="v$.name.$errors.map(e => e.$message)"
              @blur="v$.name.$touch"
              @input="v$.name.$touch"
              class="mb-3"
            />

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
              class="mb-3"
            />

            <!-- Confirm Password -->
            <v-text-field
              v-model="state.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              label="Confirm Password"
              variant="outlined"
              density="comfortable"
              prepend-inner-icon="mdi-lock-check"
              :error-messages="v$.confirmPassword.$errors.map(e => e.$message)"
              @blur="v$.confirmPassword.$touch"
              @input="v$.confirmPassword.$touch"
              :append-inner-icon="showConfirmPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showConfirmPassword = !showConfirmPassword"
              class="mb-5"
            />

            <!-- Buttons -->
            <v-btn
              type="submit"
              color="primary"
              size="large"
              block
              rounded="lg"
              :disabled="v$.$invalid"
            >
              Register
            </v-btn>

            <div class="text-center mt-4">
              <span>Already have an account?</span>
              <v-btn variant="text" color="primary" @click="$router.push('/login')">
                Login
              </v-btn>
            </div>
          </form>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useVuelidate } from '@vuelidate/core'
import { email, required, helpers, sameAs } from '@vuelidate/validators'
import api from '@/plugins/axios'

const initialState = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}
const router = useRouter()

const state = reactive({ ...initialState })

// toggle eye icon
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// make password reactive for confirmPassword
const passwordValue = computed(() => state.password)

// strong password rule
const strongPassword = helpers.withMessage(
  'Password must be at least 8 characters, include 1 uppercase, 1 number, and 1 special character',
  helpers.regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/)
)

const rules = {
  name: { required },
  email: { required, email },
  password: { required, strongPassword },
  confirmPassword: {
    required,
    sameAsPassword: helpers.withMessage(
      'Passwords do not match',
      sameAs(passwordValue)   // 👈 FIXED
    )
  }
}

const v$ = useVuelidate(rules, state)

// reset form
function clear() {
  v$.$reset()
  Object.assign(state, initialState)
}

async function submitForm() {
  const success = await v$.value.$validate()

  if (success) {
    console.log('Form Data:', state)

    try {

        // 👇 fetch CSRF cookie from Laravel Sanctum
      await api.get('/sanctum/csrf-cookie')


      const response = await api.post('/register', state)
      console.log('API Response:', response.data)
      router.push('/login')
      clear()
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message)
    }
  }
}
</script>
