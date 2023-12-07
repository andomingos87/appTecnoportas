import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, IonContent, Platform, ToastController } from '@ionic/angular';
import { Subscription } from 'rxjs';

import { AuthService, IUserData } from '../../global/auth.service';
import { StepsComponent } from '../../global/components/steps/steps.component';
import { GeneralService } from '../../global/general.service';
import { DEFAULT_BACK_BUTTON_LABEL, IOS_BACK_BUTTON_LABEL } from '../../global/global.constants';
import { CustomerFormComponent } from '../../my-customers/components/customer-form/customer-form.component';
import { CustomersService, ICustomerResponse } from '../../my-customers/customers.service';
import { IProductResponse } from '../../product-list/product.interfaces';
import { IEngineData, IQuoteItem, IQuoteItemTypes } from '../quotes.interfaces';
import { QuotesService } from '../quotes.service';
import { DoorPaintComponent } from './components/door-paint/door-paint.component';
import { DoorPortholeComponent } from './components/door-porthole/door-porthole.component';
import { MaterialListComponent } from './components/material-list/material-list.component';

@Component({
  selector: 'app-new-quote',
  templateUrl: './new-quote.page.html',
  styleUrls: ['./new-quote.page.scss'],
})
export class NewQuotePage implements AfterViewInit, OnDestroy {
  @ViewChild('content')
  public content: IonContent;

  @ViewChild('steps')
  public steps: StepsComponent;

  @ViewChild('customerForm')
  public customerFormComponent: CustomerFormComponent;

  @ViewChild(DoorPortholeComponent)
  public doorPorthole: DoorPortholeComponent;

  @ViewChild(MaterialListComponent)
  public materialList: MaterialListComponent;

  @ViewChild(DoorPaintComponent)
  public doorPaint: DoorPaintComponent;

  public loggedUser: IUserData;

  public backButtonText = DEFAULT_BACK_BUTTON_LABEL;

  public saving = false;
  public loading = false;
  public changing = false;
  public showFloating = false;
  public showGoToTop = false;
  public quoteItems: { [key: string]: (IQuoteItem | IProductResponse)[] } = {
    installTypes: [],
    doorTypes: [],
    doorSizes: [],
    engineCategories: [],
    engineAutomators: [],
    additionalPortholes: [],
    portholePositions: [],
    doorPaints: [],
  };

  public quoteData: { [key: string]: IProductResponse | IEngineData } = {
    doorProfile: undefined,
    engine: undefined,
    engineHeader: undefined,
    doorPVC: undefined,
    additionalPorthole: undefined,
  };

  public quoteForm = {
    height: new FormControl(undefined, [Validators.required, Validators.min(0.01)]),
    width: new FormControl(undefined, [Validators.required, Validators.min(0.01)]),
    doors: new FormControl(1, [Validators.required]),
    typeOfInstall: new FormControl(undefined, [Validators.required]),
    doorType: new FormControl(undefined, [Validators.required]),
    doorSize: new FormControl(undefined, [Validators.required]),
    engineCategory: new FormControl(undefined, [Validators.required]),
    engineAutomator: new FormControl('null'),
    additionalPorthole: new FormControl('null'),
    portholePosition: new FormControl('null'),
    additionalPaint: new FormControl('null'),
    finalPriceIncrement: new FormControl(0),
  };

  public customerForm: { [key: string]: FormControl };
  public selectedCustomerData: ICustomerResponse;
  public doorProfileM2Weight: string;

  public actualStep = 0;

  private scrollElement: HTMLElement;
  private backButtonSub: Subscription;

  constructor(
    private router: Router,
    private platform: Platform,
    private general: GeneralService,
    private customersService: CustomersService,
    private authService: AuthService,
    private quotesService: QuotesService,
    private alertController: AlertController,
    private toastController: ToastController,
  ) {
    this.loggedUser = this.authService.getLoggedUser();
  }

  async ionViewDidEnter() {
    this.backButtonSub = this.platform.backButton.subscribeWithPriority(
      10000,
      () => this.onPreviews(),
    );
  }

  ionViewWillLeave() {
    this.backButtonSub.unsubscribe();
  }

  async ngAfterViewInit() {
    this.backButtonText = this.platform.is('ios') ? IOS_BACK_BUTTON_LABEL : this.backButtonText;
    if (this.selectedCustomerData) {
      this.customerFormComponent.setCustomerData(this.selectedCustomerData);
    }
    this.getQuoteItems();
    this.scrollElement = await this.content.getScrollElement();
    this.scrollElement.addEventListener('scroll', this.checkFloating.bind(this));
  }

  ngOnDestroy(): void {
    this.scrollElement.removeEventListener('scroll', this.checkFloating.bind(this));
  }

  async getQuoteItems() {
    const logged = this.loggedUser;
    this.loading = true;

    const items = Object.assign({}, this.quoteItems);

    const allItems: { [key: string]: IQuoteItemTypes } = {
      installTypes: 'tpi',
      doorTypes: 'chp',
      additionalPortholes: 'ent'
    };

    await Promise.all(Object.keys(allItems).map(
      async key => items[key] = await this.quotesService.getQuoteItems(
        logged,
        allItems[key],
      )
    ));

    if (items.installTypes.length) {
      this.quoteForm.typeOfInstall.setValue(items.installTypes[0].id);
    }

    if (items.doorTypes.length) {
      this.quoteForm.doorType.setValue(items.doorTypes[0].id);
    }

    items.engineCategories = await this.quotesService.getEngineCategories(logged);

    if (items.engineCategories.length) {
      this.quoteForm.engineCategory.setValue(items.engineCategories[0].id);
    }

    const configs = await this.general.getAllAppConfigs();
    const defaultProfileId = configs.perfil_id;

    items.doorSizes = await this.quotesService.getQuoteItems(logged, undefined, defaultProfileId);

    if (items.doorSizes.length) {
      this.quoteForm.doorSize.setValue(items.doorSizes[0].id);
    }

    items.doorPaints = await this.quotesService.getDoorPaints(logged);

    this.quoteItems = items;

    this.loading = false;
  }

