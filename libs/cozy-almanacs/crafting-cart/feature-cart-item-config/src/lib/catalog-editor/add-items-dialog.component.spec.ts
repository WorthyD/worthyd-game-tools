import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddItemsDialogComponent, AddItemsDialogData, MAX_NEW_ITEMS } from './add-items-dialog.component';

describe('AddItemsDialogComponent', () => {
  let fixture: ComponentFixture<AddItemsDialogComponent>;
  let close: jest.Mock;

  const data: AddItemsDialogData = {
    labels: {
      categories: [{ id: 'crafting', name: 'Crafting', icon: 'handyman' }],
      tags: [{ id: 'bombs', name: 'Bombs', icon: 'bomb' }]
    },
    ingredientOptions: [{ id: 'coal', name: 'Coal' }],
    existingIds: ['bomb', 'coal']
  };

  const element = () => fixture.nativeElement as HTMLElement;
  const field = (label: string, row: number) =>
    element().querySelector(`[aria-label="${label} of new item ${row}"]`) as HTMLInputElement;
  const type = (label: string, row: number, value: string) => {
    const input = field(label, row);
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  };
  const addButton = () =>
    [...element().querySelectorAll('button')].find((b) => b.textContent?.trim().startsWith('Add')) as HTMLButtonElement;

  beforeEach(() => {
    close = jest.fn();
    TestBed.configureTestingModule({
      imports: [AddItemsDialogComponent],
      providers: [
        provideNoopAnimations(),
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: { close } }
      ]
    });
    fixture = TestBed.createComponent(AddItemsDialogComponent);
    fixture.detectChanges();
  });

  it(`shows ${MAX_NEW_ITEMS} blank rows and can't add until one is filled in`, () => {
    expect(element().querySelectorAll('section').length).toBe(MAX_NEW_ITEMS);
    expect(addButton().disabled).toBe(true);
  });

  it('adds the filled-in rows, making ids and image urls from the names and skipping blank rows', () => {
    type('Name', 1, 'Cherry Bomb');
    type('Description', 1, ' Explodes. ');
    type('Wiki url', 3, 'https://stardewvalleywiki.com/Mega_Bomb');
    type('Name', 4, 'Gate');
    type('Id', 4, 'Wood Gate');
    type('Image url', 4, './images/gate.png');

    expect(addButton().textContent).toContain('Add 3 items');
    addButton().click();

    expect(close).toHaveBeenCalledWith([
      {
        id: 'cherry_bomb',
        name: 'Cherry Bomb',
        description: 'Explodes.',
        imageUrl: './images/cherry_bomb.png',
        links: [],
        ingredients: [],
        categories: [],
        tags: []
      },
      {
        id: 'mega_bomb',
        name: 'Mega Bomb',
        description: '',
        imageUrl: './images/mega_bomb.png',
        links: [{ text: 'Wiki Link', url: 'https://stardewvalleywiki.com/Mega_Bomb' }],
        ingredients: [],
        categories: [],
        tags: []
      },
      {
        id: 'wood_gate',
        name: 'Gate',
        description: '',
        imageUrl: './images/gate.png',
        links: [],
        ingredients: [],
        categories: [],
        tags: []
      }
    ]);
  });

  it('shows the id and name it will use as placeholders', () => {
    type('Wiki url', 1, 'https://stardewvalleywiki.com/Mega_Bomb');

    expect(field('Name', 1).placeholder).toBe('Mega Bomb');
    expect(field('Id', 1).placeholder).toBe('mega_bomb');
    expect(field('Image url', 1).placeholder).toBe('./images/mega_bomb.png');
  });

  it('blocks ids that are already in the catalog or used twice', () => {
    type('Name', 1, 'Bomb');
    expect(element().textContent).toContain('The catalog already has an item with the id "bomb".');
    expect(addButton().disabled).toBe(true);

    type('Name', 1, 'Torch');
    type('Name', 2, 'torch');
    expect(element().textContent).toContain('Another new item also has the id "torch".');
    expect(addButton().disabled).toBe(true);

    type('Id', 2, 'torch_2');
    expect(addButton().disabled).toBe(false);
  });

  it('asks for a name when a row has details but no id, and rejects urls that are not links', () => {
    type('Description', 1, 'Something');
    expect(element().textContent).toContain('Give it a name, an id or a wiki url.');

    type('Wiki url', 1, 'not a url');
    expect(element().textContent).toContain('The wiki url must be a full http(s) link to a page.');
    expect(addButton().disabled).toBe(true);
  });

  it('clears a row', () => {
    type('Name', 2, 'Torch');
    (element().querySelector('[aria-label="Clear new item 2"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(field('Name', 2).value).toBe('');
    expect(addButton().disabled).toBe(true);
  });
});
