<script setup>
import { ref } from 'vue'
import AppSidebar from './AppSidebar.vue'
import AppHeader from './AppHeader.vue'

const sidebarCollapsed = ref(true)
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <!-- Demo banner -->
    <div class="bg-violet-600 text-white text-center py-2 text-sm">
      &#x1F50D; Est&aacute;s viendo una demo interactiva &mdash;
      <router-link to="/" class="underline font-medium hover:text-violet-100">
        Ver precios
      </router-link>
    </div>

    <div class="flex">
      <AppSidebar
        :collapsed="sidebarCollapsed"
        @close="sidebarCollapsed = true"
      />

      <div class="flex-1 flex flex-col min-h-screen">
        <AppHeader @toggle-sidebar="sidebarCollapsed = !sidebarCollapsed" />

        <main class="flex-1 p-4 md:p-6 overflow-auto">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>
