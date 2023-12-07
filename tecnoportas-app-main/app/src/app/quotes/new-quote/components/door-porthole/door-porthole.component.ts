import { Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AlertController } from '@ionic/angular';

import { IUserData } from '../../../../global/auth.service';
import { IProductResponse } from '../../../../product-list/product.interfaces';
import { QuotesService } from '../../../../quotes/quotes.service';
import { IDefaultProduct, IEngineData, IQuoteItem } from '../../../quotes.interfaces';

@Component({
  selector: 'app-door-porthole',
  templateUrl: './door-porthole.component.html',
  styleUrls: ['./door-porthole.component.scss'],
})
export class DoorPortholeComponent implements OnInit {
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
    private ngZone: NgZone,
    private quotesService: QuotesService,
    private alertController: AlertController,
  ) { }

  ngOnInit() { }

  async removePortholePositions() {
    this.ngZone.run(() => {
      this.quoteItems.portholePositions = [];
      this.quoteForm.portholePosition.setValue('null');
    });
  }

  async getPortholePositions(portholeId: string) {
    this.changeSaving.emit(true);
    this.quoteForm.additionalPorthole.setValue(portholeId);
    Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].disable());

    this.removePortholePositions();

    this.ngZone.run(async () => {
      this.quoteItems.portholePositions = await this.quotesService.getQuoteItems(
        this.loggedUser,
        'pos',
        portholeId,
      );

      if (this.quoteItems.portholePositions.length) {
        this.quoteForm.portholePosition.setValue(this.quoteItems.portholePositions[0].id);
      }

      this.changeSaving.emit(false);
      Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].enable());
    });
  }

  onPreviews() {
    this.previewsClick.emit();
  }

  onNextClick() {
    this.nextClick.emit();
  }

  async onDoorPortholeClick() {
    this.changeSaving.emit(true);
    Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].disable());

    let doorPorthole: IDefaultProduct;

    if (this.quoteForm.additionalPorthole.value !== 'null') {
      try {
        const typeId = this.quoteForm.additionalPorthole.value;
        const positionId = this.quoteForm.portholePosition.value;

        const doorPortholes = await this.quotesService.getDoorPortholes({
          doorTypeId: this.quoteForm.doorType.value,
          typeId,
          positionId: positionId !== 'null' ? positionId : null,
        }, this.loggedUser);

        if (doorPortholes.length > 0) {
          doorPorthole = doorPortholes[0];
        }
        else {
          const message = await this.alertController.create({
            header: 'Atenção:',
            message: 'Nenhuma Entrada Corresponde a Esses Atributos! Tente usar outros atributos para continuar seu orçamento.',
            buttons: ['OK'],
          });
          await message.present();

          this.changeSaving.emit(false);
          Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].enable());
          return;
        }
      }
      catch (e) { }
    }

    this.quoteData.additionalPorthole = doorPorthole;

    this.changeSaving.emit(false);
    Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].enable());
    this.onNextClick();
  }

}
