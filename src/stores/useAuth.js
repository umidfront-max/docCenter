import { defineStore } from 'pinia'
import { api } from './api'
import { _token, _roles } from './auth'
import { ElMessage } from 'element-plus'

const useAuth = defineStore('auth', {
   state: () => ({}),

   actions: {
      decodeToken(token) {
         try {
            const payload = token.split(".")[1];
            const decoded = JSON.parse(
               atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
            );
            return decoded;
         } catch (e) {
            console.error("Token decode error:", e);
            return null;
         }
      },

      login(data, callback) {
         api({
            url: 'api/doc-center/v1/auths/login',
            method: 'POST',
            data
         })
            .then(({ data }) => {
               _token.value = data.token;

               // 👉 action ichidagi metodni chaqirishning to‘g‘ri usuli
               const decoded = this.decodeToken(data.token);
               _roles.value = decoded.roles
               console.log("decoded token:", decoded);

               callback();
            })
            .catch((error) => {
               ElMessage.error(error);
            })
      }
   }
})

export default useAuth
