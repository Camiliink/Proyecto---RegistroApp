import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';
import { AnimationController, AlertController } from '@ionic/angular';
import { Asistencia } from 'src/app/interfaces/asistencia';

@Component({
  selector: 'app-miclases',
  templateUrl: './miclases.page.html',
  styleUrls: ['./miclases.page.scss'],
})
export class MiclasesPage implements OnInit {
  public qrData: string | null = null; // Almacena los datos del QR
  public asistencia: Asistencia | null = null; // Almacena los datos de asistencia
  public usuario: Usuario; // Almacena la información del usuario

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController
  ) {
    this.usuario = new Usuario(); // Inicializa el objeto Usuario
    this.usuario.recibirUsuario(this.activatedRoute, this.router); // Recibe información del usuario
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      const state = navigation.extras.state as { datosQR?: string };
      this.qrData = state.datosQR || null; // Acceso seguro a datosQR
      console.log('Datos QR:', this.qrData); // Muestra los datos en consola

      // Procesar los datos QR y obtener asistencia
      if (this.qrData) {
        this.procesarDatosQR(this.qrData);
      }
    }

    // Agregar la clase 'show' a los botones después de un breve retraso
    this.mostrarBotonesConAnimacion();
  }

  // Método para mostrar los botones con animación
  private mostrarBotonesConAnimacion() {
    setTimeout(() => {
      const buttons = document.querySelectorAll('ion-button');
      buttons.forEach((button) => {
        button.classList.add('show'); // Agrega la clase 'show' a cada botón
      });
    }, 100); // Espera 100ms antes de mostrar los botones
  }

  // Método para procesar los datos QR y obtener la asistencia
  private procesarDatosQR(datosQR: string) {
    try {
      this.asistencia = JSON.parse(datosQR); // Asumiendo que los datos QR son un JSON
      console.log('Asistencia:', this.asistencia); // Muestra los datos de asistencia en consola
    } catch (error) {
      console.error('Error al procesar los datos QR:', error);
      this.mostrarAlerta('Error', 'No se pudieron procesar los datos del código QR.');
    }
  }

  // Método para mostrar alertas
  private async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
  }

  // Método para navegar a otras páginas
  navegar(pagina: string) {
    this.usuario.navegarEnviandousuario(this.router, pagina);
  }
}
