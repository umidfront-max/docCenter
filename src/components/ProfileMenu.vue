<template>
  <div class="relative">
    <div
      @click="toggle"
      class="flex items-center gap-3 p-2! rounded-lg cursor-pointer hover:bg-gray-100 transition"
    >
      <img
        src="https://ui-avatars.com/api/?name=DFattoyev<"
        class="w-9 h-9 rounded-full shadow-sm"
      />
      <span class="font-medium">D.Fattoyev</span>
      <el-icon><ArrowDown /></el-icon>
    </div>

    <transition name="fade">
      <div 
        v-if="open"
        class="absolute right-0 mt-2! w-40 bg-white shadow-lg rounded-lg py-2! z-50"
      >
        <button 
          @click="logout"
          class="w-full text-left px-4! py-2! hover:bg-gray-100 transition"
        >
          Logout
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ArrowDown } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";

const open = ref(false);
const router = useRouter();

const toggle = () => (open.value = !open.value);

const logout = () => {
  localStorage.removeItem("token");
  router.push("/login");
};
</script>

<style scoped>
.fade-enter-from {
  opacity: 0;
  transform: translateY(-5px);
}
.fade-enter-to {
  opacity: 1;
  transform: translateY(0);
}
.fade-enter-active {
  transition: all .2s ease;
}

.fade-leave-from {
  opacity: 1;
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.fade-leave-active {
  transition: all .2s ease;
}
</style>
