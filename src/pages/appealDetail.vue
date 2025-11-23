<template>
  <div class="p-4">
    <el-card v-if="appeal">
      <h3>#{{ appeal.id }} — {{ appeal.username || appeal.nickname }}</h3>
      <p><strong>Sana:</strong> {{ appeal.date }}</p>
      <p><strong>Turi:</strong> {{ appeal.type }}</p>
      <p><strong>Yo‘nalish:</strong> {{ appeal.yonalish }}</p>
      <p><strong>Xizmat:</strong> {{ appeal.xizmat }}</p>
      <p><strong>Hudud:</strong> {{ appeal.hudud }}</p>
      <p><strong>Matn:</strong> {{ appeal.text }}</p>
      <div v-if="appeal.files && appeal.files.length">
        <h4>Fayllar</h4>
        <ul>
          <li v-for="f in appeal.files" :key="f.id">
            <a :href="f.url" target="_blank">{{ f.name }}</a>
          </li>
        </ul>
      </div>
      <el-button type="primary" @click="exportPdf">PDF</el-button>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "@/api"
import { useRoute } from "vue-router"
const route = useRoute()
const appeal = ref(null)

const load = async () => {
  const { data } = await api.get(`/appeals/${route.params.id}/`)
  appeal.value = data
}

const exportPdf = async () => {
  const { data } = await api.get(`/appeals/${route.params.id}/export/`, { params: { format: "pdf" } })
  window.open(data.file_url, "_blank")
}

onMounted(load)
</script>
