<template>
  <div class="layout">
    <NavBar />
    <main class="content">
      <router-view :key="$route.fullPath"/>
    </main>
  </div>
</template>

<script setup>
import NavBar from './components/NavBar.vue'
</script>

<style scoped>
.layout {
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  color: #222;
  background-color: #f5f6f7;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  height: 100%;
}

</style>
