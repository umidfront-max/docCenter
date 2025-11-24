<template>
  <div class="w-full">
    <div
      class="border-2 bg-white border-dashed border-gray-300 rounded-lg p-2! text-center cursor-pointer transition hover:border-blue-500"
      :class="{ 'border-blue-500! bg-blue-50': isDragging }"
      @dragover.prevent="onDragOver"
      @dragleave.prevent="onDragLeave"
      @drop.prevent="onFileDrop"
      @click="chooseFile"
    >
      <div v-if="!modelValue" class="text-gray-500">
        <p class="font-medium text-sm">Faylni bu yerga tashlang yoki tanlang</p>
        <p class="text-xs mt-1">PDF, JPG, PNG (max 10MB)</p>
      </div>

      <!-- If file selected -->
      <div v-else class="flex flex-col items-center gap-2">
        <div class="text-blue-600 font-medium text-sm">📄 {{ modelValue.name || modelValue }}</div>

        <div class="flex gap-3 mt-0.5">
          <!-- Delete Button -->
          <button
            class="bg-red-500 cursor-pointer text-white text-xs py-1! px-3! rounded hover:bg-red-600"
            @click.stop="removeFile"
          >
            O‘chirish
          </button>
          <button
            type="button"
            @click.stop="faylPinia.downloadFile(modelValue.name || modelValue)"
            class="bg-green-500 cursor-pointer text-white text-xs py-1! px-3! rounded hover:bg-green-600"
          >
            Faylni ko'rish
          </button>
        </div>
      </div>

      <!-- Hidden input -->
      <input
        ref="fileInput"
        type="file"
        class="hidden"
        accept=".pdf,.jpg,.jpeg,.png"
        @change="onFileChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import useFile from '@/stores/useFile'
const faylPinia = useFile()
const props = defineProps({
  modelValue: {
    type: File,
    default: null,
  },
})
const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const isDragging = ref(false)

// File tanlash
function chooseFile() {
  fileInput.value.click()
}

// File inputdan kelganda
function onFileChange(e) {
  const file = e.target.files[0]
  if (file) emit('update:modelValue', file)
}

// Drag events
function onDragOver() {
  isDragging.value = true
}
function onDragLeave() {
  isDragging.value = false
}
function onFileDrop(e) {
  isDragging.value = false

  const file = e.dataTransfer.files[0]
  if (file) emit('update:modelValue', file)
}

// O‘chirish
function removeFile() {
  emit('update:modelValue', null)
}
</script>
