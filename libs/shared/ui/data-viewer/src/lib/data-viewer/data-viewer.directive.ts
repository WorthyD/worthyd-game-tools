import { Directive, inject, ViewContainerRef } from "@angular/core";

@Directive({
    selector: '[libDynamicComp]',
})
export class RenderedViewDynamicCompDirective {
  public viewContainerRef = inject(ViewContainerRef);
}
