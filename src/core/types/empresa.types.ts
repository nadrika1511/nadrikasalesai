export type Rol = 'superadmin' | 'admin_empresa' | 'vendedor' | 'operador' | 'lectura';

export interface ConfigIA {
  nombre: string;
  personalidad: string;
  idioma: string;
  pais: string;
  tono: 'formal' | 'casual' | 'amigable';
  nivelFormalidad: 'alto' | 'medio' | 'bajo';
  usaEmojis: boolean;
  horarioAtencion: { inicio: string; fin: string; zonaHoraria: string };
  objetivos: string[];
  restricciones: string[];
  respuestasProhibidas: string[];
  productosPermitidos: string[];
  productosProhibidos: string[];
}

export interface ConfigWhatsApp {
  phoneNumberId: string;
  wabaId: string;
  displayPhoneNumber: string;
}

export interface Empresa {
  id: string;
  nombre: string;
  plan: 'trial' | 'starter' | 'pro' | 'enterprise';
  activo: boolean;
  configIA: ConfigIA;
  configWhatsApp: ConfigWhatsApp;
  createdAt: number;
}
