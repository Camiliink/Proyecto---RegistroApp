import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AnimationController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
})
export class CorreoPage implements OnInit,AfterViewInit {

  public correo: string = '';
  @ViewChild('pageContent', { read: ElementRef }) pageContent!: ElementRef;

  constructor(private router: Router, private animationController: AnimationController) { }

  ngOnInit() {
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
  ingresarPaginaValidarRespuestaSecreta() {
    const usuario = Usuario.buscarUsuarioPorCorreo(this.correo);
    if (usuario) {
      const navigationExtras: NavigationExtras = {
        state: {
          correo: this.correo,
          preguntaSecreta: usuario.preguntaSecreta
        }
      };
      this.router.navigate(['/pregunta'], navigationExtras);  // Navegar a la página de pregunta
    } else {
      alert('Correo no encontrado.');
    }
  }
}