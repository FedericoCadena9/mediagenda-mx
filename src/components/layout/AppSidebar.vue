<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useAuthStore } from '@/stores/auth'
import {
  LayoutGrid,
  Users,
  CalendarCheck,
  MessageSquare,
  BarChart3,
  Calendar,
  FileText,
  LogOut,
  Search,
  Stethoscope,
  Crown,
  ChevronUp,
} from 'lucide-vue-next'

const props = defineProps({
  mobileOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close'])

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const mainNavItems = [
  { icon: LayoutGrid, label: 'Dashboard', to: '/demo/dashboard', exact: true },
  { icon: Users, label: 'Pacientes', to: '/demo/dashboard/pacientes' },
  { icon: CalendarCheck, label: 'Citas', to: '/demo/dashboard/citas' },
  { icon: MessageSquare, label: 'Mensajes', to: '/demo/dashboard/mensajes', badge: '24' },
  { icon: BarChart3, label: 'Analítica', to: '/demo/dashboard/analytics' },
  { icon: Calendar, label: 'Calendario', to: '/demo/dashboard/calendario' },
  { icon: FileText, label: 'Notas Clínicas', to: '/demo/dashboard/notas' },
]

function isActive(item) {
  if (item.exact) return route.path === item.to
  return route.path.startsWith(item.to)
}

function handleLogout() {
  auth.logout()
  router.push('/')
}

const sheetOpen = computed({
  get: () => props.mobileOpen,
  set: (val) => {
    if (!val) emit('close')
  },
})

const doctorInitials = computed(() => {
  const name = auth.doctorName || ''
  const parts = name.replace(/^Dr\.\s*/, '').split(' ')
  return parts.map((p) => p.charAt(0).toUpperCase()).slice(0, 2).join('')
})
</script>

<template>
  <!-- ═══ MOBILE SIDEBAR (Sheet overlay) ═══ -->
  <Sheet v-model:open="sheetOpen">
    <SheetContent side="left" class="w-[280px] p-0 border-none md:hidden bg-white">
      <SheetTitle class="sr-only">Menú de navegación</SheetTitle>

      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="flex items-center gap-3 px-5 pt-7 pb-5">
          <div class="w-10 h-10 rounded-xl bg-medical-950 flex items-center justify-center shadow-[0_2px_8px_rgba(10,48,64,0.2)]">
            <Stethoscope class="w-5 h-5 text-medical-300" />
          </div>
          <div>
            <span class="text-[17px] font-bold text-foreground tracking-tight">Consultia</span>
            <span class="text-[17px] font-bold text-medical-600 tracking-tight">MX</span>
          </div>
        </div>

        <!-- Search -->
        <div class="px-4 pb-5">
          <div class="flex items-center gap-2.5 px-3.5 py-2.5 bg-muted/60 border border-border rounded-xl cursor-pointer hover:border-muted-foreground/20 transition-colors">
            <Search class="w-3.5 h-3.5 text-muted-foreground/60" />
            <span class="text-[13px] text-muted-foreground/60 flex-1">Buscar</span>
            <div class="flex items-center gap-0.5">
              <kbd class="text-[10px] text-muted-foreground/50 bg-white border border-border rounded px-1.5 py-0.5 font-mono shadow-[0_1px_0_rgba(0,0,0,0.04)]">&#x2318;</kbd>
              <kbd class="text-[10px] text-muted-foreground/50 bg-white border border-border rounded px-1.5 py-0.5 font-mono shadow-[0_1px_0_rgba(0,0,0,0.04)]">K</kbd>
            </div>
          </div>
        </div>

        <!-- Main Nav -->
        <nav class="flex-1 overflow-y-auto px-3">
          <p class="text-[10px] font-semibold text-muted-foreground/60 tracking-[0.12em] uppercase mb-2 px-2.5">
            Menú Principal
          </p>
          <div class="space-y-0.5">
            <router-link
              v-for="item in mainNavItems"
              :key="item.to"
              :to="item.to"
              @click="emit('close')"
            >
              <div
                class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium cursor-pointer transition-all duration-200 relative"
                :class="isActive(item)
                  ? 'bg-medical-50 text-medical-700 shadow-[0_1px_2px_rgba(8,139,178,0.06)]'
                  : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'"
              >
                <!-- Active indicator bar -->
                <div
                  v-if="isActive(item)"
                  class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-medical-600 rounded-full"
                />
                <component
                  :is="item.icon"
                  class="w-[18px] h-[18px] flex-shrink-0 transition-colors"
                  :class="isActive(item) ? 'text-medical-600' : ''"
                />
                <span class="flex-1">{{ item.label }}</span>
                <span
                  v-if="item.badge"
                  class="text-[10px] font-bold bg-medical-600 text-white rounded-full px-2 py-0.5 min-w-[24px] text-center shadow-[0_1px_3px_rgba(8,139,178,0.3)]"
                >
                  {{ item.badge }}
                </span>
              </div>
            </router-link>
          </div>
        </nav>

        <!-- Upgrade banner -->
        <div class="px-4 pt-3 pb-3">
          <div class="rounded-2xl bg-gradient-to-br from-medical-50 to-medical-100/50 border border-medical-200/60 p-4">
            <p class="text-[12.5px] text-medical-800 font-medium leading-snug mb-3">
              Actualiza a Plan Pro para más usuarios y funciones.
            </p>
            <button class="w-full py-2.5 bg-medical-950 hover:bg-medical-900 text-white text-[12.5px] font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(10,48,64,0.2)] hover:shadow-[0_4px_12px_rgba(10,48,64,0.25)]">
              <Crown class="w-3.5 h-3.5" />
              Ver planes
            </button>
          </div>
        </div>

        <div class="mx-4 h-px bg-border"></div>

        <!-- User with popover -->
        <Popover>
          <PopoverTrigger as-child>
            <button class="flex items-center gap-3 px-5 py-4 w-full text-left hover:bg-muted/50 transition-colors">
              <div class="w-9 h-9 rounded-full bg-gradient-to-br from-medical-400 to-medical-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-medical-100 shadow-[0_2px_6px_rgba(8,139,178,0.2)]">
                {{ doctorInitials }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-[12.5px] font-semibold text-foreground truncate">{{ auth.doctorName }}</p>
                <p class="text-[10.5px] text-muted-foreground">Administrador</p>
              </div>
              <ChevronUp class="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="top" align="start" class="w-56 p-1.5">
            <button
              class="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors"
              @click="handleLogout"
            >
              <LogOut class="w-4 h-4" />
              Cerrar sesión
            </button>
          </PopoverContent>
        </Popover>
      </div>
    </SheetContent>
  </Sheet>

  <!-- ═══ DESKTOP / TABLET SIDEBAR (always expanded) ═══ -->
  <aside class="hidden md:flex h-full w-[268px] bg-white border-r border-border flex-col flex-shrink-0">
    <!-- Logo -->
    <div class="flex items-center gap-3 px-5 pt-7 pb-5">
      <div class="w-10 h-10 rounded-xl bg-medical-950 flex items-center justify-center flex-shrink-0 shadow-[0_2px_8px_rgba(10,48,64,0.2)]">
        <Stethoscope class="w-5 h-5 text-medical-300" />
      </div>
      <div>
        <span class="text-[17px] font-bold text-foreground tracking-tight">Consultia</span>
        <span class="text-[17px] font-bold text-medical-600 tracking-tight">MX</span>
      </div>
    </div>

    <!-- Search -->
    <div class="px-4 pb-5">
      <div class="flex items-center gap-2.5 px-3.5 py-2.5 bg-muted/60 border border-border rounded-xl cursor-pointer hover:border-muted-foreground/20 transition-colors">
        <Search class="w-3.5 h-3.5 text-muted-foreground/60" />
        <span class="text-[13px] text-muted-foreground/60 flex-1">Buscar</span>
        <div class="flex items-center gap-0.5">
          <kbd class="text-[10px] text-muted-foreground/50 bg-white border border-border rounded px-1.5 py-0.5 font-mono shadow-[0_1px_0_rgba(0,0,0,0.04)]">&#x2318;</kbd>
          <kbd class="text-[10px] text-muted-foreground/50 bg-white border border-border rounded px-1.5 py-0.5 font-mono shadow-[0_1px_0_rgba(0,0,0,0.04)]">K</kbd>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto px-3">
      <p class="text-[10px] font-semibold text-muted-foreground/60 tracking-[0.12em] uppercase mb-2 px-2.5">
        Menú Principal
      </p>
      <div class="space-y-0.5">
        <router-link
          v-for="item in mainNavItems"
          :key="item.to"
          :to="item.to"
        >
          <div
            class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium cursor-pointer transition-all duration-200 relative"
            :class="isActive(item)
              ? 'bg-medical-50 text-medical-700 shadow-[0_1px_2px_rgba(8,139,178,0.06)]'
              : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'"
          >
            <!-- Active indicator bar -->
            <div
              v-if="isActive(item)"
              class="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-medical-600 rounded-full"
            />
            <component
              :is="item.icon"
              class="w-[18px] h-[18px] flex-shrink-0 transition-colors"
              :class="isActive(item) ? 'text-medical-600' : ''"
            />
            <span class="flex-1">{{ item.label }}</span>
            <span
              v-if="item.badge"
              class="text-[10px] font-bold bg-medical-600 text-white rounded-full px-2 py-0.5 min-w-[24px] text-center shadow-[0_1px_3px_rgba(8,139,178,0.3)]"
            >
              {{ item.badge }}
            </span>
          </div>
        </router-link>
      </div>
    </nav>

    <!-- Upgrade banner -->
    <div class="px-4 pt-2 pb-3">
      <div class="rounded-2xl bg-gradient-to-br from-medical-50 to-medical-100/50 border border-medical-200/60 p-4">
        <p class="text-[12.5px] text-medical-800 font-medium leading-snug mb-3">
          Actualiza a Plan Pro para más usuarios y funciones.
        </p>
        <button class="w-full py-2.5 bg-medical-950 hover:bg-medical-900 text-white text-[12.5px] font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-[0_2px_8px_rgba(10,48,64,0.2)] hover:shadow-[0_4px_12px_rgba(10,48,64,0.25)]">
          <Crown class="w-3.5 h-3.5" />
          Ver planes
        </button>
      </div>
    </div>

    <!-- Separator -->
    <div class="mx-4 h-px bg-border"></div>

    <!-- User profile with popover -->
    <Popover>
      <PopoverTrigger as-child>
        <button class="flex items-center gap-3 px-5 py-4 w-full text-left hover:bg-muted/50 transition-colors">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-medical-400 to-medical-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ring-2 ring-medical-100 shadow-[0_2px_6px_rgba(8,139,178,0.2)]">
            {{ doctorInitials }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-[12.5px] font-semibold text-foreground truncate">{{ auth.doctorName }}</p>
            <p class="text-[10.5px] text-muted-foreground">Administrador</p>
          </div>
          <ChevronUp class="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" class="w-56 p-1.5">
        <button
          class="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg text-[13px] font-medium text-red-600 hover:bg-red-50 transition-colors"
          @click="handleLogout"
        >
          <LogOut class="w-4 h-4" />
          Cerrar sesión
        </button>
      </PopoverContent>
    </Popover>
  </aside>
</template>
