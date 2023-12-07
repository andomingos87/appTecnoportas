import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { IUserData } from '../../../../global/auth.service';
import { IProductResponse } from '../../../../product-list/product.interfaces';
import { QuotesService } from '../../../../quotes/quotes.service';
import { IEngineData, IProductsConditionParams, IQuoteItem } from '../../../quotes.interfaces';

@Component({
  selector: 'app-door-paint',
  templateUrl: './door-paint.component.html',
  styleUrls: ['./door-paint.component.scss'],
})
export class DoorPaintComponent implements OnInit {
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
  ) { }

  ngOnInit() { }

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

  async onDoorPaintClick() {
    this.changeSaving.emit(true);
    Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].disable());

    let paintId = this.quoteForm.additionalPaint.value;

    if (paintId === 'null') {
      paintId = null;
    }

    const pvcs = await this.quotesService.getValidDefaultProducts({
      ...this.getQuoteConditionalVariables(),
      products: (await this.quotesService.getDoorPVCItems(paintId, this.loggedUser)),
    } as IProductsConditionParams);

    if (pvcs.length) {
      this.quoteData.doorPVC = pvcs[0];
    }

    this.changeSaving.emit(false);
    Object.keys(this.quoteForm).forEach(key => this.quoteForm[key].enable());
    this.onNextClick();
  }

  onPreviews() {
    this.previewsClick.emit();
  }

  onNextClick() {
    this.nextClick.emit();
  }

}
