/**
 * Constantes para el Módulo de Configuración
 */

import { SettingsTab } from '@/types/configuracion'
import { COMMON_MESSAGES } from './common_text'

// ============================================================================
// LABELS DE PESTAÑAS
// ============================================================================

export const CONFIG_TABS: Record<SettingsTab, { label: string; description: string }> = {
  general: {
    label: 'General',
    description: 'Configuración general de la aplicación',
  },
  empresa: {
    label: 'Empresa',
    description: 'Datos fiscales y configuración de la empresa',
  },
  usuarios: {
    label: 'Usuarios',
    description: 'Gestión de usuarios y roles',
  },
  modulos: {
    label: 'Módulos',
    description: 'Habilitar o deshabilitar módulos del sistema',
  },
  integraciones: {
    label: 'Integraciones',
    description: 'Configurar conexiones con servicios externos',
  },
  notificaciones: {
    label: 'Notificaciones',
    description: 'Configuración de correo y notificaciones',
  },
  respaldos: {
    label: 'Respaldos',
    description: 'Programación y retención de respaldos',
  },
}

// ============================================================================
// LABELS DE CONFIGURACIÓN GENERAL
// ============================================================================

export const CONFIG_GENERAL_LABELS = {
  titulo: 'Configuración General',
  descripcion: 'Personaliza la apariencia y comportamiento de la aplicación',
  nombre_app: {
    label: 'Nombre de la Aplicación',
    placeholder: 'NetOps CRM',
  },
  logo: {
    label: 'Logo',
    upload: 'Subir logo',
    remove: 'Eliminar',
  },
  favicon: {
    label: 'Favicon',
    upload: 'Subir favicon',
  },
  zona_horaria: {
    label: 'Zona Horaria',
    placeholder: 'Selecciona una zona horaria',
  },
  formato_fecha: {
    label: 'Formato de Fecha',
  },
  formato_hora: {
    label: 'Formato de Hora',
  },
  idioma: {
    label: 'Idioma',
  },
  tema: {
    label: 'Tema',
    opciones: {
      claro: 'Claro',
      oscuro: 'Oscuro',
      sistema: 'Sistema',
    },
  },
  guardar: 'Guardar Cambios',
  guardando: 'Guardando...',
  guardado_exito: 'Configuración guardada correctamente',
  guardado_error: 'Error al guardar la configuración',
}

// Opciones de zona horaria
export const ZONAS_HORARIAS = [
  { value: 'America/Mexico_City', label: 'Ciudad de México (GMT-6)' },
  { value: 'America/New_York', label: 'Nueva York (GMT-5)' },
  { value: 'America/Chicago', label: 'Chicago (GMT-6)' },
  { value: 'America/Denver', label: 'Denver (GMT-7)' },
  { value: 'America/Los_Angeles', label: 'Los Ángeles (GMT-8)' },
  { value: 'Europe/Madrid', label: 'Madrid (GMT+1)' },
  { value: 'Europe/London', label: 'Londres (GMT+0)' },
  { value: 'Europe/Paris', label: 'París (GMT+1)' },
]

