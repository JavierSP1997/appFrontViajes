export interface Review {
	id_review: number;
	id_usuario: number;
	viajes_id_viaje: number;
	puntuacion: number;
	review: string;
	fecha: string;
	nombre_usuario?: string;
}
