import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScheduleStore = defineStore('schedule', () => {
  const slotDuration = ref(30)

  const schedule = ref([
    // Sunday (0) - inactive
    { dayOfWeek: 0, startTime: '09:00', endTime: '14:00', isActive: false },

    // Monday (1) - active, two blocks
    { dayOfWeek: 1, startTime: '09:00', endTime: '14:00', isActive: true },
    { dayOfWeek: 1, startTime: '16:00', endTime: '19:00', isActive: true },

    // Tuesday (2) - active, two blocks
    { dayOfWeek: 2, startTime: '09:00', endTime: '14:00', isActive: true },
    { dayOfWeek: 2, startTime: '16:00', endTime: '19:00', isActive: true },

    // Wednesday (3) - active, two blocks
    { dayOfWeek: 3, startTime: '09:00', endTime: '14:00', isActive: true },
    { dayOfWeek: 3, startTime: '16:00', endTime: '19:00', isActive: true },

    // Thursday (4) - active, two blocks
    { dayOfWeek: 4, startTime: '09:00', endTime: '14:00', isActive: true },
    { dayOfWeek: 4, startTime: '16:00', endTime: '19:00', isActive: true },

    // Friday (5) - active, two blocks
    { dayOfWeek: 5, startTime: '09:00', endTime: '14:00', isActive: true },
    { dayOfWeek: 5, startTime: '16:00', endTime: '19:00', isActive: true },

    // Saturday (6) - inactive
    { dayOfWeek: 6, startTime: '09:00', endTime: '14:00', isActive: false },
  ])

  const blockedDates = ref([])

  function addBlockedDate(date, reason) {
    blockedDates.value.push({ date, reason })
  }

  function removeBlockedDate(date) {
    blockedDates.value = blockedDates.value.filter((b) => b.date !== date)
  }

  function getScheduleForDay(dayOfWeek) {
    return schedule.value.filter((s) => s.dayOfWeek === dayOfWeek && s.isActive)
  }

  function isDateBlocked(date) {
    return blockedDates.value.some((b) => b.date === date)
  }

  return {
    slotDuration,
    schedule,
    blockedDates,
    addBlockedDate,
    removeBlockedDate,
    getScheduleForDay,
    isDateBlocked,
  }
})
