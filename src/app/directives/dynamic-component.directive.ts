import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appDynamicComponent]'
})
export class DynamicComponentDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
