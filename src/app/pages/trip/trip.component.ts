import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { ViajesService } from "../../services/viajes.service";
import { UsuariosService } from "../../services/usuarios.service";
import type { Viaje } from "../../../../interfaces/viaje.interface";
import { ComentariosComponent } from "../../components/comentarios/comentarios.component";
import { ParticipantesComponent } from "../../components/participantes/participantes.component";
import type { Participante } from "../../../../interfaces/participante.interface";
import type { Anfitrion } from "../../../../interfaces/anfitrion.interface";
import type { Usuario } from "../../../../interfaces/usuario.interface";
import { ReviewsComponent } from "../../components/review/review.component";
import { ParticipantesService } from "../../services/participantes.service";
import Swal from "sweetalert2";
import { NotificacionesService } from "../../services/notificaciones.service";

@Component({
  selector: "app-trip",
  standalone: true,
  imports: [
    CommonModule,
    ComentariosComponent,
    ParticipantesComponent,
    RouterModule,
    ReviewsComponent,
  ],
  templateUrl: "./trip.component.html",
  styleUrls: ["./trip.component.css"],
})
export class TripComponent {
  private viajesService = inject(ViajesService);
  private usuariosService = inject(UsuariosService);
  private notificacionesService = inject(NotificacionesService);
  private route = inject(ActivatedRoute);
  participantesService = inject(ParticipantesService);
  viaje: Viaje | null = null;
  participantes: Participante[] = [];
  anfitrion: Anfitrion | null = null;
  usuarioLogado: Usuario | null = null;
  esAnfitrion = false;
  esParticipante = false;
  esFinalizado = false;
  puedeComentar = false;
  cargado = false;
  error = false;
  progresoCupo = 0;
  token: string = localStorage.getItem("token") || "";

  async ngOnInit(): Promise<void> {
    const id = Number(this.route.snapshot.paramMap.get("idViaje"));

    if (!id) {
      this.error = true;
      return;
    }

    try {
      this.viaje = await this.viajesService.getViajeById(id);
      this.esFinalizado = this.viaje.estado === "finalizado";
      this.participantes = this.viaje.participantes ?? [];
      this.anfitrion = this.viaje.anfitrion;
      this.usuarioLogado = await this.usuariosService.getPerfilUsuario();
      this.esAnfitrion =
        this.usuarioLogado?.id_usuario === this.viaje?.usuarios_id_usuario;
      if (this.usuarioLogado && this.participantes.length > 0) {
        this.esParticipante = this.participantes.some(
          (p) => p.id_usuario === this.usuarioLogado?.id_usuario,
        );
      }
      this.puedeComentar =
        this.esAnfitrion ||
        this.participantes.some(
          (p) =>
            p.id_usuario === this.usuarioLogado?.id_usuario &&
            p.status === "confirmado",
        );

      // biome-ignore lint/complexity/useOptionalChain: <explanation>
      if (this.viaje && this.viaje.personas_minimas) {
        const cantidadActual = this.viaje.participantes?.length || 0;
        const cantidadMinima = this.viaje.personas_minimas;
        const porcentaje = Math.min(
          Math.floor((cantidadActual / cantidadMinima) * 100),
          100,
        );
        this.progresoCupo = porcentaje;
      }
    } catch (err) {
      this.error = true;
    } finally {
      this.cargado = true;
    }
    console.log(this.viaje);
  }

  async unirse() {
    if (!this.viaje || !this.usuarioLogado) return;

    const idViaje = this.viaje.id_viaje;
    const userId = this.usuarioLogado.id_usuario;
    const cooldownKey = `viaje-${idViaje}-usuario-${userId}-cooldown`;

    const ultimoIntento = localStorage.getItem(cooldownKey);
    const ahora = new Date().getTime();

    if (ultimoIntento) {
      const tiempoTranscurrido = ahora - Number(ultimoIntento);
      const horasPasadas = tiempoTranscurrido / (1000 * 60 * 60);

      if (horasPasadas < 24) {
        const horasRestantes = Math.floor(24 - horasPasadas);
        const minutosRestantes = Math.floor(
          (24 - horasPasadas - horasRestantes) * 60,
        );

        await Swal.fire({
          title: "Ya has solicitado unirte",
          text: `Debes esperar ${horasRestantes}h ${minutosRestantes}min para volver a intentarlo.`,
          icon: "info",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          background: "#e0f2fe",
          color: "#075985",
        });
        return;
      }
    }

    try {
      await this.participantesService.unirseAlViaje(idViaje, this.token);
      await this.notificacionesService.nuevaNotificacion(
        {
          "idViaje": idViaje,
          "usuarioId": userId,
          "estado": "no_leido",
          "tipo": "MI PIPE",
          "mensaje": `El usuario ${this.usuarioLogado.nombre} quiere unirse al viaje ${this.viaje.nombre_viaje}`
        },
        this.token
      );

      localStorage.setItem(cooldownKey, ahora.toString());

      
      const viajeActualizado = await this.viajesService.getViajeById(idViaje);
      this.participantes = viajeActualizado.participantes ?? [];
      this.esParticipante = this.participantes.some(
        (p) => p.id_usuario === userId,
      );
      setTimeout(() => location.reload(), 3000);
      
      // 🔽 Forzar re-render y mantener scroll
      const scrollY = window.scrollY;
      this.viaje.participantes = [...this.participantes];
      setTimeout(() => {
        window.scrollTo(0, scrollY);
      }, 0);

      this.esParticipante = this.participantes.some(
        (p) => p.id_usuario === userId,
      );

      // Actualizar el progreso del cupo
      this.actualizarProgresoCupo();
      await Swal.fire({
        title: "¡Solicitud enviada!",
        text: "Has pedido unirte al viaje con éxito.",
        icon: "success",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        background: "#f0fff4",
        color: "#065f46",
      });
    } catch (err) {
      await Swal.fire({
        title: "¡Error!",
        text: "No se pudo enviar la solicitud.",
        icon: "error",
        toast: true,
        position: "top-end",
        timer: 3000,
        showConfirmButton: false,
        background: "#fef2f2",
        color: "#991b1b",
      });
    }
  }

