import { NgModule } from '@angular/core';
import { NoPreloading, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'news',
    loadChildren: () => import('./news/news.module').then(m => m.NewsPageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then(m => m.AboutPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./sign-up/sign-up.module').then(m => m.SignUpPageModule)
  },
  {
    path: 'catalog-list',
    loadChildren: () => import('./catalog-list/catalog-list.module').then(m => m.CatalogListPageModule)
  },
  {
    path: 'contact-form',
    loadChildren: () => import('./contact-form/contact-form.module').then(m => m.ContactFormPageModule)
  },
  {
    path: 'password-recovery',
    loadChildren: () => import('./password-recovery/password-recovery.module').then(m => m.PasswordRecoveryPageModule)
  },
  {
    path: 'product-list',
    loadChildren: () => import('./product-list/product-list.module').then(m => m.ProductListPageModule)
  },
  {
    path: 'my-customers',
    loadChildren: () => import('./my-customers/my-customers.module').then(m => m.MyCustomersPageModule)
  },
  {
    path: 'my-quotes',
    loadChildren: () => import('./quotes/my-quotes/my-quotes.module').then(m => m.MyQuotesPageModule)
  },
  {
    path: 'quote-pdf/:id',
    loadChildren: () => import('./quotes/quote-pdf/quote-pdf.module').then(m => m.QuotePdfPageModule)
  },
  {
    path: 'new-quote',
    loadChildren: () => import('./quotes/new-quote/new-quote.module').then(m => m.NewQuotePageModule)
  },
  {
    path: 'my-profile',
    loadChildren: () => import('./my-profile/my-profile.module').then(m => m.MyProfilePageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: NoPreloading,
      onSameUrlNavigation: 'reload',
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
