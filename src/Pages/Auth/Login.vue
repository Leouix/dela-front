<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import AppLayout from "@/Layouts/AppLayout.vue"
import Checkbox from '@/components/Checkbox.vue'
import InputError from '@/components/InputError.vue'
import InputLabel from '@/components/InputLabel.vue'
import PrimaryButton from '~/components/PrimaryButton.vue'
import TextInput from '@/components/TextInput.vue'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
const errors = ref({})

const loginWithGoogle = () => {
  window.location.href = `/auth/google/redirect`
}

const loginWithGithub = () => {
  window.location.href = `/auth/github/redirect`
}

const submit = async () => {
  errors.value = {}

  const success = await authStore.login({
    email: email.value,
    password: password.value,
    remember: remember.value
  })

  if (success) {
    router.push({ name: 'dashboard' })
  } else if (authStore.error) {
    errors.value.password = authStore.error
  }
}
</script>

<template>
  <AppLayout>
    <div class="social-auth-block">
      <PrimaryButton type="button" class="ms-4 social-authorize" @click="loginWithGoogle">
        <span class="social-authorize-google"></span>Google авторизация
      </PrimaryButton>

      <PrimaryButton type="button" class="ms-4 social-authorize" @click="loginWithGithub">
        <span class="social-authorize-github"></span>GitHub авторизация
      </PrimaryButton>
    </div>

    <form class="form-login-register" @submit.prevent="submit">
      <h1>Вход в аккаунт</h1>

      <div>
        <InputLabel for="email" value="Email" />

        <TextInput
          id="email"
          type="email"
          class="mt-1 block w-full"
          v-model="email"
          required
          autofocus
          autocomplete="username"
        />
      </div>

      <div class="mt-4">
        <InputLabel for="password" value="Пароль" />

        <div class="relative">
          <TextInput
            id="password"
            :type="showPassword ? 'text' : 'password'"
            class="mt-1 block w-full"
            v-model="password"
            required
            autocomplete="current-password"
          />

          <div
            :class="['toggle-visibility', showPassword ? 'password-hide' : 'password-show']"
            @click="showPassword = !showPassword"
          ></div>
        </div>

        <InputError class="mt-2 text-error" :message="errors.password" />
      </div>

      <div class="mt-4 block">
        <label class="flex items-center">
          <Checkbox name="remember" v-model:checked="remember" />
          <span class="ms-2 text-sm text-gray-600">Запомнить меня</span>
        </label>
      </div>

      <div class="mt-4 flex items-center justify-between forgot-password">
        <a
          href="/forgot-password"
          class="rounded-md text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Забыли пароль?
        </a>

        <a
          href="/register"
          class="rounded-md text-sm underline focus:outline-none"
        >
          Регистрация
        </a>

        <PrimaryButton
          class="ms-4"
          :class="{ 'opacity-25': authStore.loading }"
          :disabled="authStore.loading"
        >
          Войти
        </PrimaryButton>
      </div>
    </form>
  </AppLayout>
</template>

<style scoped>
.form-login-register {
  background: #686767;
  border-radius: 10px;
  max-width: 490px;
  margin: 0 auto;
  color: #eeeeee;
  font-size: 18px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.form-login-register h1 {
  margin: 0 0 5px;
  color: #ffffff;
}

.form-login-register input {
  color: #000;
  border-radius: 4px;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  margin: 5px 0;
  box-sizing: border-box;
}

.form-login-register input[type="radio"] {
  margin: 5px;
}

.form-login-register input[type="checkbox"] {
  margin: 5px 5px 5px 0;
}

.form-login-register p {
  font-size: 14px;
}

.form-login-register .forgot-password a {
  font-size: 14px;
}
</style>
