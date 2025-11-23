<template>
  <el-dialog :visible.sync="visible" title="Murojaatni yo‘naltirish">
    <div>
      <p>Ijrochilarni tanlang:</p>
      <el-checkbox-group v-model="selected">
        <div v-for="i in ijrochilar" :key="i.id" style="display:flex;align-items:center;gap:10px;margin-bottom:6px;">
          <el-checkbox :label="i.id">{{ i.name }}</el-checkbox>
          <el-checkbox v-model="ministerIds" :label="i.id" v-if="i.is_minister">Vazir uchun</el-checkbox>
        </div>
      </el-checkbox-group>

      <el-input type="textarea" v-model="text" placeholder="Qisqacha mazmun..." style="margin-top:10px;" />
    </div>

    <template #footer>
      <el-button @click="close">Bekor</el-button>
      <el-button type="primary" @click="submit">Yuborish</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, watch } from "vue"
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  ijrochilar: { type: Array, default: () => [] }
})
const emit = defineEmits(["update:modelValue", "submit"])

const visible = ref(props.modelValue)
watch(() => props.modelValue, (v) => visible.value = v)
watch(visible, (v) => emit("update:modelValue", v))

const selected = ref([])
const ministerIds = ref([]) 
const text = ref("")

const close = () => visible.value = false

const submit = () => {
  emit("submit", { executors: selected.value, text: text.value, minister_ids: ministerIds.value })
  visible.value = false
}
</script>
