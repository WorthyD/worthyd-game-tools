import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, Pipe, PipeTransform } from '@angular/core';
import { MemberProfile } from'@dcd/shared/models';
@Pipe({
  name: 'classicon',
  pure: true,
  standalone: true
})
export class ClassIconPipe implements PipeTransform {
  constructor() {}

  transform(classType: number): any {
    switch (classType) {
      case 0:
        return 'titan-cell';
      case 1:
        return 'hunter-cell';
      case 2:
        return 'warlock-cell';
    }
  }
}

@Component({
    selector: 'app-class-cell',
    template: `
    <div [ngClass]="(profile?.characters.data)[characterHash].classType | classicon">
      {{ (profile?.characters.data)[characterHash].light }}
    </div>
  `,
    styles: [],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [CommonModule, ClassIconPipe]
})
export class ClassCellComponent {
  @Input() characterHash!: string;

  @Input() profile!: MemberProfile;

  constructor() {}

  getIcon(): string {
    const classType = (this.profile?.characters.data)[this.characterHash].classType;
    switch (classType) {
      case 0:
        return 'titan';
      case 1:
        return 'hunter';
      case 2:
        return 'warlock';
      default:
        return '';
    }
  }
}
