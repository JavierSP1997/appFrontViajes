export interface Notificacion {
	id_notificacion: number;
	id_usuario: number;
	id_viaje: number;
	mensaje: string;
	 tipo: string;
	fecha_notificacion: string;
	estado: 'leído' | 'no_leído';
	usuarioNombre: string;
	viajeTitulo:   string;
	hover?:        boolean;
  }
  
  export interface ActualizaNotifiacion {
	mensaje: string;
	tipo: string;
	estado: string;
  }
  
  export interface NuevaNotifiacion extends ActualizaNotifiacion {
	usuarioId: number;
	idViaje: number;
  }