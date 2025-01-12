import { Directive, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[libDynamicComp]',
    standalone: false
})
export class RenderedViewDynamicCompDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
