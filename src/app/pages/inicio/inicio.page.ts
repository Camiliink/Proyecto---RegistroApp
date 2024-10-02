import { CorreoPage } from './../correo/correo.page';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Usuario } from 'src/app/model/usuario';
import { AnimationController } from '@ionic/angular';
import jsQR, { QRCode } from 'jsqr';

@Component({
  selector: 'app-inicio',
  templateUrl: 'inicio.page.html',
  styleUrls: ['inicio.page.scss'],
})

export class InicioPage implements AfterViewInit {
  @ViewChild('titulo', { read: ElementRef }) itemTitulo!: ElementRef;
  @ViewChild('video') private video!: ElementRef;
  @ViewChild('canvas') private canvas!: ElementRef;

  public usuario: Usuario;
  public escaneando = false;
  public datosQR: string = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertController: AlertController,
    private animationController: AnimationController
  ) {
    this.usuario = new Usuario();
    this.usuario.recibirUsuario(this.activatedRoute, this.router);
  }

  ngAfterViewInit() {
    this.animarTituloIzqDer();
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

  public async comenzarEscaneoQR() {
    const mediaProvider: MediaStream = await navigator.mediaDevices.getUserMedia({
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
    
    if (context) {
        context.drawImage(this.video.nativeElement, 0, 0, w, h);
        const img: ImageData = context.getImageData(0, 0, w, h);
        const qrCode: QRCode | null = jsQR(img.data, w, h, { inversionAttempts: 'dontInvert' });
        
        if (qrCode && qrCode.data !== '') {
            this.escaneando = false; // Detenemos el escaneo
            this.datosQR = qrCode.data; // Guardamos los datos del QR
            
            // Asegúrate de enviar solo cuenta y password
            this.router.navigate(['/miclases'], {
                state: { 
                    datosQR: this.datosQR, 
                    cuenta: this.usuario.cuenta,
                    password: this.usuario.password 
                }
            });

            return true; // QR escaneado con éxito
        }
    }
    
    return false; // No se pudo escanear un QR
}

  public detenerEscaneoQR(): void {
    this.escaneando = false;
  }
}