  async getCustomerForm(data: { [key: string]: FormControl }) {
    this.customerForm = data;
  }

  checkFloating() {
    let showFloating = false;
    const showInSteps = [5];

    if (this.scrollElement && showInSteps.indexOf(this.actualStep) > -1) {
      const scrollDiff = this.scrollElement.scrollHeight - this.scrollElement.offsetHeight;
      showFloating = (scrollDiff - this.scrollElement.scrollTop) >= 60;
    }
    this.showFloating = showFloating;

    let showPosition = false;

    if (this.scrollElement) {
      const scrollDiff = this.scrollElement.scrollHeight - this.scrollElement.offsetHeight;
      showPosition = (100 - ((this.scrollElement.scrollTop * 100) / scrollDiff)) <= 40;
    }

    this.showGoToTop = showPosition;
  }

  goToTop() {
    this.content.scrollToTop(250);
  }

  async onSetEngineCategoryClick() {
    this.saving = true;
    this.quoteItems.engineAutomators = await this.quotesService.getEngineAutomators(
      this.quoteForm.engineCategory.value,
      this.loggedUser,
    ) as any;
    this.saving = false;
    this.onNextClick();
  }

  onSetDoorProfile(profile: IProductResponse) {
    this.quoteData.doorProfile = { ...profile, tipo: 'prf' };
    this.doorProfileM2Weight = profile.peso_m2;
  }

  onActualStepChange(stepId: number) {
    this.actualStep = stepId;
    this.goToTop();
    this.checkFloating();
    if (stepId === 7) {
      this.materialList.createFinalProductList();
    }
    this.changing = false;
  }

  onPreviews() {
    if (this.saving === false && this.changing === false) {
      if (this.actualStep === 0) {
        this.router.navigate(['/home']);
        return;
      }
      this.steps.previews();
      this.changing = true;
    }
  }

  onNextClick() {
    if (this.saving === false && this.changing === false) {
      this.steps.next();
      this.changing = true;
    }
  }

  onFabNextClick() {
    switch (this.actualStep) {
      case 4: this.doorPorthole.onDoorPortholeClick();
        break;
      case 5: this.doorPaint.onDoorPaintClick();
        break;
      default:
        this.onNextClick();
    }
  }

  customerFormIsValid() {
    if (this.customerFormComponent) {
      return this.customerFormComponent.formIsValid();
    }

    return false;
  }

  async onCustomerChange(id: string) {
    this.loading = true;
    Object.keys(this.customerForm).forEach(key => this.customerForm[key].disable());
    let selectedUserData: ICustomerResponse;

    if (id) {
      selectedUserData = (await this.customersService.getOne(id, this.loggedUser)).cliente;

      if (selectedUserData) {
        this.selectedCustomerData = selectedUserData;
        this.customerFormComponent.setCustomerData(selectedUserData);
      }
    }
    else {
      this.selectedCustomerData = undefined;
    }

    if (!selectedUserData) {
      this.customerFormComponent.clear();
    }

    Object.keys(this.customerForm).forEach(key => this.customerForm[key].enable());
    this.loading = false;
  }

  async onSubmitCustomer() {
    this.saving = true;
    Object.keys(this.customerForm).forEach(key => this.customerForm[key].disable());

    const formData = this.customerFormComponent.getFormData();
    try {
      if (this.selectedCustomerData) {
        const updateResult = await this.customersService.update(
          this.selectedCustomerData.id,
          formData,
          this.loggedUser,
        );

        const toast = await this.toastController.create({
          color: 'success',
          message: `Cadastro atualizado com sucesso!`,
          duration: 2000,
        });
        await toast.present();

        this.selectedCustomerData = {
          ...updateResult.cli,
          ...updateResult.end,
          id: updateResult.cliente_id,
        };
      }
      else {
        const id = (await this.customersService.create(
          formData,
          this.loggedUser,
        )).cliente_id;

        const toast = await this.toastController.create({
          color: 'success',
          message: `Cadastro realizado com sucesso!`,
          duration: 2000,
        });
        await toast.present();

        this.selectedCustomerData = {
          ...formData.cli,
          ...formData.end,
          id
        };
      }
      this.saving = false;
      Object.keys(this.customerForm).forEach(key => this.customerForm[key].enable());
      this.onNextClick();
      return;
    }
    catch (e) {
      const error = await this.alertController.create({
        header: 'Erro:',
        message: e?.message || 'Não foi possível salvar agora, tente novamente mais tarde.',
        buttons: ['OK'],
      });
      await error.present();
    }

    this.saving = false;
    Object.keys(this.customerForm).forEach(key => this.customerForm[key].enable());
  }

  onChangeSaving(status: boolean) {
    this.saving = status;
  }

  onOpenProductsModelClick() {
    this.materialList.onOpenProductsModelClick();
  }
}
