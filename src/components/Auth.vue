<script setup>

const user = null;

</script>

<template>
    <div v-if="user?.email" class="dashboard-top-item dashboard-top-email">

        <div class="dashboard-top-item dashboard-top-item-login">

            <a v-if="user?.mode === 'company'" :href="route('company.dashboard')"><span class="my-profile">Мой профиль</span> <span class="my-profile-special">(заказчик)</span>
            </a>

            <a v-if="user?.mode === 'candidate'" :href="route('candidate.dashboard')"><span class="my-profile">Мой профиль</span> <span class="my-profile-special">(мастер)</span>
            </a>

        </div>

    </div>

    <div v-else class="dashboard-top-item dashboard-top-item-logout">
        <a :href="'/login'">
            Вход
        </a>

        <a :href="'/register'">
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

</style>
