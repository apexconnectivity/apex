/**
 * Tipos para el Módulo de Configuración
 */

export interface ConfigGeneral {
  nombre_app: string
  logo_url: string | null
  favicon_url: string | null
  zona_horaria: string
  formato_fecha: string
  formato_hora: string
  idioma: string
  tema: 'claro' | 'oscuro' | 'sistema'
}

export interface ConfigEmpresa {
  nombre_empresa: string
  rfc: string
  direccion: string
  telefono: string
  email: string
  logo_url: string | null
  color_primario: string
  color_secundario: string
}

export interface ModuloConfig {
  id: string
  nombre: string
  descripcion: string
  habilitado: boolean
  config_especifica: Record<string, unknown>
}

export interface ConfigModulos {
  crm: ModuloConfig
  proyectos: ModuloConfig
  tareas: ModuloConfig
  soporte: ModuloConfig
  archivos: ModuloConfig
  compras: ModuloConfig
  calendario: ModuloConfig
  notificaciones: ModuloConfig
}

export interface IntegracionConfig {
  id: string
  nombre: string
  descripcion: string
  habilitada: boolean
  config: Record<string, string>
}

export interface ConfigIntegraciones {
  google_drive: IntegracionConfig
  google_calendar: IntegracionConfig
  n8n: IntegracionConfig
  supabase: IntegracionConfig
  email_smtp: IntegracionConfig
}

export interface ConfigNotificaciones {
  smtp_host: string
  smtp_port: number
  smtp_user: string
  smtp_password: string
  smtp_from_email: string
  smtp_from_name: string
  notificaciones_push: boolean
  preferencias: {
    email_proyectos: boolean
    email_tareas: boolean
    email_tickets: boolean
    email_crm: boolean
  }
}

export interface ConfigRespaldos {
  programacion: 'diario' | 'semanal' | 'mensual'
  hora: number
  retencion_dias: number
  ultima_ejecucion: string | null
}

export interface ConfiguracionCompleta {
  general: ConfigGeneral
  empresa: ConfigEmpresa
  modulos: ConfigModulos
  integraciones: ConfigIntegraciones
  notificaciones: ConfigNotificaciones
  respaldos: ConfigRespaldos
}

// Valores por defecto
export const DEFAULT_CONFIG: ConfiguracionCompleta = {
  general: {
    nombre_app: 'NetOps CRM',
    logo_url: null,
    favicon_url: null,
    zona_horaria: 'America/Mexico_City',
    formato_fecha: 'DD/MM/YYYY',
    formato_hora: '24h',
    idioma: 'es',
    tema: 'sistema',
  },
  empresa: {
    nombre_empresa: '',
    rfc: '',
    direccion: '',
    telefono: '',
    email: '',
    logo_url: null,
    color_primario: '#06b6d4',
    color_secundario: '#8b5cf6',
  },
  modulos: {
    crm: {
      id: 'crm',
      nombre: 'CRM',
      descripcion: 'Gestión de empresas y contactos',
      habilitado: true,
      config_especifica: {},
    },
    proyectos: {
      id: 'proyectos',
      nombre: 'Proyectos',
      descripcion: 'Pipeline de proyectos en 5 fases',
      habilitado: true,
      config_especifica: {},
    },
    tareas: {
      id: 'tareas',
      nombre: 'Tareas',
      descripcion: 'Gestión de tareas y subtareas',
      habilitado: true,
      config_especifica: {},
    },
    soporte: {
      id: 'soporte',
      nombre: 'Soporte',
      descripcion: 'Contratos y tickets de soporte',
      habilitado: true,
      config_especifica: {},
    },
    archivos: {
      id: 'archivos',
      nombre: 'Archivos',
      descripcion: 'Gestión de documentos y archivos',
      habilitado: true,
      config_especifica: {},
    },
    compras: {
      id: 'compras',
      nombre: 'Compras',
      descripcion: 'Gestión de proveedores y órdenes',
      habilitado: true,
      config_especifica: {},
    },
    calendario: {
      id: 'calendario',
      nombre: 'Calendario',
      descripcion: 'Calendario y reuniones',
      habilitado: true,
      config_especifica: {},
    },
    notificaciones: {
      id: 'notificaciones',
      nombre: 'Notificaciones',
      descripcion: 'Sistema de notificaciones',
      habilitado: true,
      config_especifica: {},
    },
  },
  integraciones: {
    google_drive: {
      id: 'google_drive',
      nombre: 'Google Drive',
      descripcion: 'Almacenamiento de archivos en la nube',
      habilitada: false,
      config: {},
    },
    google_calendar: {
      id: 'google_calendar',
      nombre: 'Google Calendar',
      descripcion: 'Sincronización de calendario',
      habilitada: false,
      config: {},
    },
    n8n: {
      id: 'n8n',
      nombre: 'N8N',
      descripcion: 'Automatizaciones y webhooks',
      habilitada: false,
      config: {},
    },
    supabase: {
      id: 'supabase',
      nombre: 'Supabase',
      descripcion: 'Base de datos y autenticación',
      habilitada: true,
      config: {},
    },
    email_smtp: {
      id: 'email_smtp',
      nombre: 'Email SMTP',
      descripcion: 'Envío de correos electrónicos',
      habilitada: false,
      config: {},
    },
  },
  notificaciones: {
    smtp_host: '',
    smtp_port: 587,
    smtp_user: '',
    smtp_password: '',
    smtp_from_email: '',
    smtp_from_name: '',
    notificaciones_push: true,
    preferencias: {
      email_proyectos: true,
      email_tareas: true,
      email_tickets: true,
      email_crm: true,
    },
  },
  respaldos: {
    programacion: 'semanal',
    hora: 2,
    retencion_dias: 30,
    ultima_ejecucion: null,
  },
}

// Tipos de tabs de configuración
export type SettingsTab = 'general' | 'empresa' | 'usuarios' | 'modulos' | 'integraciones' | 'notificaciones' | 'respaldos'
