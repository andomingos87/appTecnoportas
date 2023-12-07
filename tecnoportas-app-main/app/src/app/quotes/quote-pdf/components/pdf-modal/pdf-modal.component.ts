import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { AlertController, IonModal } from '@ionic/angular';
import { SocialSharing } from '@ionic-native/social-sharing';

import { IUserData } from '../../../../global/auth.service';
import { GeneralService } from '../../../../global/general.service';
import { QuotesService } from '../../../quotes.service';

@Component({
  selector: 'app-pdf-modal',
  templateUrl: './pdf-modal.component.html',
  styleUrls: ['./pdf-modal.component.scss'],
})
export class PdfModalComponent implements OnInit {

  @Input()
  public loggedUser: IUserData;

  @Input()
  public quoteId: string;

  @Output()
  public modalClosed = new EventEmitter();

  @ViewChild('quotePdf')
  private quotePdfModal: IonModal;

  public pdfBlob?: Blob;

  private socialSharing = SocialSharing;

  constructor(
    private general: GeneralService,
    private alertController: AlertController,
    private quotesService: QuotesService,
  ) { }

  ngOnInit() { }

  async show() {
    const alert = await this.alertController.create({
      header: 'Aguarde um momento...',
      message: `Abrindo o PDF`,
      backdropDismiss: false,
    });

    await alert.present();

    try {
      const quote = await this.quotesService.getOne(this.quoteId, this.loggedUser);
      this.pdfBlob = await this.general.downloadFile(quote.orcamento.pdf);
      alert.dismiss();
      await this.quotePdfModal.present();
    }
    catch (e) {
      alert.dismiss();

      const errorMessage = await this.alertController.create({
        header: 'Erro ao abrir o PDF!',
        message: `Não foi possível abrir o PDF no momento, tente novamente mais tarde.`,
        buttons: ['OK'],
      });

      await errorMessage.present();
    }
  }

  async onShareClick() {
    const configs = await this.general.getAllAppConfigs();
    const reader = new FileReader();
    reader.readAsDataURL(this.pdfBlob);

    reader.onloadend = () => {
      const base64data = reader.result;
      this.socialSharing.share(`Orçamento ${this.quoteId}`, configs.nome_empresa, base64data.toString());
    };
  }

  async onClose() {
    await this.quotePdfModal.dismiss(null, 'cancel');
    this.pdfBlob = undefined;
    this.modalClosed.emit();
  }

}
