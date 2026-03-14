<script setup>
import draggable from "vuedraggable";
import {useDragNDropStore} from "@/stores/drag-n-drop.js";
import TaskApplicationCard from "@/components/TaskApplicationCard.vue";

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
            <task-application-card :taskApplication="element"></task-application-card>
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
