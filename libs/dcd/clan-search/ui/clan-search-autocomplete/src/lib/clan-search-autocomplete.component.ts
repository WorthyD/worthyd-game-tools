import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { sampleTime } from 'rxjs';
import { ClanSearchResultItem } from '@dcd/clan-search/utils/clan-search-models';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
    selector: 'app-clan-search-autocomplete',
    imports: [CommonModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, ReactiveFormsModule, MatProgressSpinnerModule, MatIconModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './clan-search-autocomplete.component.html',
    styleUrls: ['./clan-search-autocomplete.component.scss']
})
export class ClanSearchAutocompleteComponent implements OnInit {
  @Input() autoCompleteResults: ClanSearchResultItem[] | undefined = undefined;
  @Input() loading: boolean = false;

  @Output() addClan = new EventEmitter<any>();
  @Output() addMembersClan = new EventEmitter<any>();
  @Output() searchClans = new EventEmitter<string>();

  autocompleteControl = new FormControl('');

  ngOnInit() {
    this.autocompleteControl.valueChanges.pipe(sampleTime(1000)).subscribe((result) => {
      if (typeof result === 'string') {
        this.searchClans.emit(result);
      }
    });
  }

  autocompleteSelected(event: MatAutocompleteSelectedEvent, input: HTMLInputElement) {
    const selectedItem = event.option.value as ClanSearchResultItem;
    input.value = '';
    input.blur();
    if (selectedItem.type === 'clan') {
      this.addClan.emit(selectedItem.clanInfo);
    } else if (selectedItem.type === 'player') {
      // console.log(selectedItem);
      this.addMembersClan.emit(selectedItem.memberInfo);
    }
  }
}
