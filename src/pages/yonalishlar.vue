<template>
  <div class="p-4">
    <h2>Yo‘nalishlar</h2>
    <el-button type="primary" @click="openCreate">Yaratish</el-button>
    <el-table :data="list" style="width:100%;margin-top:12px;">
      <el-table-column prop="id" label="ID" width="60"/>
      <el-table-column prop="name" label="Nomi"/>
      <el-table-column label="Amallar" width="200">
        <template #default="scope">
          <el-button size="small" @click="openEdit(scope.row)">Tahrirlash</el-button>
          <el-button size="small" type="danger" @click="remove(scope.row.id)">O'chirish</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="dialogVisible" title="Yo‘nalish">
      <el-form>
        <el-form-item label="Nomi">
          <el-input v-model="form.name" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible=false">Bekor</el-button>
        <el-button type="primary" @click="submit">Saqlash</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "@/api"

const list = ref([])
const dialogVisible = ref(false)
const form = ref({ id: null, name: "" })

const load = async () => {
  const { data } = await api.get("/yonalishlar/") 
  list.value = data
}

const openCreate = () => {
  form.value = { id: null, name: "" }
  dialogVisible.value = true
}

const openEdit = (row) => {
  form.value = { ...row }
  dialogVisible.value = true
}

const submit = async () => {
  if (form.value.id) {
    await api.put(`/yonalishlar/${form.value.id}/`, { name: form.value.name })
  } else {
    await api.post("/yonalishlar/", { name: form.value.name })
  }
  dialogVisible.value = false
  load()
}

const remove = async (id) => {
  await api.delete(`/yonalishlar/${id}/`)
  load()
}

onMounted(load)
</script>
