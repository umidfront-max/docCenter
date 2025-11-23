<template>
  <el-header class="bg-white shadow flex items-center justify-between px-5">
    <!-- Sidebar toggle -->
    <el-button
      size="small"
      circle
      @click="$emit('toggleSidebar')"
      class="hover:bg-gray-100"
    >
      <el-icon><Menu /></el-icon>
    </el-button>

    <!-- Profile -->
    <ProfileMenu />
  </el-header>
</template>

<script setup>
import ProfileMenu from "./ProfileMenu.vue";
import { Menu } from "@element-plus/icons-vue";
</script>
