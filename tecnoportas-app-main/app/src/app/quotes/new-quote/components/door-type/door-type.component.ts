import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';

import { IUserData } from '../../../../global/auth.service';
import { IProductResponse } from '../../../../product-list/product.interfaces';
import { IEngineData, IQuoteItem } from '../../../quotes.interfaces';
import { QuotesService } from '../../../quotes.service';

@Component({
  selector: 'app-door-type',
  templateUrl: './door-type.component.html',
  styleUrls: ['./door-type.component.scss'],
})
export class DoorTypeComponent implements OnInit {
  @Input()
  public quoteForm: { [key: string]: FormControl };

  @Input()
  public quoteData: { [key: string]: IProductResponse | IEngineData };

  @Input()
  public quoteItems: { [key: string]: (IQuoteItem | IProductResponse)[] };

  @Input()
  public loggedUser: IUserData;

  @Input()
  public loading: boolean;

  @Input()
  public saving: boolean;

  @Output()
  public previewsClick = new EventEmitter();

  @Output()
  public nextClick = new EventEmitter();

  @Output()
  public changeSaving = new EventEmitter<boolean>();

  @Output()
  public setDoorProfile = new EventEmitter<IProductResponse>();

  constructor(
    private quotesService: QuotesService,
    private alertController: AlertController,
  ) { }

  ngOnInit() { }

  formIsValid() {
    const allFields = Object.keys(this.quoteForm);
    const ignoredFields = allFields.filter(
      key => ['doorType', 'doorSize'].indexOf(key) === -1,
    );

    return Object.keys(this.quoteForm)
      .filter(key => ignoredFields.indexOf(key) === -1)
      .filter(key => (this.quoteForm[key] as FormControl).invalid).length === 0;
  }

  async onGetDoorProfileClick() {
    this.changeSaving.emit(true);
    Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].disable());

    try {
      const profile = await this.quotesService.getDoorProfile(
        this.quoteForm.doorType.value,
        this.quoteForm.doorSize.value,
        this.loggedUser,
      );

      if (profile) {
        this.setDoorProfile.emit(profile);
        this.changeSaving.emit(false);
        Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].enable());
        this.onNextClick();
        return;
      }
      else {
        const message = await this.alertController.create({
          header: 'Atenção:',
          message: 'Nenhum Perfil Corresponde a Esses Atributos! Tente usar outros atributos para continuar seu orçamento.',
          buttons: ['OK'],
        });
        await message.present();
      }
    }
    catch (e) {
      const error = await this.alertController.create({
        header: 'Erro:',
        message: e?.message || 'Não foi possível encontrar o perfil do portão agora, tente novamente mais tarde.',
        buttons: ['OK'],
      });
      await error.present();
    }

    this.changeSaving.emit(false);
    Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].enable());
  }

  onPreviews() {
    this.previewsClick.emit();
  }

  onNextClick() {
    this.nextClick.emit();
  }

}
