<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('demo@mediagenda.mx')
const password = ref('demo1234')

function handleLogin() {
  authStore.login()
  router.push('/demo/dashboard')
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-slate-50 px-4">
    <div class="w-full max-w-md">
      <Card class="shadow-lg">
        <CardHeader class="text-center">
          <div class="mb-2">
            <h1 class="text-3xl">
              <span class="font-bold text-slate-800">MediAgenda</span>
              <span class="font-bold text-cyan-500">MX</span>
            </h1>
          </div>
          <CardTitle class="text-xl font-semibold text-slate-700">
            Demo Interactiva
          </CardTitle>
          <CardDescription>
            Esta es una demo interactiva. Los datos son ficticios.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form @submit.prevent="handleLogin" class="space-y-4">
            <div class="space-y-2">
              <Label for="email">Correo electr&oacute;nico</Label>
              <Input
                id="email"
                v-model="email"
                type="email"
              />
            </div>

            <div class="space-y-2">
              <Label for="password">Contrase&ntilde;a</Label>
              <Input
                id="password"
                v-model="password"
                type="password"
              />
            </div>

            <Button type="submit" class="w-full bg-cyan-600 hover:bg-cyan-700">
              Entrar al demo
            </Button>
          </form>
        </CardContent>

        <Separator />

        <CardFooter class="flex flex-col space-y-3 pt-6">
          <router-link
            to="/demo/dr/carlos-mendoza"
            class="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
          >
            Ver p&aacute;gina p&uacute;blica del doctor &rarr;
          </router-link>
          <router-link
            to="/"
            class="text-sm text-slate-500 hover:text-slate-700"
          >
            &larr; Volver al sitio
          </router-link>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>
