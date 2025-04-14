export interface Viaje {
    id_viaje: number;
    id_usuario: number;
    nombre_viaje: string;
    fecha_inicio: Date;
    fecha_fin: Date;
    coste_por_persona: number;
    personas_minimas: number;
    localizacion: string;
    itinerario: string;
    imagen: string
  }