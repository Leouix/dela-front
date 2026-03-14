<script setup>
import {useHeaderStore} from "@/stores/header.js";
import {useMenuPagesStore} from "@/stores/menu.js";
const store = useHeaderStore()

const menuStore = useMenuPagesStore()
const menuItems = menuStore.getItems

</script>

<template>
  <ul>
    <a
        v-for="menuItem in menuItems"
        :key="'menuItem' + store.getKeyId"
        v-bind:href="menuItem.path"
    >
      <li>{{menuItem.label}}</li>
    </a>
  </ul>

</template>

<style scoped>

</style>