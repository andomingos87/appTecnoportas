import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Platform } from '@ionic/angular';

import { GeneralService } from '../global/general.service';
import { DEFAULT_BACK_BUTTON_LABEL, IOS_BACK_BUTTON_LABEL } from '../global/global.constants';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {
  public backButtonText = DEFAULT_BACK_BUTTON_LABEL;

  public aboutHtml: string | SafeHtml;

  constructor(
    private platform: Platform,
    private sanitizer: DomSanitizer,
    private general: GeneralService,
  ) { }

  async ngOnInit() {
    this.backButtonText = this.platform.is('ios') ? IOS_BACK_BUTTON_LABEL : this.backButtonText;
    this.aboutHtml = this.sanitizer.bypassSecurityTrustHtml((await this.general.getAllAppConfigs()).sobre_nos);
  }

}
