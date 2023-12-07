import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appStep]',
})
export class StepsDirective {

  constructor(
    public templateRef: TemplateRef<any>,
  ) { }

}
