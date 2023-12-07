import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';

import { IUserData } from '../../../../global/auth.service';
import { IProductResponse } from '../../../../product-list/product.interfaces';
import { QuotesService } from '../../../../quotes/quotes.service';
import { IEngineConditionParams, IEngineData, IQuoteItem } from '../../../quotes.interfaces';

@Component({
  selector: 'app-door-engine-type',
  templateUrl: './door-engine-type.component.html',
  styleUrls: ['./door-engine-type.component.scss'],
})
export class DoorEngineTypeComponent implements OnInit {
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

  constructor(
    private quotesService: QuotesService,
    private alertController: AlertController,
  ) { }

  ngOnInit() { }

  formIsValid() {
    const allFields = Object.keys(this.quoteForm);
    const ignoredFields = allFields.filter(key => ['engineCategory'].indexOf(key) === -1);

    return Object.keys(this.quoteForm)
      .filter(key => ignoredFields.indexOf(key) === -1)
      .filter(key => (this.quoteForm[key] as FormControl).invalid).length === 0;
  }

  getQuoteConditionalVariables() {
    const height = this.quoteForm.height.value;
    const width = this.quoteForm.width.value;

    return {
      ...this.quotesService.calculateDoorSettings(
        height, width, this.quoteData.doorProfile.peso_m2,
      ),
      doors: this.quoteForm.doors.value.toString(),
      doorTypeId: this.quoteForm.doorType.value,
      typeOfInstallId: this.quoteForm.typeOfInstall.value,
    };
  }

  async onCategoryEngineClick() {
    this.changeSaving.emit(true);
    Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].disable());

    try {
      const engines = await this.quotesService.getEngines(
        this.quoteForm.engineCategory.value,
        this.loggedUser,
      );

      if (engines.length > 0) {
        for (const engine of engines) {
          const conditionsResult = await this.quotesService.engineConditionsCalculate({
            ...this.getQuoteConditionalVariables(),
            engine,
          } as IEngineConditionParams);

          if (conditionsResult === true) {
            this.quoteData.engine = engine;
            break;
          }
        }

        if (!this.quoteData.engine) {
          const message = await this.alertController.create({
            header: 'Atenção:',
            message: 'Nenhum motor adequado para o seu portão foi encontrado! Tente usar outros atributos para continuar seu orçamento.',
            buttons: ['OK'],
          });
          await message.present();

          this.changeSaving.emit(false);
          Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].enable());
          return;
        }

        const engineHeader = await this.quotesService.getEngineHeader(this.quoteData.engine.id, this.loggedUser);

        if (!engineHeader) {
          const message = await this.alertController.create({
            header: 'Atenção:',
            message: 'Não encontramos a testeira adequada para seu portão! Tente usar outros atributos para continuar seu orçamento.',
            buttons: ['OK'],
          });
          await message.present();

          this.changeSaving.emit(false);
          Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].enable());
          return;
        }

        this.quoteData.engineHeader = { ...engineHeader, tipo: 'tst' };

        this.changeSaving.emit(false);
        Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].enable());
        this.onNextClick();
        return;
      }
      else {
        const message = await this.alertController.create({
          header: 'Atenção:',
          message: 'Nenhum Motor Encontrado! Tente novamente mais tarde.',
          buttons: ['OK'],
        });
        await message.present();
      }
    }
    catch (e) {
      const error = await this.alertController.create({
        header: 'Erro:',
        message: e?.message || 'Não foi possível encontrar o motor do portão agora, tente novamente mais tarde.',
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
