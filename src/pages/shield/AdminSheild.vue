<script lang="ts" setup>
import { ref, onMounted, watch, computed } from 'vue'
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

// ===================== BACKEND LOAD =====================
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

// ===================== USERS SORT =====================
const sortedUsers = computed(() => {
  if (!Array.isArray(shieldPinia.users)) return []
  return [...shieldPinia.users].sort((a: any, b: any) => a.sortId - b.sortId)
})

// ===================== SHIELDS SORT (USER SORTID BO‘YICHA) =====================
const sortedShields = computed(() => {
  if (!Array.isArray(shieldPinia.shileds)) return []

  return [...shieldPinia.shileds].sort((a: any, b: any) => {
    const userA = shieldPinia.users?.find((u: any) => u.id === a.userId)
    const userB = shieldPinia.users?.find((u: any) => u.id === b.userId)

    const sortA = userA?.sortId ?? 9999
    const sortB = userB?.sortId ?? 9999

    return sortA - sortB
  })
})

// ===================== USER INFO =====================
const getUserInfo = (userId: string) => {
  if (!userId) return { username: '-', region: '-', startedAt: '-' }

  const user = sortedUsers.value.find((u: any) => u.id === userId)

  return {
    username: user?.username || '-',
    region: user?.region || '-',
    startedAt: user?.startedAt || '-',
  }
}

// ===================== EXCEL EXPORT =====================
const downloadExcel = () => {
  if (!sortedShields.value.length) {
    return ElMessage.warning("Ma'lumot mavjud emas")
  }

  const exportData = sortedShields.value.map((item: any) => {
    const user = getUserInfo(item.userId)

    return {
      Foydalanuvchi: user.username,
      Viloyat: user.region,
      'Boshlagan sana': user.startedAt,
      Qidiruv: item.searchCount,
      'Bedarak yo‘qolganlar': item.missingCount,
      'Maʼmuriy nazorat': item.adminCtrlCount,
      'Tezkor qidiruv': item.rapidWantedCount,
      'Qidiruvdagi avtomobillar': item.carWantedCount,
      Probatsiya: item.probationCount,
      'Issiq izdan': item.hotTrailCount,
      'Voyaga yetmaganlar': item.minorMissingCount,
      'Topilgan buyumlar': item.itemFoundCount,
    }
  })

  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Qalqon')

  XLSX.writeFile(wb, "qalqon-ma'lumotlari.xlsx")
}

// ===================== INIT =====================
onMounted(() => {
  loadShields()
})
</script>

<template>
  <div class="space-y-5">

    <!-- ================= FILTER ================= -->
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

    <!-- ================= TABLE ================= -->
    <el-table
      v-if="sortedShields.length"
      :data="sortedShields"
      border
      class="mt-10"
    >
      <!-- USER | REGION | STARTED -->
      <el-table-column width="260" label="Foydalanuvchi">
        <template #default="{ row }">
          <div class="flex flex-col leading-tight">
            <b class="text-sm text-gray-500">
              {{ getUserInfo(row.userId).region }}
            </b>
            <span class="text-xs text-gray-400">
              {{ getUserInfo(row.userId).startedAt }}
            </span>
          </div>
        </template>
      </el-table-column>

      <el-table-column width="110" prop="searchCount" label="Qidiruv" />
      <el-table-column width="120" prop="missingCount" label="Bedarak yo‘qolganlar" />
      <el-table-column width="120" prop="adminCtrlCount" label="Maʼmuriy nazorat" />
      <el-table-column width="120" prop="rapidWantedCount" label="Tezkor qidiruv" />
      <el-table-column width="120" prop="carWantedCount" label="Qidiruvdagi avtomobillar" />
      <el-table-column width="140" prop="probationCount" label="Probatsiya" />
      <el-table-column width="140" prop="hotTrailCount" label="Issiq izdan" />
      <el-table-column width="120" prop="minorMissingCount" label="Voyaga yetmaganlar" />
      <el-table-column width="120" prop="itemFoundCount" label="Topilgan buyumlar" />

      <!-- FILE DOWNLOAD -->
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
