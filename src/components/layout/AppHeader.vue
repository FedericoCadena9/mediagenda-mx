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
import {
  Menu,
  Bell,
  ChevronDown,
  ExternalLink,
  LogOut,
} from 'lucide-vue-next'

const emit = defineEmits(['toggle-sidebar'])

const auth = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/demo')
}
</script>

<template>
  <header class="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-border shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
    <div class="flex items-center justify-between h-[52px] sm:h-[60px] px-3 sm:px-6">
      <!-- Left: hamburger -->
      <div class="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          class="md:hidden text-foreground hover:bg-muted"
          @click="emit('toggle-sidebar')"
        >
          <Menu class="w-5 h-5" />
        </Button>

        <!-- Mobile brand -->
        <div class="md:hidden flex items-center gap-2">
          <span class="text-base font-bold tracking-tight text-foreground">Consultia</span>
          <span class="text-base font-bold tracking-tight text-medical-600">MX</span>
        </div>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-2">
        <!-- Notification bell -->
        <Button variant="ghost" size="icon" class="relative text-muted-foreground hover:text-foreground hover:bg-muted">
          <Bell class="w-[18px] h-[18px]" />
          <span class="absolute top-2 right-2 w-2 h-2 bg-medical-500 rounded-full ring-2 ring-white"></span>
        </Button>

        <!-- Public page link -->
        <router-link
          to="/demo/dr/carlos-mendoza"
          class="hidden sm:block"
        >
          <Button variant="ghost" size="sm" class="gap-1.5 text-muted-foreground hover:text-foreground text-xs font-medium">
            <ExternalLink class="w-3.5 h-3.5" />
            Página pública
          </Button>
        </router-link>

        <!-- Separator -->
        <div class="hidden sm:block w-px h-6 bg-border mx-1"></div>

        <!-- User dropdown -->
        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <button class="flex items-center gap-2.5 pl-2 pr-1.5 py-1.5 rounded-xl hover:bg-muted transition-colors">
              <div class="w-8 h-8 rounded-full bg-gradient-to-br from-medical-400 to-medical-700 flex items-center justify-center text-white text-[11px] font-bold ring-2 ring-medical-100 shadow-[0_2px_6px_rgba(8,139,178,0.2)]">
                {{ auth.doctorName?.replace(/^Dr\.\s*/, '').split(' ').map(p => p.charAt(0)).slice(0, 2).join('') }}
              </div>
              <span class="hidden sm:block text-sm font-medium text-foreground max-w-[140px] truncate">
                {{ auth.doctorName }}
              </span>
              <ChevronDown class="w-3.5 h-3.5 text-muted-foreground hidden sm:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" class="w-48">
            <DropdownMenuItem class="sm:hidden" as-child>
              <router-link to="/demo/dr/carlos-mendoza" class="flex items-center gap-2">
                <ExternalLink class="w-3.5 h-3.5" />
                Página pública
              </router-link>
            </DropdownMenuItem>
            <DropdownMenuItem @click="handleLogout" class="flex items-center gap-2 text-red-600">
              <LogOut class="w-3.5 h-3.5" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>
