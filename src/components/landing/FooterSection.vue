<script setup>
import { RouterLink } from 'vue-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const waLink = 'https://wa.me/5214421234567?text=Hola%2C%20me%20interesa%20MediAgenda%20MX'
</script>

<template>
  <footer class="border-t border-slate-200 bg-white py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <!-- Wordmark -->
        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 text-sm font-bold text-white">M</div>
          <span class="text-lg font-bold text-slate-900">MediAgenda MX</span>
        </div>

        <!-- Links -->
        <nav class="flex items-center gap-2">
          <Button as="a" href="/demo" variant="link" class="text-sm font-medium text-slate-500 hover:text-cyan-600">
            Demo en vivo
          </Button>
          <Button as="a" href="#precios" variant="link" class="text-sm font-medium text-slate-500 hover:text-cyan-600">
            Precios
          </Button>
          <Button as="a" :href="waLink" target="_blank" rel="noopener noreferrer" variant="link" class="text-sm font-medium text-slate-500 hover:text-cyan-600">
            Contacto
          </Button>
        </nav>
      </div>

      <Separator class="mt-8 mb-8" />

      <div class="flex flex-col items-center gap-2 text-center">
        <p class="text-sm text-slate-400">Hecho en Querétaro 🇲🇽</p>
        <p class="text-sm text-slate-400">&copy; 2026 MediAgenda MX. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>
