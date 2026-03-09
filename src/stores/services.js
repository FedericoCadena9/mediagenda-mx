import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useServicesStore = defineStore('services', () => {
  const services = ref([
    {
      id: 'srv-1',
      name: 'Consulta General',
      description: 'Consulta médica general para diagnóstico y tratamiento de padecimientos comunes.',
      durationMinutes: 30,
      priceMxn: 400,
      isActive: true,
      sortOrder: 1,
    },
    {
      id: 'srv-2',
      name: 'Revisión de Seguimiento',
      description: 'Revisión de seguimiento para pacientes en tratamiento activo.',
      durationMinutes: 30,
      priceMxn: 250,
      isActive: true,
      sortOrder: 2,
    },
    {
      id: 'srv-3',
      name: 'Consulta de Urgencia',
      description: 'Consulta de urgencia para atención inmediata de síntomas agudos.',
      durationMinutes: 30,
      priceMxn: 700,
      isActive: true,
      sortOrder: 3,
    },
  ])

  function getServiceById(id) {
    return services.value.find((s) => s.id === id)
  }

  return {
    services,
    getServiceById,
  }
})
