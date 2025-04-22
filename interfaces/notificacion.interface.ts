export interface Notificacion {
	id_notificacion: number;
	id_usuario: number;
	id_viaje: number;
	mensaje: string;
	// tipo: string;
	fecha_notificacion: string;
	leido: boolean;
}
