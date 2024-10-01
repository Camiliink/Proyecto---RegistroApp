import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],
})
export class IncorrectoPage implements OnInit, AfterViewInit {

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  @ViewChild('contenido', { read: ElementRef }) itemContenido!: ElementRef;
  @ViewChild('page', { read: ElementRef }) itemPage!: ElementRef;
  public correo: string = '';
  public nombre: string = '';
  public apellido: string = '';

  constructor(private router: Router, private animationController: AnimationController) { }

  pregunta() {
    this.animarSalidaPagina(() => {
      this.router.navigate(['/pregunta']);
    });
  }
  irAlLogin() {
    this.correo = '';
    this.router.navigate(['/login'], { replaceUrl: true });
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.nombre = navigation.extras.state['nombre'];
      this.apellido = navigation.extras.state['apellido'];
    }
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
    this.contenido();
    this.animarEntradaPagina();  // Llamamos la animación de entrada una vez
  }

  contenido() {
    this.animationController
      .create()
      .addElement(this.itemContenido.nativeElement)
      .iterations(Infinity)
      .duration(2000)
      .keyframes([
        { offset: 0, transform: 'scale(1)', opacity: '1' },
        { offset: 0.5, transform: 'scale(1.5)', opacity: '0.3' },
        { offset: 1, transform: 'scale(1)', opacity: '1' },
      ])
      .play();
  }

  animarEntradaPagina() {
    this.animationController
      .create()
      .addElement(this.itemPage.nativeElement)
      .duration(1000)
      .fromTo('opacity', '0', '1')  // Efecto de desvanecimiento
      .fromTo('transform', 'translateX(-100%)', 'translateX(0%)')  // Deslizar desde la izquierda
      .easing('ease-out')
      .play();
  }

  animarSalidaPagina(callback: () => void) {
    const animation = this.animationController
      .create()
      .addElement(this.itemPage.nativeElement)
      .duration(1000)  // Duración de la animación
      .fromTo('opacity', '1', '0')  // Desvanecer de opaco a transparente
      .easing('ease-in');

    // Llama al callback después de que la animación termine
    animation.onFinish(() => {
      if (callback) {
        callback();
      }
    });

    animation.play();
  }
}


