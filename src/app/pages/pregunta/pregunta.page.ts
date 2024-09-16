import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-pregunta',
  templateUrl: './pregunta.page.html',
  styleUrls: ['./pregunta.page.scss'],
})
export class PreguntaPage implements OnInit {

  correo: string = '';
  pregunta: string = '';
  respuesta: string = '';
  respuestaCorrecta: string = '';

  constructor(private router: Router) {}

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

  verificarRespuesta() {
    if (this.respuesta.trim().toLowerCase() === this.respuestaCorrecta.trim().toLowerCase()) {
      alert('Respuesta correcta. Tu contraseña es: ' + Usuario.buscarUsuarioPorCorreo(this.correo)!.password);
    } else {
      alert('Respuesta incorrecta. Inténtalo de nuevo.');
    }
  }
}
