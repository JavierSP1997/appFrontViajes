export interface Anfitrion {
	id: number;
	nombre: string;
	email: string;
	fecha_registro: string;
	imagen?: string | null;
	descripcion?: string | null;
	gender?: string | null;
	hobbies?: string | null;
	pets?: string | null;
}
