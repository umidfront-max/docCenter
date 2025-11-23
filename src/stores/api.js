import axios from 'axios'
import { ElMessage } from 'element-plus';

import { _token } from './auth';
const instance = axios.create({
   baseURL: `http://81.200.149.108:8800`
})

export const api = ({ url, open = false, ...props }) => {

   let token = _token.value ? _token.value
      : null
   if (token) token = `Bearer ${token}`
   if (!open) {
      props.headers = {
         ...props.headers,
         Authorization:
            props.headers && props.headers.Authorization
               ? props.headers.Authorization
               : token
      }
   }
   if ('pk' in props && props.pk) {
      url = `${url}/${props.pk}`
   }
   return instance({
      url: url,
      ...props
   })
}

function createAxiosResponseInterceptor() {
   const interceptor = instance.interceptors.response.use(
      (response) => response,
      (error) => {
         if (error.response?.data?.code === 134) {
            const access_token = _token.value
            if (access_token) {
               Clear()
            }
            return Promise.reject(error)
         }
         if (error.response.status == 400) {
            ElMessage.error({
               message: "Xatolik yuz berdi",
               description: "Xato",
               duration: 3,
            });
            return Promise.reject(error)
         }
         if (error.response.status == 401) {
            ElMessage.error({
               message: "Xatolik yuz berdi",
               description: "Ruxsat yo'q",
               duration: 3,
            });
            Clear()

            return Promise.reject(error)
         }
         if (error.response.status == 403) {
            ElMessage.error({
               message: "Xatolik yuz berdi",
               description: "Taqiqlangan",
               duration: 3,
            });
            return Promise.reject(error)
         }
         if (error.response.status == 404) {
            ElMessage.error({
               message: "Xatolik yuz berdi",
               description: "Topilmadi",
               duration: 3,
            });
            return Promise.reject(error)
         }
         if (Math.floor(error.response.status / 100) == 5) {
            ElMessage.error({
               message: "Xatolik yuz berdi",
               description: "Serverda xatolik",
               duration: 3,
            });
            return Promise.reject(error)
         }
         axios.interceptors.response.eject(interceptor)
      }
   )
}


function Clear() {
   localStorage.removeItem('token')
   window.location.href = '/'
   return null
}

createAxiosResponseInterceptor()
