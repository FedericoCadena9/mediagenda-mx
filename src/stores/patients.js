import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePatientsStore = defineStore('patients', () => {
  const patients = ref([
    { id: 'pat-1', fullName: 'María García López', phone: '4421001001', email: 'maria.garcia@email.com', notes: '', isActive: true, createdAt: '2025-06-15T10:00:00' },
    { id: 'pat-2', fullName: 'Juan Hernández Martínez', phone: '4421001002', email: 'juan.hernandez@email.com', notes: '', isActive: true, createdAt: '2025-06-20T11:00:00' },
    { id: 'pat-3', fullName: 'Ana Sofía Rodríguez Pérez', phone: '4421001003', email: 'ana.rodriguez@email.com', notes: '', isActive: true, createdAt: '2025-07-01T09:00:00' },
    { id: 'pat-4', fullName: 'Roberto López Sánchez', phone: '4421001004', email: 'roberto.lopez@email.com', notes: '', isActive: true, createdAt: '2025-07-10T14:00:00' },
    { id: 'pat-5', fullName: 'Carmen Martínez Rivera', phone: '4421001005', email: 'carmen.martinez@email.com', notes: '', isActive: true, createdAt: '2025-07-15T16:00:00' },
    { id: 'pat-6', fullName: 'José Luis Torres Flores', phone: '4421001006', email: 'joseluis.torres@email.com', notes: '', isActive: true, createdAt: '2025-08-01T10:30:00' },
    { id: 'pat-7', fullName: 'Patricia Ramírez González', phone: '4421001007', email: 'patricia.ramirez@email.com', notes: '', isActive: true, createdAt: '2025-08-05T11:00:00' },
    { id: 'pat-8', fullName: 'Miguel Ángel Flores Díaz', phone: '4421001008', email: 'miguel.flores@email.com', notes: '', isActive: true, createdAt: '2025-08-10T09:30:00' },
    { id: 'pat-9', fullName: 'Lucía Morales Vargas', phone: '4421001009', email: 'lucia.morales@email.com', notes: '', isActive: true, createdAt: '2025-08-20T13:00:00' },
    { id: 'pat-10', fullName: 'Fernando Díaz Castro', phone: '4421001010', email: 'fernando.diaz@email.com', notes: '', isActive: true, createdAt: '2025-09-01T10:00:00' },
    { id: 'pat-11', fullName: 'Gabriela Vargas Mendoza', phone: '4421001011', email: 'gabriela.vargas@email.com', notes: '', isActive: true, createdAt: '2025-09-10T14:30:00' },
    { id: 'pat-12', fullName: 'Alejandro Jiménez Ruiz', phone: '4421001012', email: 'alejandro.jimenez@email.com', notes: '', isActive: true, createdAt: '2025-09-15T16:00:00' },
    { id: 'pat-13', fullName: 'Laura Sánchez Ortega', phone: '4421001013', email: 'laura.sanchez@email.com', notes: '', isActive: true, createdAt: '2025-10-01T09:00:00' },
    { id: 'pat-14', fullName: 'Ricardo Pérez Navarro', phone: '4421001014', email: 'ricardo.perez@email.com', notes: '', isActive: true, createdAt: '2025-10-10T11:30:00' },
    { id: 'pat-15', fullName: 'Verónica Castro Luna', phone: '4421001015', email: 'veronica.castro@email.com', notes: '', isActive: true, createdAt: '2025-10-20T10:00:00' },
    { id: 'pat-16', fullName: 'Daniel Guzmán Herrera', phone: '4421001016', email: 'daniel.guzman@email.com', notes: '', isActive: true, createdAt: '2025-11-01T13:00:00' },
    { id: 'pat-17', fullName: 'Silvia Ortega Campos', phone: '4421001017', email: 'silvia.ortega@email.com', notes: '', isActive: true, createdAt: '2025-11-05T09:30:00' },
    { id: 'pat-18', fullName: 'Arturo Navarro Silva', phone: '4421001018', email: 'arturo.navarro@email.com', notes: '', isActive: true, createdAt: '2025-11-10T16:30:00' },
    { id: 'pat-19', fullName: 'Isabel Reyes Moreno', phone: '4421001019', email: 'isabel.reyes@email.com', notes: '', isActive: true, createdAt: '2025-11-20T10:00:00' },
    { id: 'pat-20', fullName: 'Enrique Herrera Aguilar', phone: '4421001020', email: 'enrique.herrera@email.com', notes: '', isActive: true, createdAt: '2025-12-01T14:00:00' },
    { id: 'pat-21', fullName: 'Rosa María Aguilar Vega', phone: '4421001021', email: 'rosa.aguilar@email.com', notes: '', isActive: true, createdAt: '2025-12-10T11:00:00' },
    { id: 'pat-22', fullName: 'Óscar Delgado Romero', phone: '4421001022', email: 'oscar.delgado@email.com', notes: '', isActive: true, createdAt: '2025-12-15T09:00:00' },
    { id: 'pat-23', fullName: 'Teresa Romero Fuentes', phone: '4421001023', email: 'teresa.romero@email.com', notes: '', isActive: true, createdAt: '2026-01-05T10:30:00' },
    { id: 'pat-24', fullName: 'Raúl Fuentes Espinoza', phone: '4421001024', email: 'raul.fuentes@email.com', notes: '', isActive: true, createdAt: '2026-01-15T13:00:00' },
    { id: 'pat-25', fullName: 'Adriana Espinoza Cruz', phone: '4421001025', email: 'adriana.espinoza@email.com', notes: '', isActive: true, createdAt: '2026-02-01T09:00:00' },
  ])

  const clinicalNotes = ref([
    // Patient 1 - María García López - Hipertensión (2 notes)
    {
      id: 'cn-1',
      patientId: 'pat-1',
      appointmentId: 'apt-hist-1',
      rawInput: 'Paciente femenina de 52 años con hipertensión arterial sistémica. Refiere cefalea ocasional y mareo. TA 150/95 mmHg. Se ajusta tratamiento antihipertensivo.',
      soapS: 'Paciente refiere cefalea frontal intermitente de 3 días de evolución, acompañada de mareo al levantarse. Niega dolor torácico, disnea o alteraciones visuales. Toma losartán 50 mg cada 24 horas.',
      soapO: 'TA 150/95 mmHg, FC 78 lpm, FR 18 rpm, Temp 36.5°C. Peso 72 kg. Exploración cardiovascular sin soplos. Fondo de ojo sin alteraciones. Sin edema de miembros inferiores.',
      soapA: 'Hipertensión arterial sistémica grado 1 con control subóptimo. Sin datos de daño a órgano blanco.',
      soapP: 'Se incrementa losartán a 100 mg cada 24 horas. Se solicita perfil metabólico completo y electrocardiograma. Dieta hiposódica. Cita de seguimiento en 4 semanas. Acudir a urgencias si presenta cefalea intensa, visión borrosa o dolor torácico.',
      aiGenerated: true,
      createdAt: '2026-01-20T10:30:00',
    },
    {
      id: 'cn-2',
      patientId: 'pat-1',
      appointmentId: 'apt-hist-2',
      rawInput: 'Seguimiento de hipertensión. Mejoría con ajuste de dosis. TA 135/85 mmHg. Resultados de laboratorio normales. Continuar tratamiento actual.',
      soapS: 'Paciente acude a control. Refiere disminución de cefalea y mareo. Niega síntomas nuevos. Ha seguido dieta hiposódica. Toma losartán 100 mg cada 24 horas sin efectos adversos.',
      soapO: 'TA 135/85 mmHg, FC 72 lpm. Peso 71 kg. Perfil metabólico: glucosa 95 mg/dL, creatinina 0.9 mg/dL, colesterol total 210 mg/dL, triglicéridos 160 mg/dL. EKG: ritmo sinusal normal.',
      soapA: 'Hipertensión arterial sistémica en mejor control con tratamiento actual. Dislipidemia mixta leve.',
      soapP: 'Continuar losartán 100 mg cada 24 horas. Iniciar atorvastatina 20 mg cada 24 horas por dislipidemia. Reforzar medidas higiénico-dietéticas. Control en 8 semanas con perfil lipídico.',
      aiGenerated: true,
      createdAt: '2026-02-17T09:30:00',
    },

    // Patient 3 - Ana Sofía Rodríguez Pérez - Diabetes tipo 2 (1 note)
    {
      id: 'cn-3',
      patientId: 'pat-3',
      appointmentId: 'apt-hist-5',
      rawInput: 'Paciente femenina de 45 años con diagnóstico reciente de diabetes tipo 2. HbA1c 7.8%. Glucosa en ayuno 145 mg/dL. Inicio de metformina y plan nutricional.',
      soapS: 'Paciente referida por hallazgo de glucosa elevada en exámenes de rutina. Refiere poliuria, polidipsia leve y fatiga de 2 meses de evolución. Pérdida de peso de 3 kg no intencional. Sin antecedentes personales de diabetes. Madre diabética tipo 2.',
      soapO: 'TA 120/80 mmHg, FC 76 lpm. Peso 68 kg, talla 1.60 m, IMC 26.6. Glucosa en ayuno 145 mg/dL, HbA1c 7.8%, creatinina 0.8 mg/dL, perfil lipídico normal. Exploración de pies: pulsos presentes, sensibilidad conservada.',
      soapA: 'Diabetes mellitus tipo 2 de diagnóstico reciente con control glucémico subóptimo. Sobrepeso grado 1.',
      soapP: 'Iniciar metformina 850 mg cada 12 horas con alimentos. Referir a nutrición para plan alimenticio. Educación sobre diabetes: automonitoreo de glucosa, signos de alarma. Solicitar fondo de ojo y microalbuminuria. Control en 4 semanas con glucosa en ayuno. Control de HbA1c en 3 meses.',
      aiGenerated: true,
      createdAt: '2026-02-10T11:00:00',
    },

    // Patient 5 - Carmen Martínez Rivera - Infección respiratoria (1 note)
    {
      id: 'cn-4',
      patientId: 'pat-5',
      appointmentId: 'apt-hist-8',
      rawInput: 'Paciente con cuadro de infección de vías respiratorias superiores de 5 días. Tos productiva, rinorrea y odinofagia. Sin fiebre actualmente. Faringe hiperémica.',
      soapS: 'Paciente femenina de 38 años, acude por cuadro de 5 días de evolución con tos productiva con expectoración amarillenta, rinorrea hialina que se tornó verdosa, odinofagia y malestar general. Niega fiebre actualmente pero refiere haber tenido temperatura de 37.8°C hace 3 días. Sin disnea.',
      soapO: 'TA 110/70 mmHg, FC 80 lpm, Temp 36.8°C, FR 18 rpm. Faringe hiperémica con descarga retronasal. Amígdalas sin exudado. Campos pulmonares con murmullo vesicular normal, sin estertores. No adenopatías cervicales.',
      soapA: 'Infección aguda de vías respiratorias superiores, evolución favorable. Sin datos de sobreinfección bacteriana.',
      soapP: 'Manejo sintomático: paracetamol 500 mg cada 8 horas por dolor, lavados nasales con solución salina, abundantes líquidos y reposo. No se indica antibiótico. Revalorar en 5 días si persisten síntomas o acudir antes si presenta fiebre mayor a 38.5°C, disnea o expectoración hemoptoica.',
      aiGenerated: true,
      createdAt: '2026-02-25T16:30:00',
    },

    // Patient 8 - Miguel Ángel Flores Díaz - Dolor lumbar (2 notes)
    {
      id: 'cn-5',
      patientId: 'pat-8',
      appointmentId: 'apt-hist-12',
      rawInput: 'Paciente masculino con dolor lumbar de 2 semanas. Inició después de cargar objetos pesados. Dolor irradiado a pierna izquierda. Sin datos de alarma. Contractura paravertebral.',
      soapS: 'Paciente masculino de 42 años, trabajador de oficina, acude por dolor lumbar bajo de 2 semanas de evolución que inició tras cargar cajas pesadas durante mudanza. Dolor irradiado a cara posterior de pierna izquierda hasta rodilla. Intensidad 7/10. Empeora al estar sentado tiempo prolongado y al agacharse. Mejora parcialmente con ibuprofeno. Sin pérdida de fuerza, sin alteraciones urinarias.',
      soapO: 'Marcha sin alteraciones. Flexión lumbar limitada a 60°, extensión dolorosa. Contractura paravertebral bilateral, predominio izquierdo. Lasègue positivo a 45° izquierdo. Fuerza muscular 5/5 en extremidades inferiores bilateral. Reflejos osteotendinosos normales. Sensibilidad conservada.',
      soapA: 'Lumbalgia mecánica con radiculopatía L5-S1 izquierda probable. Sin signos de alarma (banderas rojas).',
      soapP: 'Meloxicam 15 mg cada 24 horas por 7 días. Ciclobenzaprina 10 mg cada 12 horas por 5 días. Reposo relativo, evitar cargar peso. Iniciar ejercicios de Williams. Si no mejora en 2 semanas, solicitar resonancia magnética lumbar. Referir a rehabilitación física.',
      aiGenerated: true,
      createdAt: '2026-02-05T09:00:00',
    },
    {
      id: 'cn-6',
      patientId: 'pat-8',
      appointmentId: 'apt-hist-13',
      rawInput: 'Seguimiento dolor lumbar. Mejoría parcial con tratamiento. Persiste molestia leve. Se solicita RM lumbar y se refiere a rehabilitación.',
      soapS: 'Paciente acude a seguimiento, refiere mejoría del 60%. Dolor lumbar disminuyó a 3/10. Ya no presenta irradiación a pierna. Puede realizar actividades cotidianas con molestia leve. Completó tratamiento con meloxicam y ciclobenzaprina. Ha realizado ejercicios de Williams de forma irregular.',
      soapO: 'Flexión lumbar mejorada a 80°. Contractura paravertebral leve residual izquierda. Lasègue negativo bilateral. Sin déficit neurológico.',
      soapA: 'Lumbalgia mecánica en resolución. Radiculopatía resuelta clínicamente.',
      soapP: 'Continuar ejercicios de Williams diariamente. Se solicita resonancia magnética lumbar para descartar hernia discal. Referencia a medicina física y rehabilitación. Paracetamol 500 mg por razón necesaria. Control en 4 semanas con resultado de RM.',
      aiGenerated: true,
      createdAt: '2026-02-19T10:00:00',
    },

    // Patient 10 - Fernando Díaz Castro - Control embarazo (esposa) (1 note)
    {
      id: 'cn-7',
      patientId: 'pat-10',
      appointmentId: 'apt-hist-15',
      rawInput: 'Paciente masculino acude para orientación sobre control prenatal de su esposa. Esposa con 12 semanas de gestación. Sin complicaciones. Se orienta sobre estudios y seguimiento.',
      soapS: 'Paciente masculino de 34 años acude solicitando orientación médica general. Su esposa cursa embarazo de 12 semanas de gestación. Refiere que el embarazo ha cursado sin complicaciones. Esposa con náuseas matutinas leves que han disminuido. Sin antecedentes de abortos previos. Primer embarazo de la pareja.',
      soapO: 'Paciente en buen estado general. Se revisan estudios de laboratorio de la esposa que trae consigo: BH normal, grupo y Rh O+, glucosa 88 mg/dL, EGO sin alteraciones. Ultrasonido de las 8 semanas reporta embarazo normoevolutivo.',
      soapA: 'Consulta de orientación. Embarazo de esposa normoevolutivo de 12 SDG por ultrasonido.',
      soapP: 'Se orienta sobre importancia del control prenatal mensual con ginecólogo. Se explican signos de alarma obstétrica. Se recomienda ácido fólico y hierro para la esposa. Se sugiere ultrasonido estructural entre semanas 18-22. Se resuelven dudas sobre actividad física y alimentación durante el embarazo.',
      aiGenerated: true,
      createdAt: '2026-02-12T17:00:00',
    },
  ])

  let nextPatientId = 26
  let nextNoteId = 8

  function addPatient(data) {
    const patient = {
      id: `pat-${nextPatientId++}`,
      fullName: data.fullName,
      phone: data.phone || '',
      email: data.email || '',
      notes: data.notes || '',
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    patients.value.push(patient)
    return patient
  }

  function getPatientById(id) {
    return patients.value.find((p) => p.id === id)
  }

  function getPatientNotes(patientId) {
    return clinicalNotes.value
      .filter((n) => n.patientId === patientId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  function addClinicalNote(note) {
    const clinicalNote = {
      id: `cn-${nextNoteId++}`,
      patientId: note.patientId,
      appointmentId: note.appointmentId || null,
      rawInput: note.rawInput || '',
      soapS: note.soapS || '',
      soapO: note.soapO || '',
      soapA: note.soapA || '',
      soapP: note.soapP || '',
      aiGenerated: note.aiGenerated ?? true,
      createdAt: new Date().toISOString(),
    }
    clinicalNotes.value.push(clinicalNote)
    return clinicalNote
  }

  return {
    patients,
    clinicalNotes,
    addPatient,
    getPatientById,
    getPatientNotes,
    addClinicalNote,
  }
})
