import { defineStore } from 'pinia'
import { api } from './api'
import { ElMessage } from 'element-plus';

const useFile = defineStore('files', {
   state: () => ({
      filess: []
   }),
   actions: {
      addFile(file) {
         const formData = new FormData();
         formData.append('file', file);

         return new Promise((resolve, reject) => {
            api({
               url: '/api/doc-center/v1/files/upload',
               method: 'POST',
               data: formData,
               headers: { 'Content-Type': 'multipart/form-data' }
            })
               .then(res => resolve(res.data))  // <– Muhim!
               .catch(err => reject(err))
         })
      },
      downloadFile(fileName) {
         api({
            url: '/api/doc-center/v1/files/download',
            method: 'GET',
            params: { file: fileName },
            responseType: 'blob'
         })
            .then(response => {
               const blob = new Blob([response.data], {
                  type: response.data.type || "application/octet-stream"
               })

               const link = document.createElement("a")
               link.href = URL.createObjectURL(blob)
               link.download = fileName
               link.click()

               URL.revokeObjectURL(link.href)
            })
            .catch(() => {
               ElMessage.error("Faylni yuklab bo‘lmadi :(")
            })
      }
   }
})
export default useFile

