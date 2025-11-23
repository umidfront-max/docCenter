<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import dayjs from 'dayjs'
import useShield from '@/stores/useShield'
import * as XLSX from 'xlsx'
import { ElMessage } from 'element-plus'

const shieldPinia = useShield()

const today = dayjs().format('YYYY-MM-DD')

// Bitta date range-picker
const _data = ref({
  range: [today, today],
})

// Backenddan malumot olish
const loadShields = async () => {
  await shieldPinia.getAdminShields({
    start: _data.value.range[0],
    end: _data.value.range[1],
  })
}

// Sana o‘zgarganda avtomatik reload
watch(
  () => _data.value.range,
  () => {
    loadShields()
  },
)

// Excel eksport
const downloadExcel = () => {
  if (!shieldPinia.shileds?.length) {
    return ElMessage.warning("Ma'lumot mavjud emas")
  }

  // Jadvaldan faqat kerak ustunlarni chiqaramiz
  const exportData = shieldPinia.shileds.map((item: any) => ({
    'Foydalanuvchi ID': item.userId,
    Qidiruv: item.searchCount,
    'Bedarak yo‘qolganlar': item.missingCount,
    'Maʼmuriy nazorat': item.adminCtrlCount,
    'Tezkor qidiruv': item.rapidWantedCount,
    'Qidiruvdagi avtomobillar': item.carWantedCount,
    Probatsiya: item.probationCount,
    'Issiq izdan': item.hotTrailCount,
    'Voyaga yetmaganlar': item.minorMissingCount,
    'Topilgan buyumlar': item.itemFoundCount,
  }))

  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(wb, ws, 'Qalqon')

  XLSX.writeFile(wb, "qalqon-ma'lumotlari.xlsx")
}

onMounted(() => {
  loadShields()
})
</script>

<template>
  <div class="space-y-5">
    <!-- Sana tanlash -->
    <el-form class="flex justify-between items-end" label-position="top">
      <el-form-item class="w-80!" label="Filter">
        <el-date-picker
          v-model="_data.range"
          type="daterange"
          value-format="YYYY-MM-DD"
          format="DD.MM.YYYY"
          range-separator="→"
          start-placeholder="Boshlanish"
          end-placeholder="Tugash"
          unlink-panels
        />
      </el-form-item>
      <el-form-item>
        <el-button type="success"  @click="downloadExcel">
          Excelga yuklab olish
        </el-button>
      </el-form-item>
    </el-form>

    <!-- Jadval -->
    <el-table v-if="shieldPinia.shileds?.length" :data="shieldPinia.shileds" border class="mt-10">
      <el-table-column prop="userId" label="userId" />
      <el-table-column prop="searchCount" label="Qidiruv" />
      <el-table-column prop="missingCount" label="Bedarak yo‘qolganlar" />
      <el-table-column prop="adminCtrlCount" label="Maʼmuriy nazorat" />
      <el-table-column prop="rapidWantedCount" label="Tezkor qidiruv" />
      <el-table-column prop="carWantedCount" label="Qidiruvdagi avtomobillar" />
      <el-table-column prop="probationCount" label="Probatsiya" />
      <el-table-column prop="hotTrailCount" label="Issiq izdan" />
      <el-table-column prop="minorMissingCount" label="Voyaga yetmaganlar" />
      <el-table-column prop="itemFoundCount" label="Topilgan buyumlar" />
    </el-table>
  </div>
</template>
