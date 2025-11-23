<script setup>
import AdminSheild from './AdminSheild.vue'
import UserSheild from './UserSheild.vue'
import { _roles } from '@/stores/auth'
</script>

<template>
  <div>
    <AdminSheild v-if="_roles.includes('SUPER_ADMIN')" />
    <UserSheild v-else />
  </div>
</template>
