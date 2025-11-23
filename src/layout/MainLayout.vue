<template>
  <div class="flex h-screen bg-gradient-to-br from-gray-100 to-gray-200">
    <!-- SIDEBAR -->
    <AppSidebar :collapsed="collapsed" />

    <!-- MAIN -->
    <div class="flex flex-col flex-1 overflow-hidden">
      <!-- HEADER (Glass style) -->
      <header
        class="sticky top-0 z-50 backdrop-blur-md bg-white/80 shadow-md border-b border-white/30"
      >
        <AppHeader @toggleSidebar="collapsed = !collapsed" />
      </header>

      <!-- PAGE CONTENT -->
      <main class="p-6 overflow-auto flex-1">
        <div class="p-8! min-h-[calc(100vh-120px)]">
          <router-view />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'

const collapsed = ref(false)
</script>
