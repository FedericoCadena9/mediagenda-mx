const phone = import.meta.env.VITE_WHATSAPP_NUMBER || '5214421234567'

export function useWhatsApp() {
  function waLink(message) {
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
  }

  return {
    phone,
    waLink,
    // Pre-built links per context
    heroLink: waLink('Hola, me interesa Consultia para mi consultorio'),
    ctaLink: waLink('Hola, quiero saber más sobre Consultia MX'),
    footerLink: waLink('Hola, tengo una pregunta sobre Consultia'),
    onboardingLink: waLink('Hola, quiero activar mi página de Consultia MX'),
    planBasicoLink: waLink('Hola, me interesa el plan Básico de Consultia'),
    planProLink: waLink('Hola, me interesa el plan Pro de Consultia con IA'),
    floatingLink: waLink('Hola, estoy viendo Consultia y me gustaría más información'),
  }
}
