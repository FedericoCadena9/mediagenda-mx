<script setup>
import { useWhatsApp } from '@/composables/useWhatsApp'

const { onboardingLink: waLink } = useWhatsApp()
</script>

<template>
  <section class="bg-[#F8FAFB] py-20 md:py-28 overflow-hidden">
    <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
      <div class="text-center">
        <p class="mb-3 text-xs font-semibold tracking-[0.2em] uppercase text-[#088BB2]">Cómo funciona</p>
        <h2 class="text-3xl font-bold text-[#0A3040] sm:text-4xl">
          En 3 pasos estás en línea
        </h2>
        <p class="mx-auto mt-4 max-w-xl text-base text-[#64748b]">
          Tú no tocas código. Nosotros lo hacemos todo.
        </p>
      </div>

      <div class="mt-16 space-y-0">
        <!-- Step 1 -->
        <div class="relative grid items-center gap-8 md:grid-cols-2 md:gap-16">
          <!-- Left: Visual -->
          <div class="relative flex justify-center md:justify-end">
            <div class="relative w-full max-w-sm">
              <!-- Phone mockup with WhatsApp conversation -->
              <div class="rounded-3xl border border-[#e2e8f0] bg-white p-3 shadow-lg">
                <!-- Phone status bar -->
                <div class="mb-2 flex items-center justify-between px-2">
                  <span class="text-[9px] text-[#94a3b8]">9:41</span>
                  <div class="flex gap-1">
                    <div class="h-1.5 w-3 rounded-sm bg-[#94a3b8]/40"></div>
                    <div class="h-1.5 w-1.5 rounded-full bg-[#94a3b8]/40"></div>
                  </div>
                </div>
                <!-- WhatsApp header -->
                <div class="flex items-center gap-2 rounded-t-xl bg-[#075E54] px-3 py-2.5">
                  <svg class="h-4 w-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                  <div class="h-7 w-7 rounded-full bg-[#25D366] flex items-center justify-center text-[9px] font-bold text-white">MA</div>
                  <div>
                    <div class="text-[10px] font-semibold text-white">Consultia</div>
                    <div class="text-[8px] text-white/60">en línea</div>
                  </div>
                </div>
                <!-- Chat bubbles -->
                <div class="space-y-2 bg-[#ECE5DD] p-3 rounded-b-xl min-h-[140px]">
                  <div class="ml-auto max-w-[75%] rounded-xl rounded-tr-sm bg-[#DCF8C6] px-3 py-2">
                    <p class="text-[10px] text-[#0A3040]">Hola, soy el Dr. García. Me interesa tener mi página de citas</p>
                    <div class="mt-0.5 text-right text-[8px] text-[#94a3b8]">9:30 AM ✓✓</div>
                  </div>
                  <div class="mr-auto max-w-[75%] rounded-xl rounded-tl-sm bg-white px-3 py-2">
                    <p class="text-[10px] text-[#0A3040]">¡Hola Dr. García! Con gusto. Solo necesitamos su nombre, servicios, horarios y dirección del consultorio</p>
                    <div class="mt-0.5 text-right text-[8px] text-[#94a3b8]">9:31 AM</div>
                  </div>
                </div>
              </div>
              <!-- Step number -->
              <div class="absolute -left-3 -top-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#088BB2] text-lg font-extrabold text-white shadow-lg shadow-[#088BB2]/30">1</div>
            </div>
          </div>
          <!-- Right: Text -->
          <div class="text-center md:text-left">
            <h3 class="text-3xl font-extrabold text-[#0A3040] lg:text-4xl">Nos contactas por WhatsApp</h3>
            <p class="mt-4 text-lg text-[#64748b] leading-relaxed max-w-md">
              Cuéntanos sobre tu consultorio: nombre, servicios, horarios y cómo quieres tu página. Respondemos en menos de 1 hora.
            </p>
            <a
              :href="waLink"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-8 inline-flex items-center gap-2.5 rounded-xl bg-[#25D366] px-5 py-2.5 text-base font-semibold text-white transition-all duration-200 hover:bg-[#1da851] hover:shadow-lg hover:shadow-[#25D366]/20"
            >
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
              Iniciar conversación
            </a>
          </div>
        </div>

        <!-- Connector -->
        <div class="flex justify-center py-6">
          <div class="h-16 w-px border-l-2 border-dashed border-[#088BB2]/20"></div>
        </div>

        <!-- Step 2 -->
        <div class="relative grid items-center gap-8 md:grid-cols-2 md:gap-16">
          <!-- Left: Text (reversed on md) -->
          <div class="order-2 text-center md:order-1 md:text-right">
            <h3 class="text-3xl font-extrabold text-[#0A3040] lg:text-4xl">Configuramos tu página</h3>
            <p class="mt-4 text-lg text-[#64748b] leading-relaxed max-w-md md:ml-auto">
              Nosotros nos encargamos de todo. En 48–72 horas tienes tu plataforma lista, personalizada con tu información y funcionando.
            </p>
            <div class="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#EAFBFE] px-5 py-2.5 text-base font-semibold text-[#088BB2]">
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Listo en 48–72 horas
            </div>
          </div>
          <!-- Right: Visual -->
          <div class="relative order-1 flex justify-center md:order-2 md:justify-start">
            <div class="relative w-full max-w-sm">
              <!-- Config mockup -->
              <div class="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-lg">
                <div class="mb-4 flex items-center gap-2">
                  <div class="h-6 w-6 rounded-md bg-[#7C3AED]"></div>
                  <span class="text-xs font-bold text-[#0A3040]">Configuración</span>
                  <span class="ml-auto rounded-full bg-[#dcfce7] px-2 py-0.5 text-[9px] font-medium text-[#16a34a]">En proceso</span>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center gap-3">
                    <div class="flex h-5 w-5 items-center justify-center rounded-full bg-[#16a34a]">
                      <svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <span class="text-xs text-[#0A3040]">Datos del doctor</span>
                    <span class="ml-auto text-[9px] text-[#16a34a]">Listo</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="flex h-5 w-5 items-center justify-center rounded-full bg-[#16a34a]">
                      <svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <span class="text-xs text-[#0A3040]">Servicios y precios</span>
                    <span class="ml-auto text-[9px] text-[#16a34a]">Listo</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="flex h-5 w-5 items-center justify-center rounded-full bg-[#16a34a]">
                      <svg class="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke-width="3" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <span class="text-xs text-[#0A3040]">Horarios y disponibilidad</span>
                    <span class="ml-auto text-[9px] text-[#16a34a]">Listo</span>
                  </div>
                  <div class="flex items-center gap-3">
                    <div class="relative h-5 w-5">
                      <div class="absolute inset-0 rounded-full border-2 border-[#088BB2]/30"></div>
                      <div class="absolute inset-0 rounded-full border-2 border-[#088BB2] border-t-transparent animate-spin"></div>
                    </div>
                    <span class="text-xs text-[#0A3040]">Personalización y diseño</span>
                    <span class="ml-auto text-[9px] text-[#088BB2]">75%</span>
                  </div>
                  <div class="flex items-center gap-3 opacity-40">
                    <div class="h-5 w-5 rounded-full border-2 border-[#e2e8f0]"></div>
                    <span class="text-xs text-[#0A3040]">Despliegue final</span>
                    <span class="ml-auto text-[9px] text-[#94a3b8]">Pendiente</span>
                  </div>
                </div>
                <!-- Progress bar -->
                <div class="mt-5 h-2 rounded-full bg-[#e2e8f0]">
                  <div class="h-2 rounded-full bg-gradient-to-r from-[#088BB2] to-[#7C3AED]" style="width: 75%"></div>
                </div>
              </div>
              <div class="absolute -right-3 -top-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#7C3AED] text-lg font-extrabold text-white shadow-lg shadow-[#7C3AED]/30">2</div>
            </div>
          </div>
        </div>

        <!-- Connector -->
        <div class="flex justify-center py-6">
          <div class="h-16 w-px border-l-2 border-dashed border-[#088BB2]/20"></div>
        </div>

        <!-- Step 3 -->
        <div class="relative grid items-center gap-8 md:grid-cols-2 md:gap-16">
          <!-- Left: Visual -->
          <div class="relative flex justify-center md:justify-end">
            <div class="relative w-full max-w-md">
              <!-- WhatsApp automation flow mockup -->
              <div class="rounded-3xl border border-[#e2e8f0] bg-white p-6 sm:p-8 shadow-xl">
                <div class="mb-5 flex items-center gap-2">
                  <div class="h-2 w-2 rounded-full bg-[#25D366] animate-pulse"></div>
                  <p class="text-xs font-bold uppercase tracking-widest text-[#0A3040]/40">Flujo automático</p>
                </div>

                <div class="space-y-4">
                  <!-- Patient message -->
                  <div class="flex items-start gap-3">
                    <div class="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366] shadow-md shadow-[#25D366]/20">
                      <svg class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/></svg>
                    </div>
                    <div class="flex-1 rounded-2xl rounded-tl-md bg-[#ECE5DD] px-4 py-3 shadow-sm">
                      <p class="text-sm text-[#0A3040] leading-relaxed">"Hola Dr., quiero agendar una consulta general para el martes en la mañana"</p>
                      <div class="mt-1 flex items-center justify-between">
                        <span class="text-xs text-[#94a3b8]">María García</span>
                        <span class="text-[10px] text-[#94a3b8]">9:30 AM ✓✓</span>
                      </div>
                    </div>
                  </div>

                  <!-- Arrow with pulse line -->
                  <div class="flex items-center gap-3 pl-5">
                    <div class="flex flex-col items-center">
                      <div class="h-6 w-px bg-gradient-to-b from-[#25D366] to-[#088BB2]"></div>
                      <svg class="h-5 w-5 text-[#088BB2]" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
                    </div>
                    <span class="text-xs text-[#94a3b8] italic">procesando en tiempo real...</span>
                  </div>

                  <!-- n8n processing -->
                  <div class="flex items-center gap-3 rounded-2xl border-2 border-[#088BB2]/15 bg-gradient-to-r from-[#EAFBFE] to-[#EAFBFE]/50 px-4 py-4 shadow-sm">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#088BB2] shadow-md shadow-[#088BB2]/20">
                      <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
                    </div>
                    <div class="flex-1">
                      <div class="text-sm font-bold text-[#088BB2]">Automatización procesa el mensaje</div>
                      <div class="mt-0.5 text-xs text-[#088BB2]/60">Identifica paciente, servicio, fecha y hora</div>
                    </div>
                    <div class="shrink-0 rounded-lg bg-[#088BB2]/10 px-2.5 py-1">
                      <span class="text-[10px] font-bold text-[#088BB2]">2s</span>
                    </div>
                  </div>

                  <!-- Arrow -->
                  <div class="flex items-center gap-3 pl-5">
                    <div class="flex flex-col items-center">
                      <div class="h-6 w-px bg-gradient-to-b from-[#088BB2] to-[#16a34a]"></div>
                      <svg class="h-5 w-5 text-[#16a34a]" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" /></svg>
                    </div>
                  </div>

                  <!-- Result -->
                  <div class="flex items-center gap-3 rounded-2xl bg-[#dcfce7] px-4 py-4 shadow-sm">
                    <div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#16a34a] shadow-md shadow-[#16a34a]/20">
                      <svg class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    </div>
                    <div class="flex-1">
                      <div class="text-sm font-bold text-[#16a34a]">Cita guardada en tu agenda</div>
                      <div class="mt-1 flex flex-wrap gap-1.5">
                        <span class="rounded-full bg-[#16a34a]/10 px-2 py-0.5 text-[10px] font-medium text-[#16a34a]">Mar 10 Mar</span>
                        <span class="rounded-full bg-[#16a34a]/10 px-2 py-0.5 text-[10px] font-medium text-[#16a34a]">10:00 AM</span>
                        <span class="rounded-full bg-[#16a34a]/10 px-2 py-0.5 text-[10px] font-medium text-[#16a34a]">Consulta General</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="absolute -left-4 -top-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#16a34a] text-xl font-extrabold text-white shadow-xl shadow-[#16a34a]/30">3</div>
            </div>
          </div>
          <!-- Right: Text -->
          <div class="text-center md:text-left">
            <h3 class="text-3xl font-extrabold text-[#0A3040] lg:text-4xl">Tus pacientes agendan por WhatsApp</h3>
            <p class="mt-4 text-lg text-[#64748b] leading-relaxed max-w-md">
              Tus pacientes te escriben por WhatsApp como siempre, pero ahora el sistema captura cada cita automáticamente y la guarda en tu agenda. Sin cambiar hábitos.
            </p>
            <div class="mt-8 inline-flex items-center gap-2.5 rounded-full bg-[#dcfce7] px-5 py-2.5 text-base font-semibold text-[#16a34a]">
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>
              WhatsApp + automatización, sin complicaciones
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
