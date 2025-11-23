import { createRouter, createWebHistory } from 'vue-router'

import Login from '@/pages/login.vue'
import Register from '@/pages/register.vue'

import MainLayout from '@/layout/MainLayout.vue'

// Pages
import Home from '@/pages/home.vue'
import ShieldPage from '@/pages/shield/index.vue'
import Number102 from '@/pages/number102.vue'

const routes = [
   { path: '/', redirect: '/home' },

   // Public
   { path: '/login', component: Login, name: 'Login' },
   { path: '/register', component: Register, name: 'Register' },

   // Protected Layout
   {
      path: '/',
      component: MainLayout,
      children: [
         { path: 'home', component: Home, name: 'Home' },
         { path: 'shield', component: ShieldPage, name: 'Shield' },
         { path: '102', component: Number102, name: 'Number102' },
      ],
   },
]

const router = createRouter({
   history: createWebHistory(import.meta.env.BASE_URL),
   routes,
})

// Auth Guard
router.beforeEach((to, from, next) => {
   const token = localStorage.getItem('token')

   // Agar Login/Register bo'lsa token kerak emas
   const publicPages = ['/login', '/register']

   if (!publicPages.includes(to.path) && !token) {
      return next('/login')
   }

   // Agar login sahifasiga token bilan kirmoqchi bo‘lsa -> home ga
   if (to.path === '/login' && token) {
      return next('/home')
   }

   next()
})

export default router
