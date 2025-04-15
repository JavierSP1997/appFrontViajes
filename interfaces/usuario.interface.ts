export interface Usuario {
	id: number;
	nombre: string;
	email: string;
	password: string;
	fecha_registro: Date;
	imagen?: string;
	descripcion?: string,
	gender?: 'masculino' | 'femenino' | 'otro';
	hobbies?: string;
	pets?: string;
}
