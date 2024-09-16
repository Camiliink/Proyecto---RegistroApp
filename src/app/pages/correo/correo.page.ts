import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-correo',
  templateUrl: './correo.page.html',
  styleUrls: ['./correo.page.scss'],
})
export class CorreoPage implements OnInit {

  public correo: string = '';

  constructor(private router: Router) { }

  ngOnInit() {
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