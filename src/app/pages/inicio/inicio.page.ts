import { CorreoPage } from './../correo/correo.page';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { NivelEducacional } from 'src/app/model/nivel-educacional';
import { Usuario } from 'src/app/model/usuario';
import { AnimationController} from '@ionic/angular';
import { animate, animation, state, style, transition, trigger } from '@angular/animations';
import jsQR, { QRCode } from 'jsqr';
import { Asistencia } from 'src/app/interfaces/asistencia';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
})

export class InicioPage implements AfterViewInit {

  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  @ViewChild('page', { read: ElementRef }) page!: ElementRef;
  @ViewChild('mensajeQR', {read: ElementRef})itemMensajeQR! : ElementRef;
  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;
  
  public usuario: Usuario;
  cardElements: any;
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
