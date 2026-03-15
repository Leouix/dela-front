<script setup>
import AppLayout from "@/Layouts/AppLayout.vue"
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout.vue"
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  authStore.fetchUser()
})
</script>

<template>
  <AppLayout>
    <AuthenticatedLayout>
      <template #header>
        <h2 class="text-xl font-semibold leading-tight text-gray-800">
          Dashboard
        </h2>
      </template>

      <div class="py-12">
        <div class="mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div class="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div class="p-6 text-gray-900">
              <div v-if="authStore.user">
                Вы вошли как: {{ authStore.user.email }}
              </div>
              <div v-else>
                Загрузка...
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  </AppLayout>
</template>
