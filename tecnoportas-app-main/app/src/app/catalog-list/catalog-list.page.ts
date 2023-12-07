import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonModal, Platform } from '@ionic/angular';

import { GeneralService, IFileResult } from '../global/general.service';
import { DEFAULT_BACK_BUTTON_LABEL, IOS_BACK_BUTTON_LABEL } from '../global/global.constants';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.page.html',
  styleUrls: ['./catalog-list.page.scss'],
})
export class CatalogListPage implements OnInit {
  @ViewChild(IonModal)
  private modal: IonModal;

  public backButtonText = DEFAULT_BACK_BUTTON_LABEL;
  public catalogList: IFileResult[] = [];
  public selectedFile: IFileResult;
  public selectedFileBlob: Blob;
  public empty = false;

  constructor(
    private platform: Platform,
    private alertController: AlertController,
    private general: GeneralService,
  ) { }

  async ngOnInit() {
    this.backButtonText = this.platform.is('ios') ? IOS_BACK_BUTTON_LABEL : this.backButtonText;
    const configs = await this.general.getAllAppConfigs();
    const catalogTypeId = configs.catalogo;
    const files = await this.general.getApiFilesByType(catalogTypeId);
    this.catalogList = files;
    if (this.catalogList.length === 0) {
      this.empty = true;
    }
  }

  dateFormat(item: IFileResult) {
    return new Date(item.dt_cad).toLocaleString();
  }

  closeModal() {
    this.modal.dismiss(null, 'cancel');
    this.selectedFile = undefined;
    this.selectedFileBlob = undefined;
  }

  async onClick(item: IFileResult) {
    const alert = await this.alertController.create({
      header: 'Aguarde um momento...',
      message: `Abrindo ${item.nome}`,
      backdropDismiss: false,
    });

    await alert.present();

    try {
      this.selectedFile = item;
      this.selectedFileBlob = await this.general.downloadFile(item.arquivo);
      await this.modal.present();
      alert.dismiss();
    }
    catch (e) {
      alert.dismiss();

      const errorMessage = await this.alertController.create({
        header: 'Erro ao abrir o catálogo!',
        message: `Não foi possível abrir ${item.nome} no momento, tente novamente mais tarde.`,
        buttons: ['OK'],
      });

      await errorMessage.present();
    }
  }

}
