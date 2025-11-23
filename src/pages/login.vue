<script setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import useAuth from '@/stores/useAuth'
import router from '@/router'
const authPinia = useAuth()
const formRef = ref(null)

const form = reactive({
  username: '',
  password: '',
})

const rules = {
  username: [{ required: true, message: 'Login kiritish majburiy', trigger: 'blur' }],
  password: [{ required: true, message: 'Parol kiritish majburiy', trigger: 'blur' }],
}

const loading = ref(false)

const onSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true
      try {
        // FormData yaratish (chunki avatar file bo‘lishi mumkin)
        authPinia.login(form, () => {
          ElMessage.success('Ro‘yxatdan muvaffaqiyatli o‘tdingiz!')
          router.push('/home')
        })
      } catch (error) {
        console.error(error)
        if (error.response && error.response.data) {
          ElMessage.error(error.response.data.detail || 'Xatolik yuz berdi!')
        } else {
          ElMessage.error('Serverga ulanib bo‘lmadi')
        }
      } finally {
        loading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="login">
    <div class="login__left">
      <div class="login__content">
        <section class="login__form">
          <h1>Tizimga kirish</h1>

          <el-form ref="formRef" :model="form" :rules="rules" label-position="top" class="w-full">
            <el-form-item label="Login" prop="username">
              <el-input
                v-model="form.username"
                placeholder="Loginni kiriting"
                size="large"
                clearable
              />
            </el-form-item>

            <el-form-item label="Parol" prop="password">
              <el-input
                v-model="form.password"
                placeholder="Parolni kiriting"
                show-password
                size="large"
              />
            </el-form-item>

            <el-button type="primary" class="login__btn" :loading="loading" @click="onSubmit">
              <i class="ri-login-circle-line mr-2"></i> Kirish
            </el-button>
            <div class="register text-center mt-2">
              <router-link to="/register">Ro‘yxatdan o‘tish</router-link>
            </div>
          </el-form>
        </section>
      </div>
    </div>

    <div style="width: 100%" class="login__right">
      <img style="width: 100%" src="/src/assets/img/logo-bg.svg" alt="Logo" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 100vh;

  &__left {
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  &__content {
    width: 100%;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 0 auto 100px auto;
    padding: 0 48px;
    margin-top: -120px;

    img {
      height: 40px;
    }

    p {
      font-weight: 600;
      font-size: 24px;
      color: #191970;
      font-family: 'Inter', sans-serif;
    }
  }

  &__form {
    width: 50%;
    margin: 0 auto;

    h1 {
      font-weight: 700;
      margin-bottom: 32px;
      text-align: center;
      font-size: 32px;
      color: #191970;
      font-family: 'Commissioner', sans-serif;
    }
  }

  &__btn {
    width: 100%;
    height: 48px;
    margin-top: 16px;
    border-radius: 10px;
    font-weight: 600;
    font-family: 'Inter', sans-serif;
    background-color: #191970;
  }

  &__right {
    background: #191970;

    img {
      height: 100%;
      padding: 0 80px;
      object-fit: contain;
    }
  }
  .register {
    margin: 0px auto;
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
}
</style>
