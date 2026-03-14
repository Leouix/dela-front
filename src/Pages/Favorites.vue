<script setup>
import MainHeader from "@/components/MainHeader.vue";
import MainFooter from "@/components/MainFooter.vue";

const props = defineProps([
  'favorites',
])

// console.log(props.favorites)


</script>

<template>
  <div>

    <main-header />

    <div class="page content">
      <h1>Favorites</h1>

      <div class="favorites">
        <div
            class="item-favorites"
            v-for="favorite in props.favorites"
            :key="favorite.id"
        >
          <a v-bind:href="'/card/' + favorite.id"> {{ favorite.profession }} ({{favorite.name}})</a>
        </div>
      </div>

    </div>
    <main-footer />
  </div>
</template>
