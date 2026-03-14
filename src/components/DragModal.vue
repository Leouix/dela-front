<script setup>
import VueDraggableResizable from 'vue-draggable-resizable'
</script>


<template>

    <div class="wrap-draggable">

        <div style="height: 100vh; width: 100%; position: relative;">

            <vue-draggable-resizable
                :w="500"
                :h="500"
                :parent="false"
            >
                <p>Hello! I'm a flexible component. You can drag me around and you can resize me.</p>
            </vue-draggable-resizable>

        </div>

    </div>
</template>


<style>
@import "vue-draggable-resizable/style.css";

.wrap-draggable {
    position: absolute;
    width: 500px;
    height: 500px;
    right: 0;
    bottom: 0;
}
</style>
