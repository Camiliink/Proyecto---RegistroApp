import { CorreoPage } from './../correo/correo.page';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { AnimationController} from '@ionic/angular';
import { animate, animation, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
})

export class InicioPage implements AfterViewInit {

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  @ViewChild('page', { read: ElementRef }) page!: ElementRef;
  @ViewChild('mensajeQR', {read: ElementRef})itemMensajeQR! : ElementRef;
  
  
  public usuario: Usuario;
  cardElements: any;
  

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController) 
  {
    this.usuario = new Usuario();
    this.usuario.recibirUsuario(this.activatedRoute, this.router);
  }

  ngAfterViewInit() {
    this.animarTituloIzqDer();
    this.animarVueltaDePagina();
    this.mensajeQR();
  }

  animarTituloIzqDer() {
    this.animationController
      .create()
      .addElement(this.itemTitulo.nativeElement)
      .iterations(Infinity)
      .duration(10000)
      .fromTo('transform', 'translate(0%)', 'translate(100%)')
      .play();
  }

  animarDerIzq(nativeElement: any, duration: number) {
    this.animationController
      .create()
      .addElement(nativeElement)
      .iterations(1)
      .duration(duration)
      .fromTo('transform', 'translate(100%)', 'translate(0%)')
      .play();
  }

  animarRotacion(elementRef: any, duration: number) {
    this.animationController
      .create()
      .addElement(elementRef)
      .iterations(1)
      .duration(duration)
      .fromTo('transform', 'rotate(0deg)', 'rotate(360deg)')
      .play();
  }

  animarVueltaDePagina() {
    this.animationController
      .create()
      .addElement(this.page.nativeElement)
      .iterations(1)
      .duration(1000)
      .fromTo('transform', 'rotateY(deg)', 'rotateY(-180)')
      .duration(1000)
      .fromTo('transform', 'rotateY(-180deg)', 'rotateY(0deg)')
      .play();
  }

  asignado(texto: string) {
    if (texto.trim() !== '') {
      return texto;
    }
    return 'No asignado';
  }

  async mostrarMensajeAlerta(mensaje: string) {
    const alert = await this.alertController.create({
      header: 'Datos personales',
      message: mensaje,
      buttons: ['OK']
    });
    await alert.present();
  }

  navegar(pagina: string) {
    this.usuario.navegarEnviandousuario(this.router, pagina);
  }

  mensajeQR(){
    this.animationController
    .create()
    .addElement(this.itemMensajeQR.nativeElement)
    .iterations(Infinity)
    .duration(2000)
    .keyframes([
      { offset: 0, transform: 'scale(1)', opacity: '1' },
      { offset: 0.5, transform: 'scale(1.5)', opacity: '0.3' },
      { offset: 1, transform: 'scale(1)', opacity: '1' },
    ])
    .play()
  }


}
