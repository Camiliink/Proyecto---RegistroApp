
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { AnimationController} from '@ionic/angular';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Asistencia } from 'src/app/interfaces/asistencia';
import jsQR, { QRCode } from 'jsqr';

@Component({
  selector: 'app-misdatos',
  templateUrl: './misdatos.page.html',
  styleUrls: ['./misdatos.page.scss'],
})

export class MisdatosPage implements AfterViewInit {

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  @ViewChild('page', { read: ElementRef }) page!: ElementRef;
  @ViewChild('itemCuenta', { read: ElementRef }) itemCuenta!: ElementRef;
  @ViewChild('itemNombre', { read: ElementRef }) itemNombre!: ElementRef;
  @ViewChild('itemApellido', { read: ElementRef }) itemApellido!: ElementRef;
  @ViewChild('itemEducacion', { read: ElementRef }) itemEducacion!: ElementRef;
  @ViewChild('itemFechaNacimiento', { read: ElementRef }) itemFechaNacimiento!: ElementRef;
  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;
  
  public listaNivelesEducacionales = NivelEducacional.getNivelesEducacionales();
  
  public usuario: Usuario;
  MensajeDatos: any;
  
  public asistencia: Asistencia | undefined = undefined;
  public escaneando = false;
  public datosQR: string = '';
  public palabras: string[] = [];
  private indexPalabra: number = 0;
  public filasVisibles: boolean[] = []; 

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
  }

  public actualizarNivelEducacional(event: any) {
    this.usuario.nivelEducacional 
      = NivelEducacional.buscarNivelEducacional(event.detail.value)!;
  }

  limpiarPagina() {
    this.usuario.cuenta = '';
    this.usuario.nombre = '';
    this.usuario.apellido = '';
    this.usuario.nivelEducacional = NivelEducacional.buscarNivelEducacional(1)!;
    this.usuario.fechaNacimiento = undefined;
  }

  limpiarAnimandoDerIzq() {
    this.limpiarPagina();
    this.animarDerIzq(this.itemCuenta.nativeElement, 400);
    this.animarDerIzq(this.itemNombre.nativeElement, 400);
    this.animarDerIzq(this.itemApellido.nativeElement, 400);
    this.animarDerIzq(this.itemEducacion.nativeElement, 400);
    this.animarDerIzq(this.itemFechaNacimiento.nativeElement, 400);
  }

  animarTituloIzqDer() {
    this.animationController
      .create()
      .addElement(this.itemTitulo.nativeElement)
      .iterations(Infinity)
      .duration(6000)
      .fromTo('transform', 'translate(0%)', 'translate(100%)')
      .fromTo('opacity', 0.2, 1)
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

  asignado(texto: string) {
    if (texto.trim() !== '') {
      return texto;
    }
    return 'No asignado';
  }

  mostrarDatosPersona() {
    // Si el usuario no ingresa la cuenta, se mostrará un error
    if (this.usuario.cuenta.trim() === '') {
      this.mostrarMensajeAlerta('La cuenta es un campo obligatorio.');
      return;
    }

    // Si el usuario no ingresa al menos el nombre o el apellido, se mostrará un error
    this.usuario.nombre = this.usuario.nombre.trim();
    this.usuario.apellido = this.usuario.apellido.trim();
    if (this.usuario.nombre.trim() === '' && this.usuario.apellido === '') {
      this.mostrarMensajeAlerta('Debe ingresar al menos un nombre o un apellido.');
      return;
    }

    // Mostrar un mensaje emergente con los datos de la persona
    let mensaje = `
      <small>
        <b>Cuenta:     </b> ${this.usuario.cuenta} <br>
        <b>Usuario:    </b> ${this.usuario.correo} <br>
        <b>Nombre:     </b> ${this.asignado(this.usuario.nombre)} <br>
        <b>Apellido:   </b> ${this.asignado(this.usuario.apellido)} <br>
        <b>Educación:  </b> ${this.asignado(this.usuario.nivelEducacional.getEducacion())} <br>
        <b>Nacimiento: </b> ${this.usuario.getFechaNacimiento()}
      </small>
    `;
    this.mostrarMensajeAlerta(mensaje);
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

  

  ngOnInit() {
    this.comenzarEscaneoQR();
  }



  public async comenzarEscaneoQR() {
    const mediaProvider: MediaProvider = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    this.video.nativeElement.srcObject = mediaProvider;
    this.video.nativeElement.setAttribute('playsinline', 'true');
    this.video.nativeElement.play();
    this.escaneando = true;
    requestAnimationFrame(this.verificarVideo.bind(this));
  }

  async verificarVideo() {
    if (this.video.nativeElement.readyState === this.video.nativeElement.HAVE_ENOUGH_DATA) {
      if (this.obtenerDatosQR() || !this.escaneando) return;
      requestAnimationFrame(this.verificarVideo.bind(this));
    } else {
      requestAnimationFrame(this.verificarVideo.bind(this));
    }
  }

  public obtenerDatosQR(): boolean {
    const w: number = this.video.nativeElement.videoWidth;
    const h: number = this.video.nativeElement.videoHeight;
    this.canvas.nativeElement.width = w;
    this.canvas.nativeElement.height = h;
    const context: CanvasRenderingContext2D = this.canvas.nativeElement.getContext('2d', { willReadFrequently: true });
    context.drawImage(this.video.nativeElement, 0, 0, w, h);
    const img: ImageData = context.getImageData(0, 0, w, h);
    let qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
    if (qrCode) {
      if (qrCode.data !== '') {
        this.escaneando = false;
        this.mostrarDatosQROrdenados(qrCode.data);
        return true;
      }
    }
    return false;
  }

  public mostrarDatosQROrdenados(datosQR: string): void {
    this.datosQR = datosQR;
    this.asistencia = JSON.parse(datosQR);
    this.palabras = ['Has', 'quedado', 'presente', 'en', 'tu', 'clase!!'];
    this.indexPalabra = 0;
    this.filasVisibles = Array(this.palabras.length).fill(false); 
    this.mostrarPalabraPorTiempo();
  }

  public mostrarPalabraPorTiempo(): void {
    if (this.indexPalabra < this.palabras.length) {
      setTimeout(() => {
        
        this.filasVisibles[this.indexPalabra * 2] = true;   
        this.filasVisibles[this.indexPalabra * 2 + 1] = true; 
        this.indexPalabra++;
        this.mostrarPalabraPorTiempo();
      }, 333); 
    }
  }

  public mostrarPalabra(word: string): string {
    return this.indexPalabra > this.palabras.indexOf(word) ? 'inline' : 'none';
  }

  public mostrarColumna(columna: string): string {
    return 'table-cell'; 
  }

  public filaVisible(index: number): string {
    return this.filasVisibles[index] ? 'table-row' : 'none'; 
  }

  public detenerEscaneoQR(): void {
    this.escaneando = false;
  }

  

}

