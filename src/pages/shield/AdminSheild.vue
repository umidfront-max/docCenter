<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import dayjs from 'dayjs'
import useShield from '@/stores/useShield'
import * as XLSX from 'xlsx'
import { ElMessage } from 'element-plus'
import useFile from '@/stores/useFile'

const shieldPinia = useShield()
const faylPinia = useFile()

const today = dayjs().format('YYYY-MM-DD')

// Date Range State
const _data = ref({
  range: [today, today],
})

// Backend ma'lumotlarini yuklash
const loadShields = async () => {
  const [start, end] = _data.value.range

  if (!start || !end) return

  try {
    await shieldPinia.getUsers()
    await shieldPinia.getAdminShields({ start, end })
  } catch (err) {
    console.error(err)
    ElMessage.error('Maʼlumotlarni yuklashda xatolik')
  }
}

// Sana o‘zgarsa avtomatik reload
watch(
  () => _data.value.range,
  (val) => {
    if (val && val[0] && val[1]) {
      loadShields()
    }
  },
  { deep: true }
)

// Excel eksport
const downloadExcel = () => {
  if (!shieldPinia.shileds?.length) {
    return ElMessage.warning("Ma'lumot mavjud emas")
  }

  const exportData = shieldPinia.shileds.map((item: any) => ({
    Foydalanuvchi: getUsername(item.userId),
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

// Username olish
const getUsername = (userId: string) => {
  if (!userId) return '-'
  const user = shieldPinia.users?.find((u) => u.id === userId)
  return user?.username || '-'
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
        <el-button type="success" @click="downloadExcel">
          Excelga yuklab olish
        </el-button>
      </el-form-item>
    </el-form>

    <!-- Jadval -->
    <el-table
      v-if="shieldPinia.shileds?.length"
      :data="shieldPinia.shileds"
      border
      class="mt-10"
    >
      <el-table-column
        width="140"
        label="Foydalanuvchi"
        :formatter="(row) => getUsername(row.userId)"
      />
      <el-table-column width="110" prop="searchCount" label="Qidiruv" />
      <el-table-column width="120" prop="missingCount" label="Bedarak yo‘qolganlar" />
      <el-table-column width="120" prop="adminCtrlCount" label="Maʼmuriy nazorat" />
      <el-table-column width="120" prop="rapidWantedCount" label="Tezkor qidiruv" />
      <el-table-column width="120" prop="carWantedCount" label="Qidiruvdagi avtomobillar" />
      <el-table-column width="140" prop="probationCount" label="Probatsiya" />
      <el-table-column width="140" prop="hotTrailCount" label="Issiq izdan" />
      <el-table-column width="120" prop="minorMissingCount" label="Voyaga yetmaganlar" />
      <el-table-column width="120" prop="itemFoundCount" label="Topilgan buyumlar" />

      <el-table-column width="160" label="Faylni yuklash">
        <template #default="{ row }">
          <span
            class="text-blue-600 cursor-pointer"
            v-if="Array.isArray(row.files) && row.files.length > 0 && row.files[0]"
            @click="faylPinia.downloadFile(row.files[0])"
          >
            {{ row.files[0].slice(-20) }}
          </span>
          <span v-else>-</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
