<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script setup>
</script>

<style>

nav a {
  text-decoration: none;
  color: #333;
  padding: 8px 16px;
  border-radius: 4px;
}

nav a.router-link-active {
  background: #42b983;
  color: white;
}
</style>