// Opciones de formato de fecha
export const FORMATOS_FECHA = [
  { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
  { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
  { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
]

// Opciones de formato de hora
export const FORMATOS_HORA = [
  { value: '24h', label: '24 horas' },
  { value: '12h', label: '12 horas (AM/PM)' },
]

// Opciones de idioma
export const IDIOMAS = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
]

// ============================================================================
// LABELS DE CONFIGURACIÓN DE EMPRESA
// ============================================================================

export const CONFIG_EMPRESA_LABELS = {
  titulo: 'Datos de la Empresa',
  descripcion: 'Información fiscal y datos de contacto de tu empresa',
  nombre_empresa: {
    label: 'Nombre de la Empresa',
    placeholder: 'Nombre legal de la empresa',
  },
  rfc: {
    label: 'RFC',
    placeholder: 'RFC de la empresa',
  },
  direccion: {
    label: 'Dirección',
    placeholder: 'Dirección fiscal completa',
  },
  telefono: {
    label: 'Teléfono',
    placeholder: '+52 (55) 1234 5678',
  },
  email: {
    label: 'Correo Electrónico',
    placeholder: 'contacto@empresa.com',
  },
  logo: {
    label: 'Logo Corporativo',
    upload: 'Subir logo',
    remove: 'Eliminar',
  },
  colores: {
    label: 'Colores Institucionales',
    primary: 'Color Primario',
    secondary: 'Color Secundario',
    vista_previa: 'Vista previa',
  },
  guardar: 'Guardar Cambios',
  guardando: 'Guardando...',
  guardado_exito: 'Configuración guardada correctamente',
  guardado_error: 'Error al guardar la configuración',
}

// ============================================================================
// LABELS DE CONFIGURACIÓN DE MÓDULOS
// ============================================================================

export const CONFIG_MODULOS_LABELS = {
  titulo: 'Módulos del Sistema',
  descripcion: 'Habilita o deshabilita los módulos disponibles',
  titulo_lista: 'Módulos del Sistema',
  descripcion_lista: 'Habilita o deshabilita los módulos disponibles para tu organización',
  habilitar: 'Habilitado',
  deshabilitar: 'Deshabilitado',
  config_avanzada: 'Configuración avanzada',
  resumen: 'Resumen',
  resumen_descripcion: 'Estado actual de los módulos del sistema',
  habilitados: 'Módulos habilitados',
  deshabilitados: 'Módulos deshabilitados',
  cambios_nota: 'Los cambios en los módulos afectarán el acceso de los usuarios según su rol.',
  guardar: 'Guardar Cambios',
}

// ============================================================================
// LABELS DE PERMISOS
// ============================================================================

export const CONFIG_PERMISOS_LABELS = {
  empresa: 'No tienes permisos para modificar la configuración de la empresa.',
  modulos: 'No tienes permisos para modificar la configuración de módulos.',
  integraciones: 'No tienes permisos para modificar las integraciones.',
  respaldos: 'No tienes permisos para configurar los respaldos.',
}

// ============================================================================
// LABELS DE INTEGRACIONES
// ============================================================================

export const CONFIG_INTEGRACIONES_LABELS = {
  titulo: 'Integraciones',
  descripcion: 'Conecta con servicios externos',
  conectar: 'Conectar con Google',
  conectado: 'Conectado',
  google: {
    conectar: 'Conectar con Google',
  },
  google_drive: {
    nombre: 'Google Drive',
    descripcion: 'Almacena y sincroniza archivos con Google Drive',
    conectar: 'Conectar',
    desconectar: 'Desconectar',
    configuracion: 'Configuración',
  },
  google_calendar: {
    nombre: 'Google Calendar',
    descripcion: 'Sincroniza eventos y reuniones con Google Calendar',
    conectar: 'Conectar',
    desconectar: 'Desconectar',
  },
  n8n: {
    nombre: 'N8N',
    descripcion: 'Automatizaciones mediante webhooks de N8N',
    webhook_url: 'Webhook URL',
    guardar: 'Guardar',
  },
  supabase: {
    nombre: 'Supabase',
    descripcion: 'Configuración de la base de datos',
    url: 'URL del Proyecto',
    anon_key: 'Anon Key',
    conectado: 'Conectado',
  },
  smtp: {
    nombre: 'Email SMTP',
    descripcion: 'Configuración del servidor de correo',
    host: 'Servidor SMTP',
    port: 'Puerto',
    usuario: 'Usuario',
    password: 'Contraseña',
    from_email: 'Correo Remitente',
    from_name: 'Nombre Remitente',
    probar: 'Probar Configuración',
  },
  guardar: 'Guardar Cambios',
  guardando: 'Guardando...',
  guardado_exito: 'Configuración guardada correctamente',
  guardado_error: 'Error al guardar la configuración',
}

// ============================================================================
// LABELS DE NOTIFICACIONES
// ============================================================================

export const CONFIG_NOTIFICACIONES_LABELS = {
  titulo: 'Notificaciones',
  descripcion: 'Configura cómo recibes las notificaciones',
  email: {
    titulo: 'Correo Electrónico',
    descripcion: 'Configura el servidor SMTP para enviar correos',
  },
  preferencias: {
    titulo: 'Preferencias de Notificaciones',
    proyectos: 'Notificaciones de proyectos',
    tareas: 'Notificaciones de tareas',
    tickets: 'Notificaciones de tickets',
    crm: 'Notificaciones de CRM',
  },
  push: {
    titulo: 'Notificaciones Push',
    descripcion: 'Recibe notificaciones en tiempo real',
  },
  guardar: 'Guardar Cambios',
}

// ============================================================================
// LABELS DE RESPALDOS
// ============================================================================

export const CONFIG_RESPALDOS_LABELS = {
  titulo: 'Respaldos',
  descripcion: 'Configura la frecuencia y retención de respaldos',
  programacion: {
    label: 'Frecuencia de Respaldo',
    diario: 'Diario',
    semanal: 'Semanal',
    mensual: 'Mensual',
  },
  hora: {
    label: 'Hora de Respaldo',
  },
  retencion: {
    label: 'Días de Retención',
    dias: 'días',
  },
  ultimo: {
    label: 'Último Respaldo',
    nunca: 'Nunca',
  },
  exportar: 'Exportar Datos',
  exportar_descarga: 'Descarga todos los datos del sistema',
}

// ============================================================================
// ICONS
// ============================================================================

export const CONFIG_TAB_ICONS = {
  general: 'Settings',
  empresa: 'Building2',
  usuarios: 'Users',
  modulos: 'LayoutGrid',
  integraciones: 'Plug',
  notificaciones: 'Bell',
  respaldos: 'Database',
}

// ============================================================================
// LABELS COMUNES
// ============================================================================

export const CONFIG_COMMON_LABELS = {
  guardando: 'Guardando...',
  guardado_exito: 'Configuración guardada correctamente',
  guardado_error: 'Error al guardar la configuración',
}

// ============================================================================
// COLORES DEL SISTEMA
// ============================================================================

export const CONFIG_COLORS = {
  success: {
    text: 'text-emerald-500',
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/20',
  },
  error: {
    text: 'text-red-500',
    bg: 'bg-red-500/10',
    border: 'border-red-500/20',
  },
}
