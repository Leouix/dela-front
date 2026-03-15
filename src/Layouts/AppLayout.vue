<script setup>
import MainHeader from "../components/MainHeader.vue";
import MainFooter from "../components/MainFooter.vue";
import MainSidebar from "../components/MainSidebar.vue";
import {computed, onMounted} from "vue";
import {useChatStore} from "../stores/chatStore.js";
import {useTaskOrderStore} from "../stores/taskOrder.js";

const userRole = null;
const user = null;
const store = useChatStore();

const taskOrders = [];
const taskOrderStore = useTaskOrderStore();

onMounted(() => {
    // store.chatsConnect(user);
    // taskOrderStore.connectTaskOrdersChannel(userRole, taskOrders);
});

const textTaskButton = computed(() => {
    return userRole === 'candidate'
        ? 'Закрыть задачу'
        : 'Создать задачу';
})
const urlTaskButton = computed(() => {
    return userRole === 'candidate'
        ? '/task-orders'
        : '/my/company/new-task';
})

const textVacButton = computed(() => {
    return userRole === 'candidate'
        ? 'Найти вакансию'
        : 'Создать вакансию';
})
const urtVacButton = computed(() => {
    return userRole === 'candidate'
        ? '/all-vacancies'
        : '/my/company/new-vacancy';
})

</script>

<template>
    <div class="app-layout">

        <main-header />
        <div class="main-create-buttons">
            <a class="add-new-button" :href="urlTaskButton">
                <div class="new-task-button">
                    <div class="new-task-button__plus">+</div>
                    <div class="new-task-button__text">{{ textTaskButton }}</div>
                </div>
            </a>
            <a class="add-new-button" :href="urtVacButton">
                <div class="new-vacancy-button">
                    <div class="new-vacancy-button__plus">+</div>
                    <div class="new-vacancy-button__text">{{textVacButton}}</div>
                </div>
            </a>
        </div>


            <div class="content-wrapper">
                <main-sidebar />
                <main class="page-content">
                    <slot />
                </main>
            </div>

        <main-footer />
    </div>
</template>

<style scoped>

.app-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.content-wrapper {
    display: flex;
    flex: 1;
}


</style>
