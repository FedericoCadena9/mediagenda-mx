<script setup>
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const waLink = 'https://wa.me/5214421234567?text=Hola%2C%20me%20interesa%20MediAgenda%20MX'
</script>

<template>
  <footer class="bg-[#0A3040] py-12">
    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col items-center gap-6 md:flex-row md:justify-between">
        <div class="flex items-center gap-2">
          <div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#088BB2] text-sm font-bold text-white">M</div>
          <span class="text-lg font-bold text-white">MediAgenda MX</span>
        </div>

        <nav class="flex items-center gap-2">
          <Button as="a" href="/demo" variant="link" class="text-sm font-medium text-[#9AEBFB] hover:text-white">
            Demo en vivo
          </Button>
          <Button as="a" href="#precios" variant="link" class="text-sm font-medium text-[#9AEBFB] hover:text-white">
            Precios
          </Button>
          <Button as="a" :href="waLink" target="_blank" rel="noopener noreferrer" variant="link" class="text-sm font-medium text-[#9AEBFB] hover:text-white">
            Contacto
          </Button>
        </nav>
      </div>

      <Separator class="mt-8 mb-8 bg-[#0C4A63]" />

      <div class="flex flex-col items-center gap-2 text-center">
        <p class="text-sm text-[#5EDCF6]/60">Hecho en Queretaro</p>
        <p class="text-sm text-[#5EDCF6]/60">&copy; 2026 MediAgenda MX. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>
