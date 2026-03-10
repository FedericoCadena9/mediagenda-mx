<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Eye, EyeOff, Stethoscope, Shield, Clock, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('demo@consultia.mx')
const password = ref('demo1234')
const showPassword = ref(false)
const rememberMe = ref(true)
const mounted = ref(false)

onMounted(() => {
  setTimeout(() => { mounted.value = true }, 50)
})

function handleLogin() {
  authStore.login()
  router.push('/demo/dashboard')
}
</script>

<template>
  <div class="min-h-screen flex bg-white">
    <!-- Left Panel - Branding -->
    <div
      class="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-10 xl:p-14"
      :class="mounted ? 'opacity-100' : 'opacity-0'"
      style="transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1); background: linear-gradient(165deg, #0A3040 0%, #076F90 45%, #088BB2 75%, #0CADD4 100%)"
    >
      <!-- Decorative grid pattern -->
      <div class="absolute inset-0 opacity-[0.04]" style="background-image: url('data:image/svg+xml,%3Csvg width=&quot;60&quot; height=&quot;60&quot; viewBox=&quot;0 0 60 60&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot;%3E%3Cg fill=&quot;none&quot; fill-rule=&quot;evenodd&quot;%3E%3Cg fill=&quot;%23ffffff&quot; fill-opacity=&quot;1&quot;%3E%3Cpath d=&quot;M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z&quot;/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"></div>

      <!-- Floating decorative shapes -->
      <div class="absolute top-20 right-16 w-72 h-72 rounded-full opacity-10" style="background: radial-gradient(circle, #5EDCF6 0%, transparent 70%)"></div>
      <div class="absolute bottom-32 left-8 w-56 h-56 rounded-full opacity-8" style="background: radial-gradient(circle, #2BC8ED 0%, transparent 70%)"></div>
      <div class="absolute top-1/2 right-8 w-40 h-40 rounded-full opacity-[0.06]" style="background: radial-gradient(circle, #ffffff 0%, transparent 70%)"></div>

      <!-- Top: Logo -->
      <div
        class="relative z-10"
        :class="mounted ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'"
        style="transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.2s"
      >
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/10">
            <Stethoscope class="w-5 h-5 text-medical-200" />
          </div>
          <div>
            <span class="text-xl font-bold text-white tracking-tight">Consultia</span>
            <span class="text-xl font-bold text-medical-300 tracking-tight">MX</span>
          </div>
        </div>
      </div>

      <!-- Center: Main headline -->
      <div
        class="relative z-10 -mt-8"
        :class="mounted ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'"
        style="transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s"
      >
        <h2 class="text-3xl xl:text-4xl font-extrabold text-white leading-tight tracking-tight max-w-lg">
          Optimiza la gestión de tu consultorio médico
        </h2>
        <p class="mt-5 text-medical-200/80 text-base xl:text-lg leading-relaxed max-w-md">
          Centraliza citas, expedientes y comunicación con pacientes en una sola plataforma inteligente.
        </p>

        <!-- Feature pills -->
        <div class="flex flex-wrap gap-3 mt-8">
          <div class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.07] backdrop-blur-sm border border-white/[0.08] text-sm text-medical-100">
            <Clock class="w-4 h-4 text-medical-300" />
            <span>Agenda inteligente</span>
          </div>
          <div class="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.07] backdrop-blur-sm border border-white/[0.08] text-sm text-medical-100">
            <Shield class="w-4 h-4 text-medical-300" />
            <span>Datos protegidos</span>
          </div>
        </div>
      </div>

      <!-- Bottom spacer -->
      <div class="relative z-10"></div>
    </div>

    <!-- Right Panel - Login Form -->
    <div class="flex-1 flex flex-col min-h-screen">
      <!-- Mobile logo bar -->
      <div class="lg:hidden flex items-center gap-2.5 p-6 pb-0">
        <div class="w-9 h-9 rounded-lg bg-medical-600 flex items-center justify-center">
          <Stethoscope class="w-4 h-4 text-white" />
        </div>
        <div>
          <span class="text-lg font-bold text-foreground tracking-tight">Consultia</span>
          <span class="text-lg font-bold text-medical-600 tracking-tight">MX</span>
        </div>
      </div>

      <!-- Form container -->
      <div class="flex-1 flex items-center justify-center px-6 sm:px-10 lg:px-16 xl:px-24">
        <div
          class="w-full max-w-[420px]"
          :class="mounted ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'"
          style="transition: all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.3s"
        >
          <!-- Header -->
          <div class="mb-8">
            <div class="hidden lg:flex items-center justify-center w-14 h-14 rounded-2xl bg-medical-950 mb-7">
              <Stethoscope class="w-6 h-6 text-medical-300" />
            </div>
            <h1 class="text-[1.75rem] font-extrabold text-foreground tracking-tight">
              Iniciar sesión
            </h1>
            <p class="mt-2 text-muted-foreground text-[0.95rem]">
              Ingresa a tu cuenta de Consultia para continuar
            </p>
          </div>

          <!-- Demo badge -->
          <div class="mb-6 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-medical-50 border border-medical-200/60">
            <div class="w-2 h-2 rounded-full bg-medical-500 animate-pulse shrink-0"></div>
            <p class="text-sm text-medical-700">
              Demo interactiva — los datos son ficticios
            </p>
          </div>

          <!-- Form -->
          <form @submit.prevent="handleLogin" class="space-y-5">
            <!-- Email -->
            <div class="space-y-2">
              <label for="email" class="block text-sm font-semibold text-foreground">
                Correo electrónico
              </label>
              <div class="relative">
                <Input
                  id="email"
                  v-model="email"
                  type="email"
                  class="h-12 px-4 text-[0.95rem] rounded-xl border-border bg-muted/60 focus:bg-white focus:border-medical-400 focus:ring-medical-400/20 transition-all duration-200"
                  placeholder="tu@correo.com"
                />
              </div>
            </div>

            <!-- Password -->
            <div class="space-y-2">
              <label for="password" class="block text-sm font-semibold text-foreground">
                Contraseña
              </label>
              <div class="relative">
                <Input
                  id="password"
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  class="h-12 px-4 pr-12 text-[0.95rem] rounded-xl border-border bg-muted/60 focus:bg-white focus:border-medical-400 focus:ring-medical-400/20 transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  class="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/70 hover:text-muted-foreground transition-colors p-1"
                  @click="showPassword = !showPassword"
                >
                  <EyeOff v-if="showPassword" class="w-[18px] h-[18px]" />
                  <Eye v-else class="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>

            <!-- Remember me + Forgot -->
            <div class="flex items-center justify-between">
              <label class="flex items-center gap-2.5 cursor-pointer group">
                <div class="relative">
                  <input
                    type="checkbox"
                    v-model="rememberMe"
                    class="peer sr-only"
                  />
                  <div class="w-[18px] h-[18px] rounded-md border-2 border-muted-foreground/40 peer-checked:border-medical-600 peer-checked:bg-medical-600 transition-all duration-150 flex items-center justify-center">
                    <svg v-if="rememberMe" class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <span class="text-sm text-muted-foreground group-hover:text-foreground transition-colors select-none">Recordarme</span>
              </label>
              <a href="#" class="text-sm font-semibold text-medical-600 hover:text-medical-700 transition-colors">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <!-- Submit -->
            <Button
              type="submit"
              class="w-full h-12 bg-medical-950 hover:bg-medical-900 text-white font-semibold text-[0.95rem] rounded-xl transition-all duration-200 shadow-lg shadow-medical-950/20 hover:shadow-xl hover:shadow-medical-950/25 active:scale-[0.98]"
            >
              Iniciar sesión
            </Button>
          </form>

          <!-- Divider -->
          <div class="flex items-center gap-4 my-6">
            <div class="flex-1 h-px bg-border"></div>
            <span class="text-sm text-muted-foreground/70 font-medium">o</span>
            <div class="flex-1 h-px bg-border"></div>
          </div>

          <!-- Google login -->
          <button
            type="button"
            class="w-full h-12 flex items-center justify-center gap-3 rounded-xl border border-border bg-white hover:bg-muted/60 text-[0.95rem] font-semibold text-foreground transition-all duration-200 hover:border-border active:scale-[0.98]"
          >
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continuar con Google
          </button>

          <!-- Register link -->
          <p class="mt-7 text-center text-sm text-muted-foreground">
            ¿No tienes cuenta?
            <a href="#" class="font-semibold text-medical-600 hover:text-medical-700 transition-colors ml-1">
              Regístrate aquí
            </a>
          </p>

          <!-- Extra links -->
          <div class="mt-4 flex justify-center">
            <router-link
              to="/"
              class="text-xs text-muted-foreground/70 hover:text-muted-foreground font-medium transition-colors inline-flex items-center gap-1"
            >
              <ArrowLeft class="w-3 h-3" />
              Volver al sitio
            </router-link>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>
