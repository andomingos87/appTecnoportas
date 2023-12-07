import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonModal, Platform, ToastController } from '@ionic/angular';
import { Chart } from 'chart.js';

import { AuthService, IUserData } from '../../global/auth.service';
import { ALL_MONTHS, DEFAULT_BACK_BUTTON_LABEL, IOS_BACK_BUTTON_LABEL } from '../../global/global.constants';
import { PdfModalComponent } from '../quote-pdf/components/pdf-modal/pdf-modal.component';
import { IQuoteData, IQuoteFilters } from '../quotes.interfaces';
import { QuotesService } from '../quotes.service';

@Component({
  selector: 'app-my-quotes',
  templateUrl: './my-quotes.page.html',
  styleUrls: ['./my-quotes.page.scss'],
})
export class MyQuotesPage implements AfterViewInit, OnDestroy {
  @ViewChild('pieChart')
  private pieChart: ElementRef<HTMLCanvasElement>;

  @ViewChild('quoteDetails')
  private quoteDetailsModal: IonModal;

  @ViewChild('quoteEdit')
  private quoteEditModal: IonModal;

  @ViewChild('quotePdf')
  private quotePdfModal: PdfModalComponent;

  public pieChartElement: Chart;
  public conversionRate = 0;

  public backButtonText = DEFAULT_BACK_BUTTON_LABEL;

  public loggedUser: IUserData;
  public form = {
    search: new FormControl(''),
    status: new FormControl(),
    month: new FormControl(),
    year: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
  };

  public quotesList = [];
  public quotesSettings: { expand: boolean }[];
  public selectedQuote?: IQuoteData;

  public empty = false;
  public searchTerm: string;
  public allStatus: string[] = [];
  public allMonths = ALL_MONTHS;
  public showFilters = false;

  private searchTime: any;
  private quoteListener: number;

  constructor(
    private router: Router,
    private authService: AuthService,
    private platform: Platform,
    private alertController: AlertController,
    private toastController: ToastController,
    private quotesService: QuotesService,
  ) {
    this.loggedUser = this.authService.getLoggedUser();
    this.allStatus = this.quotesService.allStatus;
  }

  async ngAfterViewInit() {
    this.backButtonText = this.platform.is('ios') ? IOS_BACK_BUTTON_LABEL : this.backButtonText;
    await this.getAllQuotes();
    this.quoteListener = this.quotesService.onQuotesChange((() => {
      this.quotesList = [];
      setTimeout(this.getAllQuotes.bind(this), 1000);
    }).bind(this));
  }

  ngOnDestroy(): void {
    this.quotesService.removeQuotesChangeListener(this.quoteListener);
  }

