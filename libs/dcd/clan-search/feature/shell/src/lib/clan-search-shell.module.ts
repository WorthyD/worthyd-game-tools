import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        loadChildren: () =>
          import('@dcd/clan-search/feature/clan-search-view').then((module) => module.ClanSearchViewModule)
      },
      // {
      //   path: ':key',
      //   loadChildren: () =>
      //     import('../clan-search-curated-view/clan-search-curated-view.module').then(
      //       (module) => module.ClanSearchCuratedViewModule
      //     )
      // }
  ])
  ]
})
export class ClanSearchModule {}
