export interface Participante {
	id_usuario: number;
	nombre: string;
	imagen: string;
	status: "confirmado" | "pendiente" | "rechazado";
}