  async abandonar() {
    if (this.viaje && this.usuarioLogado) {
      try {
        await this.participantesService.abandonarViaje(
          this.viaje.id_viaje,
          this.token,
        );

        const result = await Swal.fire({
          icon: "warning",
          title: "¿Estás seguro?",
          text: "Estás a punto de abandonar el viaje.",
          showCancelButton: true,
          toast: true,
          position: "top-end",
          background: "#fef9c3",
          color: "#92400e",
          showConfirmButton: true,
          showCloseButton: true,
        });

        if (!result.isConfirmed) {
          return;
        }

        Swal.fire({
          title: "¡Has abandonado el viaje!",
          text: "Esperamos que te unas a otro pronto.",
          icon: "success",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
          background: "#fefce8",
          color: "#713f12",
        });

        // Actualizar lista de participantes
        const viajeActualizado = await this.viajesService.getViajeById(
          this.viaje.id_viaje,
        );
        this.participantes = viajeActualizado.participantes ?? [];

        // 🔽 Forzar re-render y mantener scroll
        const scrollY = window.scrollY;
        this.viaje.participantes = [...this.participantes];
        setTimeout(() => {
          window.scrollTo(0, scrollY);
        }, 0);

        this.esParticipante = this.participantes.some(
          (p) => p.id_usuario === this.usuarioLogado?.id_usuario,
        );

        this.actualizarProgresoCupo();
      } catch (err) {
        Swal.fire({
          title: "¡Error!",
          text: "No se pudo abandonar el viaje.",
          icon: "error",
          toast: true,
          position: "top-end",
          timer: 3000,
          showConfirmButton: false,
          background: "#fef2f2",
          color: "#991b1b",
        });
      }
    }
  }

  actualizarProgresoCupo(): void {
    // biome-ignore lint/complexity/useOptionalChain: <explanation>
    if (this.viaje && this.viaje.personas_minimas) {
      const cantidadActual = this.viaje.participantes?.length || 0;
      const cantidadMinima = this.viaje.personas_minimas;
      const porcentaje = Math.min(
        Math.floor((cantidadActual / cantidadMinima) * 100),
        100,
      );
      this.progresoCupo = porcentaje;
    }
  }

  eliminarViaje() {
    if (this.viaje && this.usuarioLogado) {
      const idViaje = this.viaje.id_viaje;
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "warning",
        title: "¿Eliminar viaje?",
        text: "Se eliminará permanentemente. ¿Deseas continuar?",
        showCancelButton: true,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        timerProgressBar: true,
        background: "#fff3cd",
        color: "#856404",
        iconColor: "#ffc107",
        showCloseButton: true,
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            await this.viajesService.removeViaje(idViaje, this.token);
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "success",
              title: "Viaje eliminado con éxito.",
              showConfirmButton: false,
              timer: 3000,
              background: "#f0fdf4",
              color: "#14532d",
              iconColor: "#22c55e",
            });
            this.redirectToViajes();
          } catch (err) {
            Swal.fire({
              toast: true,
              position: "top-end",
              icon: "error",
              title: "Error al eliminar viaje.",
              showConfirmButton: false,
              timer: 3000,
              background: "#fef2f2",
              color: "#991b1b",
              iconColor: "#dc2626",
            });
          }
        }
      });
    }
  }

  async finalizarViaje(): Promise<void> {
    if (!this.viaje) return;

    const confirmacion = await Swal.fire({
      toast: true,
      position: "top-end",
      icon: "warning",
      title: "¿Finalizar viaje?",
      text: "¿Estás seguro de que deseas marcarlo como finalizado?",
      showCancelButton: true,
      confirmButtonText: "Sí, finalizar",
      cancelButtonText: "Cancelar",
      timerProgressBar: true,
      background: "#fff3cd",
      color: "#856404",
      iconColor: "#ffc107",
      showCloseButton: true,
    });

    if (!confirmacion.isConfirmed) return;

    try {
      await this.viajesService.finalizarViaje(this.viaje.id_viaje);
      this.viaje.estado = "finalizado";
      this.esFinalizado = true;

      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Viaje finalizado.",
        showConfirmButton: false,
        timer: 3000,
        background: "#ecfdf5",
        color: "#064e3b",
        iconColor: "#10b981",
      });
    } catch (error) {
      console.error("Error al finalizar el viaje:", error);
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "error",
        title: "No se pudo finalizar el viaje.",
        showConfirmButton: false,
        timer: 3000,
        background: "#fef2f2",
        color: "#991b1b",
        iconColor: "#dc2626",
      });
    }
  }
  redirectToViajes() {
    window.location.href = "/viajes";
  }
}

