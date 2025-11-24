<script setup>
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import useShield from '@/stores/useShield'
import { ElMessage } from 'element-plus'
import BaseFile from '@/components/BaseFile.vue'
import useFile from '@/stores/useFile'
import * as XLSX from 'xlsx'

const shieldPinia = useShield()
const filePinia = useFile()

const today = dayjs().format('YYYY-MM-DD')

const _data = ref({
  range: [today, today],
})

const form = ref({
  file: null,
  files: null,
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
      // ❗ formni bosib tashlamaslik
      Object.assign(form.value, data || {})
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
       Object.assign(form.value, data || {})
      form.value.file = form.value.files?.[0]
    },
  )
})

const submitForm = async () => {
  // Avval fayl yuklaymiz
  let fileString = null

  if (form.value.file) {
    try {
      const res = await filePinia.addFile(form.value.file)
      fileString = res?.file // API qaytaradigan value
    } catch (err) {
      return ElMessage.error('Fayl yuklashda xatolik')
    }
  }
  // Endi addShields chaqiramiz
  shieldPinia.addShields(
    {
      ...form.value,
      files: [fileString],
    },
    () => {
      ElMessage.success('Yaratildi')
      loadShields()
    },
  )
}

const exportExcel = () => {
  const start = _data.value.range[0]
  const end = _data.value.range[1]
  const fileName = `qalqon-${start}_${end}.xlsx`

  const data = [
    {
      Qidiruv: form.value.searchCount,
      "Bedarak yo'qolganlar": form.value.missingCount,
      "Ma'muriy nazorat": form.value.adminCtrlCount,
      "Tezkor-qidiruv e'lon qilinganlar": form.value.rapidWantedCount,
      'Qidiruvdagi avtomashinalar': form.value.carWantedCount,
      'Probatsiya buzganlar': form.value.probationCount,
      'Issiq izdan jinoyatlar': form.value.hotTrailCount,
      "Voyaga yetmagan yo'qolganlar": form.value.minorMissingCount,
      'Yo‘qolgan buyum topilishi': form.value.itemFoundCount,
    },
  ]

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Hisobot')

  XLSX.writeFile(workbook, fileName)
}
</script>
<template>
  <div class="space-y-8">
    <h2 class="text-2xl mb-6! font-bold text-slate-700">Qalqon maʼlumotlari</h2>
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
      <div>
         <span class="text-sm text-black/60 inline-block mb-2!">Fayl</span>
         <BaseFile v-model:model-value="form.file" />
      </div>
    </el-form>

    <div class="flex justify-end gap-3 my-5!">
      <el-button type="success" size="large" @click="exportExcel"> Excel yuklash </el-button>

      <el-button type="primary" size="large" @click="submitForm"> Saqlash </el-button>
    </div>
  </div>
</template>
