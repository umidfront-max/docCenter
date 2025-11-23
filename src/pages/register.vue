<script setup>
import { reactive, ref } from "vue"
import { ElMessage } from "element-plus"
// import api from "@/api"
const formRef = ref(null)

const form = reactive({
  first_name: "",
  last_name: "",
  middle_name: "",
  phone_number: "",
  username: "",
  password: "",
  password2: "",
  avatar: null,
  role: "",
})

const rules = {
  first_name: [
    { required: true, message: "Ism kiritish majburiy", trigger: "blur" },
  ],
  last_name: [
    { required: true, message: "Familiya kiritish majburiy", trigger: "blur" },
  ],
  username: [
    { required: true, message: "Login kiritish majburiy", trigger: "blur" },
  ],
  password: [
    { required: true, message: "Parol kiritish majburiy", trigger: "blur" },
  ],
  password2: [
    { required: true, message: "Parolni tasdiqlash majburiy", trigger: "blur" },
    {
      validator: (rule, value, callback) => {
        if (value !== form.password) {
          callback(new Error("Parollar mos emas"))
        } else {
          callback()
        }
      },
      trigger: "blur",
    },
  ],
}

const loading = ref(false)

const onSubmit = () => {
  formRef.value.validate(async (valid) => {
    if (valid) {
      loading.value = true

      try {
 
        const formData = new FormData()
        Object.keys(form).forEach((key) => {
          if (form[key] !== null && form[key] !== "") {
            formData.append(key, form[key])
          }
        })

      //   const response = await api.post(
      //     "/user/register/", 
      //     formData,
      //     {
      //       headers: {
      //         "Content-Type": "multipart/form-data",
      //       },
      //     }
      //   )

      //   ElMessage.success("Ro‘yxatdan muvaffaqiyatli o‘tdingiz!")
      //   console.log("API response:", response.data)
      } catch (error) {
        console.error(error)
        if (error.response && error.response.data) {
          ElMessage.error(
            error.response.data.detail || "Xatolik yuz berdi!"
          )
        } else {
          ElMessage.error("Serverga ulanib bo‘lmadi")
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
          <h1>Ro‘yxatdan o‘tish</h1>

          <el-form
            ref="formRef"
            :model="form"
            :rules="rules"
            label-position="top"
            class="w-full"
          >
            <el-form-item label="Ism" prop="first_name">
              <el-input v-model="form.first_name" size="large" clearable />
            </el-form-item>

            <el-form-item label="Familiya" prop="last_name">
              <el-input v-model="form.last_name" size="large" clearable />
            </el-form-item>

            <el-form-item label="Otasining ismi" prop="middle_name">
              <el-input v-model="form.middle_name" size="large" clearable />
            </el-form-item>

            <el-form-item label="Telefon raqam" prop="phone_number">
              <el-input v-model="form.phone_number" size="large" clearable />
            </el-form-item>

            <el-form-item label="Login" prop="username">
              <el-input v-model="form.username" size="large" clearable />
            </el-form-item>

            <el-form-item label="Parol" prop="password">
              <el-input
                v-model="form.password"
                type="password"
                show-password
                size="large"
              />
            </el-form-item>

            <el-form-item label="Parolni tasdiqlash" prop="password2">
              <el-input
                v-model="form.password2"
                type="password"
                show-password
                size="large"
              />
            </el-form-item>

            <el-form-item label="Avatar">
              <el-upload
                action="#"
                :auto-upload="false"
                :on-change="(file) => (form.avatar = file.raw)"
              >
                <el-button>Fayl tanlash</el-button>
              </el-upload>
            </el-form-item>

            <el-form-item label="Rol" prop="role">
              <el-select v-model="form.role" placeholder="Rolni tanlang">
                <el-option label="Super Admin" value="super_admin" />
                <el-option label="Admin" value="admin" />
                <el-option label="Staff" value="staff" />
              </el-select>
            </el-form-item>

            <!-- Tugma -->
            <el-button
              type="primary"
              class="login__btn"
              :loading="loading"
              @click="onSubmit"
            >
              <i class="ri-user-add-line mr-2"></i> Ro‘yxatdan o‘tish
            </el-button>

            <div class="register text-center mt-2">
              <router-link to="/login">Kirish sahifasi</router-link>
            </div>
          </el-form>
        </section>
      </div>
    </div>

    <!-- O‘ng tomon -->
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
      font-family: "Inter", sans-serif;
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
      font-family: "Commissioner", sans-serif;
    }
  }

  &__btn {
    width: 100%;
    height: 48px;
    margin-top: 16px;
    border-radius: 10px;
    font-weight: 600;
    font-family: "Inter", sans-serif;
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
