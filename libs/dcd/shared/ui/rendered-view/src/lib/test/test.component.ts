import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'lib-test',
  templateUrl: './test.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrls: ['./test.component.scss']
})
export class TestComponent {
  @Input() test: string = 'default';
  constructor() {}

}
