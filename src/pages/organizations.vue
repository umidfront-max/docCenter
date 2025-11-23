<template>
  <div class="p-4">
    <h2 class="text-lg font-bold mb-4">Hududlar</h2>
    
    <!-- Yaratish tugmasi -->
    <el-button type="primary" @click="openCreate">➕ Yangi hudud</el-button>

    <!-- Jadval -->
    <el-table :data="list" style="width:100%;margin-top:12px;" v-loading="loading">
      <el-table-column prop="id" label="ID" width="60"/>
      <el-table-column prop="name" label="Hudud nomi"/>
      <el-table-column label="Amallar" width="220">
        <template #default="scope">
          <el-button size="small" @click="openDetail(scope.row.id)">Ko‘rish</el-button>
          <el-button size="small" @click="openEdit(scope.row)">Tahrirlash</el-button>
          <el-button size="small" type="danger" @click="remove(scope.row.id)">O‘chirish</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Create/Update dialog -->
    <el-dialog v-model="dialogVisible" title="Hudud" width="400px">
      <el-form>
        <el-form-item label="Hudud nomi">
          <el-input v-model="form.name" placeholder="Hudud nomi kiriting"/>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">Bekor qilish</el-button>
        <el-button type="primary" @click="submit">Saqlash</el-button>
      </template>
    </el-dialog>

    <!-- Detail dialog -->
    <el-dialog v-model="detailVisible" title="Hudud haqida" width="400px">
      <p><b>ID:</b> {{ detail?.id }}</p>
      <p><b>Nomi:</b> {{ detail?.name }}</p>
      <template #footer>
        <el-button @click="detailVisible=false">Yopish</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "@/api" // axios instance

const list = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const detailVisible = ref(false)

const form = ref({ id: null, name: "" })
const detail = ref(null)

// LIST
const load = async () => {
  loading.value = true
  try {
    const { data } = await api.get("/organizations/")
    list.value = data
  } finally {
    loading.value = false
  }
}

// CREATE
const openCreate = () => {
  form.value = { id: null, name: "" }
  dialogVisible.value = true
}

// DETAIL
const openDetail = async (id) => {
  const { data } = await api.get(`/organizations/${id}/`)
  detail.value = data
  detailVisible.value = true
}

// UPDATE
const openEdit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

// CREATE or UPDATE
const submit = async () => {
  if (form.value.id) {
    await api.put(`/organizations/${form.value.id}/`, { name: form.value.name })
  } else {
    await api.post("/organizations/", { name: form.value.name })
  }
  dialogVisible.value = false
  load()
}

// DELETE
const remove = async (id) => {
  await api.delete(`/organizations/${id}/`)
  load()
}

onMounted(load)
</script>
