import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AnimationController, AlertController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
})
export class CorreoPage implements OnInit,AfterViewInit {

  public correo: string = '';
  @ViewChild('pageContent', { read: ElementRef }) pageContent!: ElementRef;
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;

  constructor(
    private router: Router, 
    private animationController: AnimationController,
    private alertController: AlertController) { }

  ngOnInit() {
  }
  ngAfterViewInit(): void {
    if (this.itemTitulo) {
      const animation = this.animationController
        .create()
        .addElement(this.itemTitulo.nativeElement)
        .iterations(Infinity)
        .duration(7000)
        .fromTo('transform', 'translate(0%)', 'translate(100%)')
        .fromTo('opacity', 0.5, 1);
      animation.play();
    }
    this.animarEntradaPagina();  
  }
  animarEntradaPagina() {
    this.animationController
      .create()
      .addElement(this.pageContent.nativeElement)
      .duration(1500)
      .fromTo('opacity', '0', '1') 
      .fromTo('transform', 'translateY(100%)', 'translateY(0%)')  
      .easing('ease-out')
      .play();
  }
  irAlLogin() {
    this.correo = ''; 
    this.router.navigate(['/login'], { replaceUrl: true });
  }
  
  async ingresarPaginaValidarRespuestaSecreta() {
    const usuario = Usuario.buscarUsuarioPorCorreo(this.correo);
    if (usuario) {
      const navigationExtras = {
        state: {
          correo: this.correo,
          preguntaSecreta: usuario.preguntaSecreta
        }
      };
      this.router.navigate(['/pregunta'], navigationExtras);  // Navegar a la página de pregunta
    } else {
      // Mostrar alert antes de redirigir
      await this.mostrarAlerta('Error', 'El correo ingresado no es válido');
      // Redirigir a la página "incorrecto"
      const navigationExtras = {
        state: {
          mensajeError: 'El correo ingresado no es válido.'
        }
      };
      this.router.navigate(['/incorrecto'], navigationExtras);
    }
  }

  // Método para mostrar el Alert
  async mostrarAlerta(titulo: string, mensaje: string) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }
}
