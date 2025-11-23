<template>
  <el-form inline class="filter-form">
    <el-select v-model="filters.type" placeholder="Turi" clearable>
      <el-option label="Ochiq" value="ochiq" />
      <el-option label="Anonim" value="anonim" />
    </el-select>

    <el-select v-model="filters.status" placeholder="Status" clearable>
      <el-option label="Yangi" value="new" />
      <el-option label="Kutilmoqda" value="pending" />
      <el-option label="Yakunlangan" value="finished" />
    </el-select>

    <el-select v-model="filters.yonalish" placeholder="Yo‘nalish" clearable>
      <el-option v-for="y in yonalishlar" :key="y.id" :label="y.name" :value="y.id" />
    </el-select>

    <el-select v-model="filters.hudud" placeholder="Hudud" clearable>
      <el-option v-for="h in hududlar" :key="h.id" :label="h.name" :value="h.id" />
    </el-select>

    <el-select v-model="filters.xizmat" placeholder="Xizmat" clearable>
      <el-option v-for="x in xizmatlar" :key="x.id" :label="x.name" :value="x.id" />
    </el-select>

    <el-date-picker v-model="filters.date" type="daterange" start-placeholder="Boshlang'ich" end-placeholder="Tugash" />

    <el-input v-model="filters.search" placeholder="Qidiruv..." />

    <el-button type="primary" @click="apply">Filter</el-button>
  </el-form>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "@/api"
const emit = defineEmits(["filter"])

const filters = ref({
  type: null, status: null, yonalish: null, hudud: null, xizmat: null, date: null, search: ""
})

const yonalishlar = ref([])
const hududlar = ref([])
const xizmatlar = ref([])

const loadLists = async () => {
  const [y, h, x] = await Promise.all([api.get("/yonalishlar/"), api.get("/hududlar/"), api.get("/xizmatlar/")])
  yonalishlar.value = y.data
  hududlar.value = h.data
  xizmatlar.value = x.data
}

const apply = () => emit("filter", filters.value)

onMounted(loadLists)
</script>
