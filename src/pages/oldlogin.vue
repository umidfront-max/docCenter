<template>
  <div class="flex items-center justify-center h-screen bg-gray-100">
    <el-card class="w-96">
      <h2 class="text-xl font-bold mb-4">Kirish</h2>
      <el-form :model="form" @submit.prevent="login">
        <el-form-item label="Username">
          <el-input v-model="form.username" placeholder="Login" />
        </el-form-item>
        <el-form-item label="Password">
          <el-input v-model="form.password" type="password" placeholder="Parol" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" class="w-full" @click="login">Kirish</el-button>
        </el-form-item>
      </el-form>
      <div class="text-center mt-2">
        <router-link to="/register">Ro‘yxatdan o‘tish</router-link>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from "vue"
import { useRouter } from "vue-router"
import api from "@/api"

const router = useRouter()
const form = ref({
  username: "",
  password: "",
})

const login = async () => {
  try {
    const { data } = await api.post("/auth/", form.value) 
    // Tokenni saqlash
    localStorage.setItem("token", data.token || data.access || "")
    alert("Muvaffaqiyatli kirdingiz!")
    router.push("/")
  } catch (err) {
    console.error(err)
    alert("Login yoki parol noto‘g‘ri")
  }
}
</script>
