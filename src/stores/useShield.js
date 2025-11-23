import { defineStore } from 'pinia'
import { api } from './api'
import { ElMessage } from 'element-plus';

const useShield = defineStore('shiled', {
   state: () => ({
      shileds: []
   }),
   actions: {

      getShields(payload, callback) {
         console.log(payload);
         api({
            url: '/api/doc-center/v1/daily-reports/user',
            method: 'GET',
            params: {
               ...payload
            }
         })
            .then(({ data }) => {
               console.log(data);

               this.shileds = data?.[0]
               callback(data?.[0])
            })
            .catch((error) => {
               ElMessage.error(error)
            })
      },
      getAdminShields(payload) {
         console.log(payload);
         api({
            url: '/api/doc-center/v1/daily-reports/admin',
            method: 'GET',
            params: {
               ...payload
            }
         })
            .then(({ data }) => {
               console.log(data);
               this.shileds = data
            })
            .catch((error) => {
               ElMessage.error(error)
            })
      },
      addShields(data, callback) {
         console.log(data);
         api({
            url: '/api/doc-center/v1/daily-reports',
            method: 'POST',
            data: {
               ...data
            }
         })
            .then(({ data }) => {
               callback()
            })
            .catch((error) => {
               ElMessage.error(error)
            })
      },
   }
})
export default useShield

