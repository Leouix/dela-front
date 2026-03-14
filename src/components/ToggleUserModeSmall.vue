<script setup>
import {computed, onMounted, onUnmounted, ref} from "vue";
import {useHeaderStore} from "@/stores/header.js";

const props = defineProps({
    userRole: String|null,
    isMobile: Boolean|null,
})

const headerStore = useHeaderStore();
const isDesktopSidebarVisible = computed(() => headerStore.showDesktopSidebar);

const tipActive = ref(false);
const selectedMode = ref(props.userRole);

function toggleTooltip() {
    tipActive.value = !tipActive.value;
}

function handleClickOutside(e) {
    const infoIcon = e.target.closest('.mode-info-icon');
    if (!infoIcon && tipActive.value) {
        tipActive.value = false;
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
    selectedMode.value = props.userRole;
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});


function handleModeChange(event) {
    const newMode = event.target.value;
    window.location.href = `/mode/${newMode}`;
}

</script>

<template>
    <div class="mode-selecting">


       <div v-if="isDesktopSidebarVisible || isMobile" style="display: inline-block">
           <select
               id="mode-select"
               :value="selectedMode"
               @change="handleModeChange"
               class="mode-select"
           >
               <option value="candidate">Мастер</option>
               <option value="company">Заказчик</option>
           </select>

       </div>

    </div>
</template>

<style scoped>


</style>
