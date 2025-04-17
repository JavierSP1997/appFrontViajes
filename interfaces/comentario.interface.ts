export interface Comentario {
	id_comentario: number;
	usuarios_id_usuario: number;
	viajes_id_viaje: number;
	comentario: string;
	fecha_comentario: string;
	nombre: string; // nombre del usuario (viene del JOIN)
}
