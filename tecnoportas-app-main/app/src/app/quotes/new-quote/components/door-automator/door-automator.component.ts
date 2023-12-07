import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

import { IProductResponse } from '../../../../product-list/product.interfaces';
import { IQuoteItem } from '../../../quotes.interfaces';

@Component({
  selector: 'app-door-automator',
  templateUrl: './door-automator.component.html',
  styleUrls: ['./door-automator.component.scss'],
})
export class DoorAutomatorComponent implements OnInit {
  @Input()
  public quoteForm: { [key: string]: FormControl };

  @Input()
  public quoteItems: { [key: string]: (IQuoteItem | IProductResponse)[] };

  @Input()
  public loading: boolean;

  @Input()
  public saving: boolean;

  @Output()
  public previewsClick = new EventEmitter();

  @Output()
  public nextClick = new EventEmitter();

  constructor() { }

  ngOnInit() { }

  getDefaultImg(): IQuoteItem | undefined {
    const categoryId = this.quoteForm.engineCategory.value;
    const engineCategory = this.quoteItems.engineCategories.find(item => item.id === categoryId);
    if (engineCategory) {
      return engineCategory as IQuoteItem;
    }
    return undefined;
  }

  onPreviews() {
    this.previewsClick.emit();
  }

  onNextClick() {
    this.nextClick.emit();
  }

}
