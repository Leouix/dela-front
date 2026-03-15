<script setup>
import { useAuthStore } from '@/stores/auth'
import { onMounted } from 'vue'

const authStore = useAuthStore()

onMounted(() => {
  if (authStore.token && !authStore.user) {
    authStore.fetchUser()
  }
})

const handleLogout = async () => {
  await authStore.logout()
}
</script>
о
<template>
  <div v-if="authStore.isAuth" class="dashboard-top-item dashboard-top-email">
    <div class="dashboard-top-item dashboard-top-item-login">
      <a v-if="authStore.user?.mode === 'company'" :href="'/my/company/profile'">
        <span class="my-profile">Мой профиль</span>
        <span class="my-profile-special">(заказчик)</span>
      </a>

      <a v-if="authStore.user?.mode === 'candidate'" :href="'/my/specialist/profile'">
        <span class="my-profile">Мой профиль</span>
        <span class="my-profile-special">(мастер)</span>
      </a>

      <button @click="handleLogout" class="logout-btn">
        Выйти
      </button>
    </div>
  </div>

  <div v-else class="dashboard-top-item dashboard-top-item-logout">
    <a href="/login">
      Вход
    </a>

    <a href="/register">
      Регистрация
    </a>
  </div>
</template>

<style scoped>
.header-area .header-right .dashboard-top .dashboard-top-email {
  display: none;
  @media screen and (min-width: 768px) {
    display: block;
  }
}

.dashboard-top-item-login {
  a {
    text-decoration: underline;
    font-size: 14px;
    span.my-profile {
      text-transform: uppercase;
    }

    span.my-profile-special {
      color: #A1EF40;
    }
  }
}

.logout-btn {
  background: none;
  border: none;
  color: inherit;
  font-size: 14px;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 10px;
}
</style>
