import type { Participante } from "./participante.interface";
import type { Anfitrion } from "./anfitrion.interface";

export interface Viaje {
	id_viaje: number;
	usuarios_id_usuario: number;
	nombre_viaje: string;
	fecha_inicio: string;
	fecha_fin: string;
	coste_por_persona: string;
	personas_minimas: number;
	localizacion: string;
	itinerario: string;
	imagen: string;
	participantes: Participante[];
	anfitrion: Anfitrion; // ← nuevo campo
}
