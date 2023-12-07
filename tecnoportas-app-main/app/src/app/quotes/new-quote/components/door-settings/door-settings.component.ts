import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { AlertController, IonInput } from '@ionic/angular';

import { numberToDecimalFormat } from '../../../../global/global.helpers';
import { IProductResponse } from '../../../../product-list/product.interfaces';
import { IQuoteItem } from '../../../quotes.interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-door-settings',
  templateUrl: './door-settings.component.html',
  styleUrls: ['./door-settings.component.scss'],
})
export class DoorSettingsComponent implements OnInit {
  @Input()
  public quoteForm: { [key: string]: FormControl };

  @Input()
  public quoteItems: { [key: string]: (IQuoteItem | IProductResponse)[] };

  @Input()
  public loading: boolean;

  @Input()
  public saving: boolean;

  @Input()
  public invalidSize: boolean;

  @Output()
  public previewsClick = new EventEmitter();

  @Output()
  public nextClick = new EventEmitter();

  public quoteDoors = new Array(9);

  public subscribers : Subject<boolean> = new Subject();

  constructor(
    private alertController: AlertController,
  ) { }

  ngOnInit() {

    this.quoteForm.width.valueChanges
      .pipe(takeUntil(this.subscribers))
      .subscribe(value => {
        this.checkDoorSize();
      })

    this.quoteForm.height.valueChanges
      .pipe(takeUntil(this.subscribers))
      .subscribe(value => {
        this.checkDoorSize();
      })
  }

  formIsValid() {
    const allFields = Object.keys(this.quoteForm);
    const ignoredFields = allFields.filter(
      key => ['doors', 'width', 'height', 'typeOfInstall'].indexOf(key) === -1,
    );

    return Object.keys(this.quoteForm)
      .filter(key => ignoredFields.indexOf(key) === -1)
      .filter(key => (this.quoteForm[key] as FormControl).invalid).length === 0;
  }

  onDecimalChange(object: IonInput) {
    numberToDecimalFormat(object, '.', 2);
  }

  checkDoorSize(){
    this.invalidSize = false;

    if(this.quoteForm.width.value > 9.5 || this.quoteForm.height.value > 6.5){
        this.invalidSize = true;
    }
  }

  ngOnDestroy(): void {
    this.subscribers.next(true);
    this.subscribers.complete();
  }

  onPreviews() {
    this.previewsClick.emit();
  }

  onNextClick() {
    if(this.invalidSize){
      this.showInvalidSizeAlert();
      return;
    }
    this.nextClick.emit();
  }

  async showInvalidSizeAlert() {
    const alert = await this.alertController.create({
      header: 'Atenção!',
      message: `Para orçar portas com essa medida é necessário entrar em contato com seu Representante Tecnoportas!`,
      buttons: ['OK'],
    });

    await alert.present();
  }

}
