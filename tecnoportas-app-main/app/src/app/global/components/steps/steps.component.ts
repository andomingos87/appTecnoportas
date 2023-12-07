import {
  AfterContentChecked,
  AfterViewInit,
  Component,
  ContentChildren,
  EventEmitter,
  Input,
  NgZone,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import Swiper, { SwiperOptions } from 'swiper';
import { SwiperComponent } from 'swiper/angular';

import { StepsDirective } from './steps.directive';

@Component({
  selector: 'app-steps',
  templateUrl: './steps.component.html',
  styleUrls: ['./steps.component.scss'],
})
export class StepsComponent implements AfterViewInit, AfterContentChecked {
  @Output()
  public actualStepChange = new EventEmitter<number>();

  @Input()
  public actualStep = 0;

  @Input()
  public animationDelay = 500;

  @Input()
  public loop = false;

  @ViewChild('swiper')
  public swiper: SwiperComponent;

  @ContentChildren(StepsDirective)
  public stepsDirs: QueryList<StepsDirective>;

  public index = 0;
  public steps = 0;
  public stepNumbers: { finished: boolean; active: boolean }[] = [];
  public firstChange = true;

  public config: SwiperOptions = {
    slidesPerView: 1,
    loop: false,
    keyboard: false,
    allowTouchMove: false,
    scrollbar: true,
  };

  constructor(private ngZone: NgZone) { }

  get stepIndex(): number {
    return this.index;
  }

  set stepIndex(value: number) {
    this.index = value;
    if (!this.firstChange) {
      this.actualStepChange.emit(value);
    }
  }

  public ngAfterViewInit() {
    this.steps = this.stepsDirs.length;
    this.stepIndex = this.actualStep;
    this.stepNumbers = this.stepsDirs.map((item, index) => ({ finished: false, active: index === 0 }));
    if (this.actualStep !== 0) {
      this.swiper.swiperRef.slideTo(this.actualStep - 1);
    }
  }

  public ngAfterContentChecked() {
    if (this.swiper) {
      this.swiper.updateSwiper({});
    }
  }

  public next() {
    this.swiper.swiperRef.slideNext(this.animationDelay);
  }

  public previews() {
    this.swiper.swiperRef.slidePrev(this.animationDelay);
  }

  onChange(event: Swiper[]) {
    const swiper = event[0];

    const diff = (swiper.activeIndex) - this.stepIndex;

    setTimeout(() => {
      if (this.firstChange) {
        this.ngZone.run(() => {
          this.firstChange = false;
        });
      }

      this.ngZone.run(() => {
        if (diff === 1) {
          if (this.stepIndex < this.steps) {
            this.stepIndex++;
          }
          else if (this.loop) {
            this.stepIndex = 0;
          }
          else {
            this.previews();
          }
        }
        else if (diff === -1) {
          if (this.stepIndex > -1) {
            this.stepIndex--;
          }
          else if (this.loop) {
            this.stepIndex = this.steps;
          }
          else {
            this.next();
          }
        }

        this.stepNumbers = this.stepsDirs.map((item, index) => ({
          finished: index < this.stepIndex,
          active: index === this.stepIndex
        }));
      });

    }, this.animationDelay + 80);
  }
}
