<script setup>
import { ref, reactive, onMounted } from "vue"
import { ElMessage, ElMessageBox } from "element-plus"
import api from "@/api"

const appeals = ref([])
const loading = ref(false)

const filters = reactive({
  status: "",
  is_anonymous: "",
  person__is_staff: "",
})

const total = ref(0)
const page = ref(1)
const limit = ref(10)

const fetchAppeals = async () => {
  loading.value = true
  try {
    const res = await api.get("/appeals/", {
      params: {
        page: page.value,
        limit: limit.value,
        status: filters.status,
        is_anonymous: filters.is_anonymous,
        person__is_staff: filters.person__is_staff,
      },
    })
    appeals.value = res.data.results
    total.value = res.data.count
  } catch (err) {
    ElMessage.error("Murojaatlar yuklanmadi")
  } finally {
    loading.value = false
  }
}

// O‘chirish
const deleteAppeal = (id) => {
  ElMessageBox.confirm("Ushbu murojaatni o‘chirmoqchimisiz?", "Tasdiqlash", {
    type: "warning",
  })
    .then(async () => {
      await api.delete(`/appeals/${id}/`)
      ElMessage.success("Murojaat o‘chirildi")
      fetchAppeals()
    })
    .catch(() => {})
}

// PDF / Word yuklash
const downloadFile = async (id, format) => {
  try {
    const res = await api.get(`/appeals/${id}/export/?format=${format}`)
    window.open(res.data.file_url, "_blank")
  } catch (err) {
    ElMessage.error("Fayl yuklanmadi")
  }
}

// Yonaltirish
const redirectDialog = ref(false)
const redirectForm = reactive({
  executors: [],
  minister: false,
  text: "",
})
const selectedAppeal = ref(null)

const openRedirect = (appeal) => {
  selectedAppeal.value = appeal
  redirectDialog.value = true
}

const submitRedirect = async () => {
  try {
    await api.post(`/appeals/${selectedAppeal.value.id}/redirect/`, redirectForm)
    ElMessage.success("Murojaat yo‘naltirildi")
    redirectDialog.value = false
  } catch (err) {
    ElMessage.error("Xatolik yuz berdi")
  }
}

onMounted(() => {
  fetchAppeals()
})
</script>

<template>
  <div class="appeals">
    <h1>Murojaatlar</h1>

    <!-- Filtrlar -->
    <div class="filters">
      <!-- Status -->
      <el-select v-model="filters.status" placeholder="Holati" clearable>
        <el-option label="Yangi" value="new_created" />
        <el-option label="Jarayonda" value="pending" />
        <el-option label="Tugallangan" value="finished" />
      </el-select>

      <!-- Anonim -->
      <el-select v-model="filters.is_anonymous" placeholder="Turi" clearable>
        <el-option label="Anonim" value="true" />
        <el-option label="Ochiq" value="false" />
      </el-select>

      <!-- Ijrochi -->
      <el-select v-model="filters.person__is_staff" placeholder="Ijrochi" clearable>
        <el-option label="Ijrochi" value="true" />
        <el-option label="Oddiy foydalanuvchi" value="false" />
      </el-select>

      <el-button type="primary" @click="fetchAppeals">Filtrlash</el-button>
    </div>

    <!-- Jadval -->
    <el-table v-loading="loading" :data="appeals" border style="width: 100%; margin-top: 20px;">
      <el-table-column prop="id" label="ID" width="60" />
      <el-table-column prop="date" label="Sana" width="120" />
      <el-table-column prop="type" label="Turi" width="100" />
      <el-table-column prop="nickname" label="Foydalanuvchi" />
      <el-table-column prop="username" label="Login" />
      <el-table-column prop="yonalish" label="Yo‘nalish" />
      <el-table-column prop="xizmat" label="Xizmat" />
      <el-table-column prop="hudud" label="Hudud" />
      <el-table-column prop="status" label="Holati" width="120" />
      <el-table-column label="Amallar" width="300">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="downloadFile(row.id, 'pdf')">PDF</el-button>
          <el-button type="primary" size="small" @click="downloadFile(row.id, 'word')">Word</el-button>
          <el-button type="success" size="small" @click="openRedirect(row)">Yonaltirish</el-button>
          <el-button type="danger" size="small" @click="deleteAppeal(row.id)">O‘chirish</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Pagination -->
    <div class="pagination">
      <el-pagination
        background
        layout="prev, pager, next, jumper"
        :total="total"
        :page-size="limit"
        v-model:current-page="page"
        @current-change="fetchAppeals"
      />
    </div>

    <!-- Yonaltirish Modal -->
    <el-dialog v-model="redirectDialog" title="Murojaatni yo‘naltirish" width="500px">
      <el-form :model="redirectForm" label-position="top">
        <el-checkbox-group v-model="redirectForm.executors">
          <el-checkbox label="Ijrochi 1" />
          <el-checkbox label="Ijrochi 2" />
          <el-checkbox label="Ijrochi 3" />
        </el-checkbox-group>

        <el-checkbox v-model="redirectForm.minister">Vazirga yuborish</el-checkbox>

        <el-input
          type="textarea"
          rows="4"
          placeholder="Murojaat mazmuni"
          v-model="redirectForm.text"
        />
      </el-form>
      <template #footer>
        <el-button @click="redirectDialog = false">Bekor qilish</el-button>
        <el-button type="primary" @click="submitRedirect">Yuborish</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<style lang="scss" scoped>
.appeals {
  padding: 20px;

  h1 {
    margin-bottom: 20px;
    color: #191970;
    font-family: "Commissioner", sans-serif;
  }

  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 20px;
  }

  .pagination {
    margin-top: 20px;
    text-align: center;
  }
}
</style>
