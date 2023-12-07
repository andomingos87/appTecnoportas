import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';

import { DEFAULT_BACK_BUTTON_LABEL, IOS_BACK_BUTTON_LABEL } from '../global/global.constants';
import { INewsResponse, NewsService } from './news.service';

@Component({
  selector: 'app-news',
  templateUrl: './news.page.html',
  styleUrls: ['./news.page.scss'],
})
export class NewsPage implements OnInit {
  public backButtonText = DEFAULT_BACK_BUTTON_LABEL;

  public allNews: INewsResponse[] = [];
  public empty = false;

  constructor(
    private platform: Platform,
    private news: NewsService,
  ) { }

  async ngOnInit() {
    this.backButtonText = this.platform.is('ios') ? IOS_BACK_BUTTON_LABEL : this.backButtonText;
    this.allNews = await this.news.getAll();
    if (this.allNews.length === 0) {
      this.empty = true;
    }
  }

  dateFormat(item: INewsResponse) {
    return new Date(item.dt_cadastro).toLocaleString();
  }

}
