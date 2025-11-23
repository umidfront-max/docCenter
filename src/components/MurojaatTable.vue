<template>
  <el-table :data="data" style="width:100%">
    <el-table-column prop="id" label="ID" width="70" />
    <el-table-column prop="date" label="Sana" width="140" />
    <el-table-column prop="type" label="Turi" width="100" />
    <el-table-column prop="username" label="Foydalanuvchi" />
    <el-table-column prop="yonalish" label="Yo‘nalish" />
    <el-table-column prop="xizmat" label="Xizmat" />
    <el-table-column prop="hudud" label="Hudud" />
    <el-table-column label="Amallar" width="320">
      <template #default="scope">
        <el-button size="small" @click="$emit('view', scope.row.id)">Ko'rish</el-button>
        <el-button size="small" @click="$emit('download', scope.row.id, 'pdf')">PDF</el-button>
        <el-button size="small" @click="$emit('download', scope.row.id, 'word')">Word</el-button>
        <el-button size="small" type="success" @click="$emit('yonaltirish', scope.row.id)">Yo‘naltirish</el-button>
        <el-button size="small" type="danger" @click="$emit('delete', scope.row.id)">O‘chirish</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
defineProps({ data: Array })
</script>
