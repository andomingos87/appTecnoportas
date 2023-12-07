import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import Big from 'big.js';
import { toJpeg } from 'html-to-image';
import jsPDF from 'jspdf';
import { Subscription } from 'rxjs';
import SwiperCore, { SwiperOptions, Zoom } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

import { AuthService, IUserData } from '../../global/auth.service';
import { GeneralService, IGeneralConfigs } from '../../global/general.service';
import { IQuotePdfResponse, IQuoteProduct } from '../quotes.interfaces';
import { QuotesService } from '../quotes.service';
import { PdfModalComponent } from './components/pdf-modal/pdf-modal.component';

SwiperCore.use([Zoom]);

@Component({
  selector: 'app-quote-pdf',
  templateUrl: './quote-pdf.page.html',
  styleUrls: ['./quote-pdf.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class QuotePdfPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('zoomContainer')
  public swiperComponent: SwiperComponent;

  @ViewChild('pdfDiv')
  public pdfDiv: ElementRef<HTMLDivElement>;

  @ViewChild('pdfModal')
  public pdfModal: PdfModalComponent;

  public loggedUser: IUserData;
  public configs: IGeneralConfigs;
  public swiperConfig: SwiperOptions = {
    grabCursor: true,
    centeredSlides: true,
    zoom: {
      maxRatio: 3,
      minRatio: 1,
    },
  };

  public quoteId: string;
  public action: string;
  public loading = false;
  public quote: IQuotePdfResponse;

  private routeSubscribe: Subscription;

  constructor(
    @Inject(DOCUMENT)
    private document: Document,
    private route: ActivatedRoute,
    private router: Router,
    private quotesService: QuotesService,
    private authService: AuthService,
    private general: GeneralService,
    private alertController: AlertController,
  ) {
    this.loggedUser = this.authService.getLoggedUser();
  }

  async ngOnInit() {
    this.routeSubscribe = this.route.params.subscribe(params =>
      this.getRouteParams(params)
    );
  }

  ngAfterViewInit() {
    this.document.defaultView.addEventListener('resize', this.setDocumentScale.bind(this));
  }

  ngOnDestroy() {
    this.document.defaultView.removeEventListener('resize', this.setDocumentScale.bind(this));
    if (this.routeSubscribe) {
      this.routeSubscribe.unsubscribe();
    }
  }

  async getRouteParams(params: Params) {
    const loadingMessage = await this.alertController.create({
      header: 'Aguarde um momento...',
      message: `Criando o PDF`,
      backdropDismiss: false,
    });

    await loadingMessage.present();

    this.quoteId = params.id;
    this.action = params.action;
    this.loading = true;
    this.quote = undefined;

    const check = await this.quotesService.getOne(this.quoteId, this.loggedUser);

    if (check.orcamento.pdf) {
      loadingMessage.dismiss();
      this.loading = false;

      const errorMessage = await this.alertController.create({
        header: 'Não é possível continuar',
        message: `O PDF desse orçamento já foi criado.`,
        buttons: [{
          text: 'OK',
          handler: () => this.router.navigate(['/my-quotes'], { replaceUrl: true }),
        }],
      });

      await errorMessage.present();
      return;
    }

    try {
      this.quote = await this.quotesService.getPdfData(this.quoteId, this.loggedUser);
      this.configs = await this.general.getAllAppConfigs();

      await new Promise<void>(success => {
        setTimeout((() => {
          this.setDocumentScale();
          this.loading = false;
          success();
        }).bind(this), 1200);
      });

      const pdfData = await this.generatePdfBase64();

      const fileName = await this.quotesService.uploadPdfDocument(this.quoteId, pdfData, this.loggedUser);
      await this.quotesService.sendEmailWithPDF(this.quoteId, fileName, this.loggedUser);

      if (this.action === 'open') {
        this.pdfModal.show();
      }
      else {
        this.router.navigate(['/my-quotes'], { replaceUrl: true });
      }

      loadingMessage.dismiss();
    }
    catch (e) {
      loadingMessage.dismiss();
      this.loading = false;

      const error = await this.alertController.create({
        header: 'Erro ao criar o PDF',
        message: `Não foi possível criar esse PDF no momento, tente novamente mais tarde.`,
        buttons: [{
          text: 'OK',
          handler: () => this.router.navigate(['/my-quotes'], { replaceUrl: true }),
        }],
      });

      await error.present();
    }
  }

  setDocumentScale() {
    const element: HTMLDivElement = this.document.querySelector('.swiper-zoom-container');
    const container = this.document.getElementById('pdfContainer');
    const zoomImg = this.document.getElementById('zoomImg');

    if (element) {
      const height = 1080;
      const width = 763.63;
      const windowHeight = this.document.defaultView.innerHeight;
      const windowWidth = this.document.defaultView.innerWidth;

      let newScale = '1';

      if (windowHeight > windowWidth) {
        newScale = ((windowWidth - 10) / width).toString();
      }
      else {
        newScale = ((windowHeight - 80) / height).toString();
      }

      element.style.scale = newScale;

      zoomImg.style.height = `${container.scrollHeight}px`;
      element.style.height = `${container.scrollHeight}px`;
      container.style.height = `${container.scrollHeight}px`;
    }
  }

  getName(fromCustomer = true) {
    const quote = this.quote.orcamento_data;

    const type = fromCustomer ? quote.cli_tipo : quote.se_tipo;
    let result = fromCustomer ? quote.cli_nome : quote.se_nome;

    if (type === 'f') {
      if (fromCustomer) {
        result = `${quote.cli_nome} ${quote.cli_snome}`;
      }
      else {
        result = `${quote.se_nome} ${quote.se_snome}`;
      }
    }

    return result.toUpperCase();
  }

  getSellerName() {
    if (this.loggedUser.ct_nome) {
      return `${this.loggedUser.ct_nome} ${this.loggedUser.ct_snome}`;
    }

    if (this.loggedUser.tipo === 'f') {
      return `${this.loggedUser.nome} ${this.loggedUser.sobrenome}`;
    }

    return this.loggedUser.nome;
  }

  getAddress(fromCustomer = true) {
    const quote = this.quote.orcamento_data;

    let city = quote.cidade;
    let uf = quote.estado;
    let cep = quote.cep;
    let address = quote.logradouro;
    let neighborhood = quote.bairro;
    let addressNumber = quote.numero;

    if (fromCustomer === false) {
      city = this.loggedUser.cidade;
      uf = this.loggedUser.uf;
      cep = this.loggedUser.cep;
      address = this.loggedUser.logradouro;
      neighborhood = this.loggedUser.bairro;
      addressNumber = this.loggedUser.numero;
    }

    let result = `${city} - ${uf}`;

    if (cep && cep !== 'NULL') {
      if (neighborhood && neighborhood !== 'NULL') {
        result = `${address}, ${addressNumber} - ${neighborhood}<br/>${cep} - ${city} - ${uf}`;
      }
      else {
        result = `${address}, ${addressNumber}<br/>${cep} - ${city} - ${uf}`;
      }
    }

    return result.toUpperCase();
  }

  getPhone(fromCustomer = true) {
    const quote = this.quote.orcamento_data;
    let ddd = quote.telefone_ddd;
    let num = quote.telefone_num;

    if (fromCustomer === false) {
      ddd = this.loggedUser.ddd;
      num = this.loggedUser.tel_num;
    }

    if (!ddd || !num || ddd === '0') {
      return undefined;
    }

    let result = `(${ddd})`;

    if (num.length > 8) {
      result = `${result} ${num.substring(0, 5)}-${num.substring(5)}`;
      return result;
    }

    result = `${result} ${num.substring(0, 4)}-${num.substring(4)}`;
    return result;
  }

  getDateTime() {
    const quote = this.quote.orcamento_data;
    const time = quote.dt_cadastro.split(' ')[1];

    const dt = new Date(quote.dt_cadastro);
    const year: any = dt.getFullYear();
    let day: any = dt.getDate();
    let month: any = dt.getMonth() + 1;

    if (day < 10) {
      day = '0' + day;
    }

    if (month < 10) {
      month = '0' + month;
    }

    return `${day}/${month}/${year} às ${time}`;
  }

  getQuoteValidate() {
    const quote = this.quote.orcamento_data;
    const dt = new Date(quote.dt_cadastro);

    dt.setDate(dt.getDate() + 30);

    const year: any = dt.getFullYear();
    let day: any = dt.getDate();
    let month: any = dt.getMonth() + 1;

    if (day < 10) {
      day = '0' + day;
    }

    if (month < 10) {
      month = '0' + month;
    }

    return `${day}/${month}/${year}`;
  }

  getAdditionalHeight() {
    const quote = this.quote.orcamento_data;
    return (Number(quote.largura) < 8.5 ? 0.60 : 0.90).toFixed(3);
  }

  getDoorHeight() {
    const quote = this.quote.orcamento_data;
    return Big(quote.altura).sub(this.getAdditionalHeight()).toFixed(3);
  }

  getDoorM2() {
    const quote = this.quote.orcamento_data;
    return Big(quote.altura).times(quote.largura).toFixed(3);
  }

  getProductCode(product: IQuoteProduct) {
    if (!product.codigo) {
      switch (product.tipo) {
        case 'mto': return product.mto_id;
        case 'aut': return product.aut_id;
        case 'ptr': return product.ptr_id;
        default: return product.id;
      }
    }

    return product.codigo;
  }

  getProductName(product: IQuoteProduct) {
    switch (product.tipo) {
      case 'mto':
        if (product.nome.toLowerCase().indexOf('motor') === -1) {
          return 'Motor ' + product.nome;
        }
        break;
      case 'ptr':
        if (product.nome.toLowerCase().indexOf('pintura') === -1) {
          return 'Pintura ' + product.nome;
        }
        break;
    }
    return product.nome;
  }

  generatePdfBase64(): Promise<string> {
    return new Promise(async success => {
      const pageHeight = 297;
      const imageData = await toJpeg(this.pdfDiv.nativeElement, {
        backgroundColor: '#ffffff',
        quality: 0.5
      });
      const imageElement = new Image();

      imageElement.onload = (() => {
        const imageWidth = 210;
        const imageHeight = imageElement.height * (imageWidth / imageElement.width);
        let hasHeight = imageHeight;
        let position = 0;

        const document = new jsPDF('p', 'mm', 'a4');
        document.addImage(imageData, 'JPEG', 0, position, imageWidth, imageHeight);
        /* footer blank space */
        document.setDrawColor(0);
        document.setFillColor(255, 255, 255);
        document.rect(0, pageHeight - 6.5, imageWidth, 6.5, 'F');

        hasHeight -= pageHeight - 8.5;

        while (hasHeight > 0) {
          position = (hasHeight - imageHeight) + 10;
          document.addPage();
          document.addImage(imageData, 'JPEG', 0, position, imageWidth, imageHeight);
          /* header blank space */
          document.setDrawColor(0);
          document.setFillColor(255, 255, 255);
          document.rect(0, 0, imageWidth, 10, 'F');
          /* footer blank space */
          document.setDrawColor(0);
          document.setFillColor(255, 255, 255);
          document.rect(0, pageHeight - 6.5, imageWidth, 6.5, 'F');
          hasHeight -= pageHeight - 18.5;
        }

        const blobPDF = document.output('datauristring', { filename: `orcamento${this.quoteId}.pdf` });
        success(blobPDF);
      }).bind(this);

      imageElement.src = imageData;
    });
  }

  async onClosePdfModal() {
    this.router.navigate(['/my-quotes'], { replaceUrl: true });
  }
}
