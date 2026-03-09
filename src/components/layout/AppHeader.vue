<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

const emit = defineEmits(['toggle-sidebar'])

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/demo')
}
</script>

<template>
  <header class="sticky top-0 z-30 bg-white shadow-sm">
    <div class="flex items-center justify-between h-14 px-4">
      <!-- Left: hamburger + brand -->
      <div class="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          class="md:hidden text-slate-600"
          @click="emit('toggle-sidebar')"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </Button>
        <span class="text-lg font-bold text-slate-800 tracking-tight">
          Medi<span class="text-cyan-600">Agenda</span> MX
        </span>
      </div>

      <!-- Right: user menu -->
      <div class="flex items-center gap-4 text-sm">
        <span class="hidden sm:inline text-slate-700 font-medium">
          {{ auth.doctorName }}
        </span>

        <Separator orientation="vertical" class="hidden sm:block h-6" />

        <router-link
          to="/demo/dr/carlos-mendoza"
          class="hidden sm:inline"
        >
          <Button variant="link" class="text-cyan-600 hover:text-cyan-700 px-0">
            Ver p&aacute;gina p&uacute;blica
          </Button>
        </router-link>

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="sm" class="text-slate-500 hover:text-slate-700">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem class="sm:hidden" as-child>
              <router-link to="/demo/dr/carlos-mendoza">
                Ver p&aacute;gina p&uacute;blica
              </router-link>
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleLogout">
              Cerrar sesi&oacute;n
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>
