import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const isLoggedIn = ref(false)
  const doctorName = ref('Dr. Carlos Mendoza')
  const clinicCity = ref('Querétaro')
  const clinicAddress = ref('Av. Universidad 150, Querétaro. Tel: 442 123 4567')

  function login() {
    isLoggedIn.value = true
  }

  function logout() {
    isLoggedIn.value = false
  }

  return {
    isLoggedIn,
    doctorName,
    clinicCity,
    clinicAddress,
    login,
    logout,
  }
})
