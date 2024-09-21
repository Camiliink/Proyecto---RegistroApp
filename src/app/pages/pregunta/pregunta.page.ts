import { ActivatedRoute, Router } from '@angular/router';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
})
export class PreguntaPage implements OnInit,AfterViewInit {

  correo: string = '';
  pregunta: string = '';
  respuesta: string = '';
  respuestaCorrecta: string = '';

  @ViewChild('pageContent', { read: ElementRef }) pageContent!: ElementRef;

  constructor(private router: Router, private animationController: AnimationController) {}

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.correo = navigation.extras.state['correo'];
      this.pregunta = navigation.extras.state['preguntaSecreta'];

      const usuario = Usuario.buscarUsuarioPorCorreo(this.correo);
      if (usuario) {
        this.respuestaCorrecta = usuario.respuestaSecreta;
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
  ngAfterViewInit() {
    this.animarEntradaPagina();
  }

  animarEntradaPagina() {
    this.animationController
      .create()
      .addElement(this.pageContent.nativeElement)
      .duration(1500)
      .fromTo('opacity', '0', '1')  // Fade in effect
      .fromTo('transform', 'translateY(100%)', 'translateY(0%)')  // Slide from bottom to top
      .easing('ease-out')
      .play();
  }

  verificarRespuesta() {
    const usuario: Usuario | undefined = Usuario.buscarUsuarioPorCorreo(this.correo);
  
    if (this.respuesta.trim().toLowerCase() === this.respuestaCorrecta.trim().toLowerCase()) {
      if (usuario) {
        this.router.navigate(['/correcto'], {   
          state: { 
            password: usuario.password,
            nombre: usuario.nombre,
            apellido: usuario.apellido
          }
        });
      }
    } else {
      if (usuario) {
        this.router.navigate(['/incorrecto'], {
          state: {
            nombre: usuario.nombre,
            apellido: usuario.apellido
          }
        });
      }
    }
  }
}
