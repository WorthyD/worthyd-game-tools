//  component originated form https://github.com/crafted/crafted
import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { RenderedViewDynamicCompDirective } from './rendered-view-component.directive';
import { RenderedView } from '@dcd/shared/data-models';

@Component({
    selector: 'lib-rendered-view',
    templateUrl: './rendered-view.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: false
})
export class RenderedViewComponent implements OnInit {
  @ViewChild(RenderedViewDynamicCompDirective, { static: true }) libDynamicComp!: RenderedViewDynamicCompDirective;
  views!: Observable<RenderedView[]>;

  @Input() text!: string;

  @Input() childrenViews: RenderedView[] = [];
  @Input() component: any;
  @Input() data: any;

  ngOnInit() {
    // TODO: Keep eye on this for performance.
    if (this.component) {
      const viewContainerRef = this.libDynamicComp.viewContainerRef;
      viewContainerRef.clear();

      const componentRef: any = viewContainerRef.createComponent(this.component);
      for (const property in this.data) {
        componentRef.instance[property] = this.data[property];
      }
    }
  }
}
