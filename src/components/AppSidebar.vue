<template>
  <transition name="slide">
    <aside
      :style="{ width: collapsed ? '75px' : '240px' }"
      class="h-full bg-slate-800 text-white shadow-xl transition-all duration-300 flex flex-col"
    >
      <!-- LOGO -->
      <div class="flex items-center justify-center gap-3 h-16 border-b border-slate-700">
        <img class="h-10" src="@/assets/img/logo.png" alt="" />
        <span v-if="!collapsed" class="text-xl font-bold tracking-wide">
          <span class="text-indigo-400">Ichki </span> ishlar
        </span>
      </div>

      <!-- MENU -->
      <el-menu
        :default-active="route.path"
        background-color="transparent"
        text-color="#cbd5e1"
        active-text-color="#4f46e5"
        class="mt-4 border-none"
        :collapse="collapsed"
      >
        <el-menu-item index="/home" @click="go('/home')" class="menu-item">
          <el-icon><HomeFilled /></el-icon>
          <span>Dashboard</span>
        </el-menu-item>

        <el-menu-item index="/shield" @click="go('/shield')" class="menu-item">
          <el-icon><Lock /></el-icon>
          <span>Qalqon</span>
        </el-menu-item>

        <el-menu-item index="/102" @click="go('/102')" class="menu-item">
          <el-icon><ChatDotSquare /></el-icon>
          <span>102</span>
        </el-menu-item>
      </el-menu>
    </aside>
  </transition>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { HomeFilled, Lock, ChatDotSquare } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()

defineProps({ collapsed: Boolean })

const go = (path) => router.push(path)
</script>

<style scoped>
.menu-item {
  transition: 0.3s;
  border-radius: 8px;
}
.menu-item:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
</style>
