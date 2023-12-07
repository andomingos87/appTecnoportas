import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, ToastController } from '@ionic/angular';

import { IUserData } from '../../../../global/auth.service';
import { IQuoteData, IQuoteDetailsResponse, IQuoteProduct } from '../../../quotes.interfaces';
import { QuotesService } from '../../../quotes.service';

@Component({
  selector: 'app-quote-details',
  templateUrl: './quote-details.component.html',
  styleUrls: ['./quote-details.component.scss'],
})
export class QuoteDetailsComponent implements OnInit {
  @Output()
  public closeClick = new EventEmitter();

  @Output()
  public openPdf = new EventEmitter<Blob>();

  @Input()
  public loggedUser: IUserData;

  @Input()
  public selectedQuote?: IQuoteData;

  public quoteDetails: IQuoteDetailsResponse;
  public products: IQuoteProduct[] = [];
  public noProducts = false;
  public productsSettings: { expand: boolean }[] = [];
  public loading = false;

  public form = {
    status: new FormControl(),
    motivo_cancelamento: new FormControl(),
  };
  public allStatus: string[] = [];
  public canceledMotives = {
    '1': 'Prazo',
    '2': 'Preço',
    '3': 'Atendimento',
    '4': 'Outros'
  }

  constructor(
    private router: Router,
    private quotesService: QuotesService,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    this.allStatus = this.quotesService.allStatus;
  }

  ngOnInit() {
    console.log(this.selectedQuote.status);
    this.form.status.setValue(
      this.allStatus.indexOf(this.selectedQuote.status),
    );
    this.getQuoteDetails();
  }

  async getQuoteDetails() {
    this.loading = true;
    this.noProducts = false;
    this.products = [];

    this.quoteDetails = await this.quotesService.getOne(this.selectedQuote.id, this.loggedUser);
    this.products = this.quoteDetails.produtos;
    this.productsSettings = this.products.map(() => ({ expand: false }));

    if (this.products.length === 0) {
      this.noProducts = true;
    }

    this.loading = false;
  }

  getProductQuantity(product: IQuoteProduct) {
    const split = product.quantidade.split('.');
    if (split[1] === '00') {
      return split[0];
    }
    return product.quantidade;
  }

  getDate() {
    const dt = new Date(this.selectedQuote.dt_cadastro);
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

  getTime() {
    return this.selectedQuote.dt_cadastro.split(' ')[1];
  }

  getColor() {
    if (this.form.status.value === this.allStatus.indexOf('Pendente')) {
      return 'warning';
    }
    if (this.form.status.value === this.allStatus.indexOf('Concluído')) {
      return 'success';
    }
    return 'danger';
  }

  getAdditionalHeight() {
    return this.quoteDetails?.orcamento?.largura ? (
      Number(this.quoteDetails.orcamento.largura) < 8.5 ? 0.6 : 0.9
    ) : 0;
  }

  async changeQuoteStatus(toStatusId: string, motivo_cancelamento? : string) {
    const alert = await this.alertController.create({
      header: 'Aguarde um momento...',
      message: `Atualizando o status do orçamento ${this.selectedQuote?.id}`,
      backdropDismiss: false,
    });

    await alert.present();

    const showErrorMessage = async () => {
      const errorMessage = await this.alertController.create({
        header: 'Erro ao atualizar o status!',
        message: `Não foi possível atualizar o status no momento, tente novamente mais tarde.`,
        buttons: ['OK'],
      });

      await errorMessage.present();
      this.form.status.setValue(
        this.allStatus.indexOf(this.selectedQuote.status),
      );
    };

    try {
      const result = await this.quotesService.updateStatus(
        this.selectedQuote?.id,
        toStatusId,
        this.loggedUser,
        motivo_cancelamento
      );

      if (result.msg?.toLowerCase().indexOf('status alterado') > -1) {
        const toast = await this.toastController.create({
          color: 'success',
          message: `O status foi atualizado com sucesso!`,
          duration: 2000,
        });
        await toast.present();
        if(motivo_cancelamento){
          this.selectedQuote.motivo_cancelamento = motivo_cancelamento;
          this.selectedQuote.status = 'Cancelado';
        }
      }
      else {
        showErrorMessage();
      }
      alert.dismiss();
    }
    catch (e) {
      showErrorMessage();
      alert.dismiss();
    }
  }

  onExpandClick(index: number) {
    this.productsSettings[index] = {
      ...this.productsSettings[index],
      expand: !this.productsSettings[index].expand,
    };
  }

  onCloseClick() {
    this.closeClick.emit();
  }

  async onChangeStatus() {
    const newStatus = this.form.status.value;
    const newStatusText = this.allStatus[newStatus];

    console.log(newStatus);

    if (newStatusText !== this.selectedQuote?.status) {

      if(newStatus == 0){
        const alert = await this.alertController.create({
          header: 'Motivo',
          buttons: [{
            text: 'Cancelar',
            handler: () => this.form.status.setValue(
              this.allStatus.indexOf(this.selectedQuote.status),
            ),
          }, {
            text: 'Sim',
            handler: (value) => this.changeQuoteStatus(newStatus, value),
          }],
          inputs: [
            {
              label: 'Prazo',
              type: 'radio',
              value: '1',
            },
            {
              label: 'Preço',
              type: 'radio',
              value: '2',
            },
            {
              label: 'Atendimento',
              type: 'radio',
              value: '3',
            },
            {
              label: 'Outros',
              type: 'radio',
              value: '4',
            },
          ]
        });
        await alert.present();

      }else{
        const alert = await this.alertController.create({
          header: 'Confirmar Alteração...',
          message: `Você quer confirmar a alteração do status do orçamento ${this.selectedQuote?.id}
           de ${this.selectedQuote?.status} para ${newStatusText}?`,
          buttons: [{
            text: 'Não',
            handler: () => this.form.status.setValue(
              this.allStatus.indexOf(this.selectedQuote.status),
            ),
          }, {
            text: 'Sim',
            handler: () => this.changeQuoteStatus(newStatus),
          }],
        });
        await alert.present();
      }

    }
  }

  async onOpenPdfClick() {
    if (this.quoteDetails.orcamento.pdf) {
      this.openPdf.emit();
    }
    else {
      this.onCloseClick();
      this.router.navigate(['/quote-pdf', this.quoteDetails.orcamento.id, 'open']);
    }
  }

}
