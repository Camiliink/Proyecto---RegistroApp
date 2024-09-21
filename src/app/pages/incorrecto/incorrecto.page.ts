import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-incorrecto',
  templateUrl: './incorrecto.page.html',
  styleUrls: ['./incorrecto.page.scss'],
})
export class IncorrectoPage implements OnInit, AfterViewInit {

  @ViewChild('titulo', {read: ElementRef}) itemTitulo!: ElementRef;
  @ViewChild('contenido', { read: ElementRef }) itemContenido!: ElementRef;

  public nombre: string = '';
  public apellido: string = '';

  constructor(private router: Router,
    private animationController: AnimationController
  ) { }

  pregunta() {
    this.router.navigate(['/pregunta']);
  }

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.nombre = navigation.extras.state['nombre'];
      this.apellido = navigation.extras.state['apellido'];
    }
  }

  public ngAfterViewInit(): void {
    if(this.itemTitulo){
      const animation = this.animationController
        .create()
        .addElement(this.itemTitulo.nativeElement)
        .iterations(Infinity)
        .duration(7000)
        .fromTo('transform','translate(0%)', 'translate(100%)')
        .fromTo('opacity', 0.5, 1);
      animation.play();
    }
    this.contenido();
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

