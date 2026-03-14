<script setup>
import { useHeaderStore } from "@/stores/header.js";
import ToggleUserMode from "@/components/ToggleUserMode.vue";
import { computed } from 'vue';
import { getUsePage } from "@/composables/usePage.js";

const headerStore = useHeaderStore();
const page = getUsePage();
const userRole = null;

const commonMenu = computed(() => {
    return headerStore.menuConfig['common'];
});

const adminMenu = computed(() => {
    return page?.props?.is_admin ? headerStore.menuConfig['admin'] : [];
});

const taskMenu = computed(() => {
    return userRole === 'candidate'
        ? headerStore.menuConfig['taskCandidate']
        : headerStore.menuConfig['taskCompany'];
})

const vacMenu = computed(() => {
    return userRole === 'candidate'
        ? headerStore.menuConfig['vacCandidate']
        : headerStore.menuConfig['vacCompany'];
})

const favoritesMenu = computed(() => {
    return userRole === 'candidate'
        ? headerStore.menuConfig['candidateFavorites']
        : headerStore.menuConfig['companyFavorites'];
})



/**
 * Тексты и урлы кнопок
 * @type {ComputedRef<string>}
 */

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
    <div class="sidebar">

        <div class="menu-items" :style="{ width: `${headerStore.widthSideBar}px` }">


            <a class="new-button" :href="urlTaskButton">
                <div v-if="headerStore.showDesktopSidebar" class="new-task-button">
                    <div class="new-task-button__plus">+</div>
                    <div class="new-task-button__text">{{textTaskButton}}</div>
                </div>
                <div v-else class="new-task-button-hidden-sb">
                    <div class="new-task-button__plus">+</div>
                </div>
            </a>

            <div class="task-menu-area">

                <ul  v-if="taskMenu" class="public-menu">
                    <li v-for="menuItem in taskMenu" :key="'a-menuItem-'+menuItem.id">
                        <a
                            v-bind:href="menuItem.href"
                        >
                            <img
                                :title="menuItem.title"
                                :class="menuItem.iconClass"
                                :src="menuItem.icon"
                                :alt="menuItem.alt"
                            >
                            <span v-if="headerStore.showDesktopSidebar">{{ menuItem.text }}</span>
                        </a>
                    </li>
                </ul>
            </div>

            <a class="new-button" :href="urtVacButton">
                <div v-if="headerStore.showDesktopSidebar" class="new-vacancy-button">
                    <div class="new-vacancy-button__plus">+</div>
                    <div class="new-vacancy-button__text">{{textVacButton}}</div>
                </div>
                <div v-else class="new-vacancy-button-hidden-sb">
                    <div class="new-task-button__plus">+</div>
                </div>
            </a>

            <div class="vac-menu-area">


                <ul  v-if="vacMenu" class="public-menu">
                    <li v-for="menuItem in vacMenu" :key="'a-vac-menuItem-'+menuItem.id">
                        <a
                            v-bind:href="menuItem.href"
                        >
                            <img
                                :title="menuItem.title"
                                :class="menuItem.iconClass"
                                :src="menuItem.icon"
                                :alt="menuItem.alt"
                            >
                            <span v-if="headerStore.showDesktopSidebar">{{ menuItem.text }}</span>
                        </a>
                    </li>
                </ul>
            </div>

            <hr>
            <ul class="public-menu common-menu">
                <li v-for="menuItem in commonMenu" :key="'p-menuItem-'+menuItem.id">
                    <a
                        v-bind:href="menuItem.href"
                    >
                        <img
                            :title="menuItem.title"
                            :class="menuItem.iconClass"
                            :src="menuItem.icon"
                            :alt="menuItem.alt"
                        >
                        <span v-if="headerStore.showDesktopSidebar">{{ menuItem.text }}</span>
                    </a>
                </li>
            </ul>

            <ul class="public-menu favorites-menu">
                <li v-for="menuItemFav in favoritesMenu" :key="'p-favoritesItem-'+menuItemFav.id">
                    <a
                        v-bind:href="menuItemFav.href"
                    >
                        <img
                            :title="menuItemFav.title"
                            :class="menuItemFav.iconClass"
                            :src="menuItemFav.icon"
                            :alt="menuItemFav.alt"
                        >
                        <span v-if="headerStore.showDesktopSidebar">{{ menuItemFav.text }}</span>
                    </a>
                </li>
            </ul>

            <hr v-if="adminMenu.length > 0" >
            <ul  v-if="page?.props?.is_admin" class="public-menu admin-menu">
                <li v-for="menuItem in adminMenu" :key="'a-menuItem-'+menuItem.id">
                    <a
                        v-bind:href="menuItem.href"
                    >
                        <img
                            :title="menuItem.title"
                            :class="menuItem.iconClass"
                            :src="menuItem.icon"
                            :alt="menuItem.alt"
                        >
                        <span v-if="headerStore.showDesktopSidebar">{{ menuItem.text }}</span>
                    </a>
                </li>
            </ul>

        </div>

        <toggle-user-mode v-if="userRole" :userRole="userRole" />

        <div id="toggle-desktop-sidebar-icon" @click="headerStore.toggleDesktopMenu"></div>

    </div>
</template>

<style scoped>
.new-task-button {
    background: #36842a;
    width: 183px;
    height: 39px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    .new-task-button__plus {
        font-size: 20px;
    }
    .new-task-button__text {
        font-size: 12px;
        text-transform: uppercase;
        font-weight: 700;

        &:hover {
            text-decoration: underline;
        }
    }
}

a.new-button {
    &:hover {
        text-decoration: none;
    }

}

.new-vacancy-button {
    margin-top: 10px;
    background: #9a6935;
    width: 183px;
    height: 39px;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;


}
.new-vacancy-button__plus {
    font-size: 20px;
}
.new-vacancy-button__text {
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 700;

    &:hover {
        text-decoration: underline;
    }
}

.new-task-button-hidden-sb {
    width: 20px;
    height: 39px;
    background: #36842a;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.new-vacancy-button-hidden-sb {
    width: 20px;
    height: 39px;
    background: #9a6935;
    border-radius: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
}

.favorites-menu {
    padding: 0;
}

.common-menu {
    padding: 0;
}
</style>
