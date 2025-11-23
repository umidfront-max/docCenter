<script setup>
import { ref, onMounted } from 'vue'
import dayjs from 'dayjs'
import useShield from '@/stores/useShield'
import { ElMessage } from 'element-plus'

const shieldPinia = useShield()

const today = dayjs().format('YYYY-MM-DD')

// Bitta date picker → [start, end]
const _data = ref({
  range: [today, today],
})

const form = ref({
  daytimeEmployeeCount: 0,
  nighttimeEmployeeCount: 0,
  searchCount: 0,
  missingCount: 0,
  adminCtrlCount: 0,
  rapidWantedCount: 0,
  carWantedCount: 0,
  probationCount: 0,
  hotTrailCount: 0,
  minorMissingCount: 0,
  itemFoundCount: 0,
})

const loadShields = async () => {
  await shieldPinia.getShields(
    {
      start: _data.value.range[0],
      end: _data.value.range[1],
    },
    (data) => {
      form.value = data || {}
    },
  )
}

const submitForm = () => {
  shieldPinia.addShields(
    {
      ...form.value,
    },
    () => {
      ElMessage.success('Yaratildi')
      loadShields(
        {
          start: _data.value.range[0],
          end: _data.value.range[1],
        },
        (data) => {
          form.value = data
        },
      )
    },
  )
}

onMounted(() => {
  shieldPinia.getShields(
    {
      start: _data.value.range[0],
      end: _data.value.range[1],
    },
    (data) => {
      form.value = data
    },
  )
})
</script>
<template>
  <div class="space-y-8">
    <h2 class="text-2xl mb-6! font-bold text-slate-700">Qalqon maʼlumotlari</h2>

    <!-- Sana Range -->
    <el-form label-position="top" class="flex gap-5">
      <el-form-item label="Filter">
        <el-date-picker
          v-model="_data.range"
          type="daterange"
          unlink-panels
          class="w-80!"
          range-separator="→"
          start-placeholder="Boshlanish"
          end-placeholder="Tugash"
          value-format="YYYY-MM-DD"
          format="DD.MM.YYYY"
          style="width: 100%"
          @change="loadShields"
        />
      </el-form-item>
    </el-form>

    <!-- Asosiy Forma -->
    <el-form
      :model="form"
      label-position="top"
      class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6"
    >
      <el-form-item label="Qidiruv">
        <el-input v-model="form.searchCount" type="number" placeholder="0" />
      </el-form-item>

      <el-form-item label="Bedarak yo‘qolganlar">
        <el-input v-model="form.missingCount" type="number" placeholder="0" />
      </el-form-item>

      <el-form-item label="Maʼmuriy nazorat">
        <el-input v-model="form.adminCtrlCount" type="number" placeholder="0" />
      </el-form-item>

      <el-form-item label="Tezkor-qidiruv eʼlon qilinganlar">
        <el-input v-model="form.rapidWantedCount" type="number" placeholder="0" />
      </el-form-item>

      <el-form-item label="Qidiruvdagi avtomashinalar">
        <el-input v-model="form.carWantedCount" type="number" placeholder="0" />
      </el-form-item>

      <el-form-item label="Probatsiya cheklovidan buzg‘anlar">
        <el-input v-model="form.probationCount" type="number" placeholder="0" />
      </el-form-item>

      <el-form-item label="“Issiq izdan” ochilgan jinoyatlar">
        <el-input v-model="form.hotTrailCount" type="number" placeholder="0" />
      </el-form-item>

      <el-form-item label="Voyaga yetmagan yo‘qolgan shaxslar">
        <el-input v-model="form.minorMissingCount" type="number" placeholder="0" />
      </el-form-item>

      <el-form-item label="Yo‘qolgan buyum topilishi">
        <el-input v-model="form.itemFoundCount" type="number" placeholder="0" />
      </el-form-item>
    </el-form>

    <div class="flex justify-end">
      <el-button type="primary" size="large" @click="submitForm"> Saqlash </el-button>
    </div>
  </div>
</template>
