import { AlertController, AnimationController } from '@ionic/angular';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-correcto',
  templateUrl: './correcto.page.html',
  styleUrls: ['./correcto.page.scss'],
})
export class CorrectoPage implements OnInit, AfterViewInit {

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  @ViewChild('contenido', { read: ElementRef }) itemContenido!: ElementRef;

  public password: string = '';
  public nombre: string = '';
  public apellido: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private animationController: AnimationController
  ) { }

  login() {
    this.router.navigate(['/login']);
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.password = navigation.extras.state['password'];
      this.nombre = navigation.extras.state['nombre'];
      this.apellido = navigation.extras.state['apellido'];
    } else {
      this.password = 'No se pudo encontrar la contraseña';
    }
  }

  public ngAfterViewInit(): void {
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
    this.contenido(); // Llamar a la función aquí
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

}