  async changeQuoteStatus(quote: IQuoteData, toStatusId: string) {
    const alert = await this.alertController.create({
      header: 'Aguarde um momento...',
      message: `Atualizando o status do orçamento ${quote.id}`,
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
        quote.id,
        toStatusId,
        this.loggedUser,
      );

      if (result.msg?.toLowerCase().indexOf('status alterado') > -1) {
        const toast = await this.toastController.create({
          color: 'success',
          message: `O status foi atualizado com sucesso!`,
          duration: 2000,
        });
        await toast.present();
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

  async getAllQuotes() {
    const filters: IQuoteFilters = {
      month: null,
      status: null,
      year: null,
    };

    this.empty = false;
    this.searchTime = undefined;
    this.quotesList = [];

    this.form.search.disable();

    if (this.form.month.value >= 0) {
      filters.month = this.form.month.value;
    }

    if (this.form.status.value >= 0) {
      filters.status = this.form.status.value;
    }

    if (this.form.year.valid && this.form.year.value) {
      filters.year = this.form.year.value;
    }

    const quotes = this.filterBySearch(await this.quotesService.getAll(this.loggedUser, filters));
    this.quotesSettings = quotes.map(() => ({ expand: false }));
    this.quotesList = quotes;

    if (this.form.search.value) {
      this.searchTerm = `Orçamentos com: ${this.form.search.value}`;
    }

    if (this.quotesList.length === 0) {
      this.empty = true;
    }

    this.createPieChart(filters);

    this.form.search.enable();
  }

  async createPieChart(filters: IQuoteFilters) {
    if (this.pieChartElement) {
      this.pieChartElement.destroy();
    }
    this.pieChartElement = undefined;
    this.conversionRate = 0;

    const quotes = await this.quotesService.getAll(this.loggedUser, { ...filters, status: null });

    if (quotes.length) {
      const pending = quotes.filter(item => item.status === 'Pendente');
      const canceled = quotes.filter(item => item.status === 'Cancelado');
      const finished = quotes.filter(item => item.status === 'Concluído');

      this.conversionRate = Math.round((finished.length * 100) / quotes.length);

      this.pieChartElement = new Chart(this.pieChart.nativeElement, {
        type: 'pie',
        data: {
          labels: ['Pendentes', 'Cancelados', 'Finalizados'],
          datasets: [{
            label: 'Orçamentos',
            data: [pending.length, canceled.length, finished.length],
            backgroundColor: ['#ffff57', 'lightcoral', 'lightgreen'],
            hoverBackgroundColor: 'grey',
          }],
        },
        options: {
          layout: {
            padding: {
              top: 10,
              bottom: 10
            }
          },
          animation: {
            duration: 1000
          }
        }
      });
    }
  }

  getIcon(quote: IQuoteData) {
    if (quote.status === 'Pendente') {
      return 'time-outline';
    }
    if (quote.status === 'Concluído') {
      return 'checkmark-circle-outline';
    }
    return 'close-circle-outline';
  }

  getColor(quote: IQuoteData) {
    if (quote.status === 'Pendente') {
      return 'warning';
    }
    if (quote.status === 'Concluído') {
      return 'success';
    }
    return 'danger';
  }

  getDate(quote: IQuoteData) {
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

    return `${day}/${month}/${year}`;
  }

  getTime(quote: IQuoteData) {
    return quote.dt_cadastro.split(' ')[1];
  }

  onShowFiltersClick() {
    this.showFilters = !this.showFilters;
  }

  onResetFiltersClick() {
    this.form.status.setValue(undefined);
    this.form.month.setValue(undefined);
    this.form.year.setValue('');
    this.form.search.setValue('');
  }

  onNewQuoteClick() {
    this.router.navigate(['/new-quote']);
  }

  async onDetailsClick(quote: IQuoteData) {
    this.selectedQuote = quote;
    await this.quoteDetailsModal.present();
  }

  async onEditClick(quote: IQuoteData) {
    this.selectedQuote = quote;
    await this.quoteEditModal.present();
  }

  async onCancelClick(quote: IQuoteData) {
    if (quote.status === this.allStatus[1]) {
      const alert = await this.alertController.create({
        header: 'Confirmar Alteração...',
        message: `Você quer confirmar a alteração do status do orçamento ${quote.id}
         de ${quote.status} para ${this.allStatus[0]}?`,
        buttons: ['Não', {
          text: 'Sim',
          handler: () => this.changeQuoteStatus(quote, '0'),
        }],
      });
      await alert.present();
    }
  }

  async closeDetailsModal() {
    await this.quoteDetailsModal.dismiss(null, 'cancel');
  }

  async closeEditModal() {
    await this.quoteEditModal.dismiss(null, 'cancel');
  }

  async onOpenQuotePdfClick() {
    await this.closeDetailsModal();
    await this.quotePdfModal.show();
  }

  onExpandClick(index: number) {
    this.quotesSettings[index] = {
      ...this.quotesSettings[index],
      expand: !this.quotesSettings[index].expand,
    };
  }

  onFilterChange() {
    if (this.form.year.value && this.form.year.value.toString().length < 4) {
      this.form.year.setErrors({ invalid: true });
      return;
    }
    else {
      this.form.year.setErrors(null);
      this.getAllQuotes();
    }
  }

  onSearchChange() {
    if (this.searchTime) {
      clearInterval(this.searchTime);
      this.searchTime = undefined;
    }
    this.searchTime = setTimeout(this.getAllQuotes.bind(this), 1000);
  }

  private filterBySearch(items) {
    const search = this.form.search.value?.trim()?.toLowerCase();
    let result = items;

    if (search) {
      result = items.filter(
        item => Object.keys(item).filter(
          key => item[key]?.toLowerCase().indexOf(search) > -1
        ).length,
      );
    }

    return result;
  }
}
