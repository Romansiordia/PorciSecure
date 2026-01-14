
import { Module } from './types';

export const AUDIT_MODULES: Module[] = [
  {
    "id": "mod_5",
    "title": "Módulo 1: Bioseguridad (Core)",
    "questions": [
      { "id": "m5_q0", "text": "¿Se registró a toda persona que ingresó a la granja hoy?" },
      { "id": "m5_q1", "text": "¿Cumplieron los visitantes con el periodo de vacío sanitario?" },
      { "id": "m5_q2", "text": "¿Se realizó el cambio de ropa y calzado antes de ingresar?" },
      { "id": "m5_q3", "text": "¿Se ducharon las personas que ingresaron (si aplica)?" },
      { "id": "m5_q4", "text": "¿Se usaron correctamente los elementos de protección personal (EPP)?" },
      { "id": "m5_q5", "text": "¿Se restringió el acceso a las zonas sensibles (maternidad, cuarentena)?" },
      { "id": "m5_q6", "text": "¿Se desinfectaron los vehículos al ingreso y salida?" },
      { "id": "m5_q7", "text": "¿Se usaron pediluvios o arcos sanitarios?" },
      { "id": "m5_q8", "text": "¿Se respetó la ruta establecida dentro de la granja?" },
      { "id": "m5_q9", "text": "¿Se registró todo ingreso de alimentos, equipos o insumos?" },
      { "id": "m5_q10", "text": "¿Los vehículos transportaban exclusivamente animales propios?" },
      { "id": "m5_q11", "text": "¿Se realizó limpieza y desinfección previa de jaulas o tolvas?" },
      { "id": "m5_q12", "text": "¿Se respetaron las rutas internas de movimiento animal?" },
      { "id": "m5_q13", "text": "¿Se evitaron cruces entre animales de diferentes edades?" },
      { "id": "m5_q14", "text": "¿Se aplicaron cambios de ropa y calzado entre naves o fases?" },
      { "id": "m5_q15", "text": "¿Se limpiaron y desinfectaron los carros de transporte internos?" },
      { "id": "m5_q16", "text": "¿Se evitaron desplazamientos innecesarios de personas y equipos?" },
      { "id": "m5_q17", "text": "¿Se revisaron trampas para roedores?" },
      { "id": "m5_q18", "text": "¿Se repusieron cebos o estaciones de control?" },
      { "id": "m5_q19", "text": "¿Se detectaron excretas, daños o nidos de roedores?" },
      { "id": "m5_q20", "text": "¿Se reportó presencia de aves silvestres dentro de galpones?" },
      { "id": "m5_q21", "text": "¿Se aplicó control químico/mecánico en zonas vulnerables?" },
      { "id": "m5_q22", "text": "¿Se registraron las acciones de control implementadas?" },
      { "id": "m5_q23", "text": "¿Se realizaron las limpiezas programadas de salas o equipos?" },
      { "id": "m5_q24", "text": "¿Se aplicaron los productos desinfectantes con la dosis correcta?" },
      { "id": "m5_q25", "text": "¿Se respetaron los tiempos de contacto recomendados?" },
      { "id": "m5_q26", "text": "¿Se dejaron las salas en vacío sanitario según protocolo?" },
      { "id": "m5_q27", "text": "¿Se desinfectaron las herramientas compartidas entre salas?" },
      { "id": "m5_q28", "text": "¿Se limpiaron y desinfectaron botas, guantes y equipos personales?" },
      { "id": "m5_q29", "text": "¿Se retiraron inmediatamente los animales muertos?" },
      { "id": "m5_q30", "text": "¿Se transportaron en recipientes cerrados y desinfectables?" },
      { "id": "m5_q31", "text": "¿Se llevó el cadáver al sitio de disposición autorizado?" },
      { "id": "m5_q32", "text": "¿Se aplicó desinfección posterior al retiro?" },
      { "id": "m5_q33", "text": "¿Se evitó el contacto de cadáveres con animales vivos?" },
      { "id": "m5_q34", "text": "¿Se llenaron correctamente los registros de bioseguridad?" },
      { "id": "m5_q35", "text": "¿Se actualizó el listado de visitantes y vehículos?" },
      { "id": "m5_q36", "text": "¿Se documentaron las actividades de limpieza y control de plagas?" },
      { "id": "m5_q37", "text": "¿Se notificaron incumplimientos o eventos de riesgo?" },
      { "id": "m5_q38", "text": "¿Se realizó inspección de cumplimiento por parte del supervisor?" }
    ]
  },
  {
    "id": "mod_7",
    "title": "Módulo 2: Alimentación y Agua",
    "questions": [
      { "id": "m7_q0", "text": "¿Se distribuyó el alimento a tiempo en cada sala?" },
      { "id": "m7_q1", "text": "¿Se respetaron los horarios establecidos de alimentación?" },
      { "id": "m7_q2", "text": "¿Se ofreció la cantidad adecuada por lote y fase productiva?" },
      { "id": "m7_q5", "text": "¿Se completaron las tolvas o comederos antes de vaciarse?" },
      { "id": "m7_q6", "text": "¿Se realizó limpieza previa de comederos antes de reabastecer?" },
      { "id": "m7_q7", "text": "¿Se inspeccionó el alimento antes de suministrarlo?" },
      { "id": "m7_q8", "text": "¿Se detectaron signos de alimento en mal estado?" },
      { "id": "m7_q10", "text": "¿Se almacenó el alimento en lugar seco, ventilado y protegido?" },
      { "id": "m7_q14", "text": "¿Los comederos o tolvas están en buen estado y funcionan correctamente?" },
      { "id": "m7_q17", "text": "¿Hay disponibilidad continua de agua en todos los corrales?" },
      { "id": "m7_q18", "text": "¿Funcionan correctamente los bebederos?" },
      { "id": "m7_q19", "text": "¿Se revisó presión y caudal del sistema de agua?" },
      { "id": "m7_q21", "text": "¿Se realizó limpieza de bebederos y tanques esta semana?" }
    ]
  },
  {
    "id": "mod_8",
    "title": "Módulo 3: Gestión de Personal y Entorno",
    "questions": [
      { "id": "m8_q0", "text": "¿Estuvo presente todo el personal asignado hoy?" },
      { "id": "m8_q1", "text": "¿Cada operario conoce y ejecuta su rol específico?" },
      { "id": "m8_q6", "text": "¿Se siguieron los protocolos establecidos en cada módulo?" },
      { "id": "m8_q7", "text": "¿Se respetaron las rutas internas y bioseguridad entre salas?" },
      { "id": "m8_q9", "text": "¿Se utilizaron EPP adecuados en cada área?" },
      { "id": "m8_q10", "text": "¿Se notificaron y registraron desviaciones o errores operativos?" },
      { "id": "m8_q11", "text": "¿Las áreas de trabajo están limpias y organizadas?" },
      { "id": "m8_q12", "text": "¿Los utensilios y equipos fueron lavados y guardados correctamente?" },
      { "id": "m8_q13", "text": "¿Se eliminaron residuos y desperdicios según norma?" },
      { "id": "m8_q16", "text": "¿Se revisaron las condiciones físicas de corrales, pisos y cercas?" },
      { "id": "m8_q20", "text": "¿Se reportaron daños o necesidades de reparación?" },
      { "id": "m8_q22", "text": "¿Se almacenaron productos según normas (temperatura, humedad)?" },
      { "id": "m8_q34", "text": "¿Se dejó listo el reporte para el siguiente turno?" },
      { "id": "m8_q35", "text": "¿Se realizó cierre de jornada con revisión de pendientes?" }
    ]
  }
];

export const TOTAL_QUESTIONS = AUDIT_MODULES.reduce((acc, mod) => acc + mod.questions.length, 0);
