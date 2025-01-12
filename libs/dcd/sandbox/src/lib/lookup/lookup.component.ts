import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { MilestoneDefinitionService } from '@core/definition-services/milestone-definition.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { Destiny2Service } from 'bungie-api-angular';
import { take } from 'rxjs';
import { DefinitionService } from '@dcd/shared/data-access/definitions';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-lookup',
    imports: [CommonModule, ReactiveFormsModule, MatTabsModule, RouterModule],
    templateUrl: './lookup.component.html',
    encapsulation: ViewEncapsulation.None,
    styleUrls: ['./lookup.component.scss']
})
export class LookupComponent {
  constructor(
    // private presentationNodeService: PresentationNodeDefinitionService,
    //  private milestoneDefinitionService: MilestoneDefinitionService,
    private definitionService: DefinitionService,
    private d2ServiceBase: Destiny2Service
  ) {}

  displayObject: any = {};
  displayHash = new FormControl('');
  milestoneHash = new FormControl('');
  recordHash = new FormControl('');
  output = new FormControl('');
  imageUrl = new FormControl('');
  imgUrls = [];

  lookupPresentation() {
    this.updateDisplay(this.definitionService.presentationDefinition[this.displayHash.value as unknown as number]);
  }
  lookupMilestone() {
    this.updateDisplay(this.definitionService.milestoneDefinition[this.milestoneHash.value as unknown as number]);
  }
  lookupRecord() {
    this.updateDisplay(this.definitionService.recordDefinition[this.recordHash.value as unknown as number]);
  }

  updateDisplay(thing: any) {
    this.output.patchValue(JSON.stringify(thing, undefined, 4));
  }
  loadImage() {
    // this.imgUrls.push(`//bungie.net/${this.imageUrl?.value}`);
  }
  userLookup() {
    this.d2ServiceBase
      //.destiny2GetProfile('4611686018467238913' as unknown as number, 3, [100, 104, 200, 202, 800, 900, 1100, 1400])
      .destiny2GetProfile('4611686018467238913' as unknown as number, 3, [100, 104, 200, 202])
      //.destiny2GetProfile('4611686018467238913' as unknown as number, 3, [ 1400])
      .pipe(take(1))
      .subscribe((result) => {
        this.updateDisplay(result);
      });
  }

  activityLookup() {
    this.d2ServiceBase
      //.destiny2GetProfile('4611686018467238913' as unknown as number, 3, [100, 104, 200, 202, 800, 900, 1100, 1400])
      .destiny2GetActivityHistory(
        '2305843009310516628' as unknown as number,
        '4611686018467238913' as unknown as number,
        3
      )
      //.destiny2GetProfile('4611686018467238913' as unknown as number, 3, [ 1400])
      .pipe(take(1))
      .subscribe((result) => {
        this.updateDisplay(result);
      });
  }
  bungieInfoLookup() {

  }
}
