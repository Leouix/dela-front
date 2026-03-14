<script setup>
import JobApplicationCard from "@/components/JobApplicationCard.vue";
import draggable from "vuedraggable";
import {useDragNDropStore} from "@/stores/drag-n-drop.js";

const dragNDropStore = useDragNDropStore();
</script>

<template>

    <h3>Список откликов</h3>
    <draggable
        @change="dragNDropStore.moveElements"
        :model-value="dragNDropStore.items"
        group="items"
        @start="dragNDropStore.startDragging"
        @end="dragNDropStore.stopDragging"
        item-key="id"
        class="draggable-items"
    >
        <template #item="{ element }">
            <job-application-card :jobApplication="element"></job-application-card>
        </template>
    </draggable>
    <p v-if="dragNDropStore.isDragging">Перетаскивание активно...</p>

</template>

<style scoped>

.draggable-items {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
}
</style>
