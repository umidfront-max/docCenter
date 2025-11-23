<template>
  <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
    <el-card>
      <h4>Yo‘nalishlar</h4><p>{{ stats.yonalishlar || 0 }}</p>
    </el-card>
    <el-card>
      <h4>Xizmatlar</h4><p>{{ stats.xizmatlar || 0 }}</p>
    </el-card>
    <el-card>
      <h4>Hududlar</h4><p>{{ stats.hududlar || 0 }}</p>
    </el-card>
    <el-card>
      <h4>Murojaatlar</h4><p>{{ stats.murojaatlar || 0 }}</p>
    </el-card>
  </div>
</template>

<script setup>
defineProps({ stats: Object })
</script>
