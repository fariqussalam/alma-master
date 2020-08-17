import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomeModule',
  },
  {
    path: 'products',
    loadChildren: './products/products.module#ProductsModule',
  },
  {
    path: 'bag',
    loadChildren: './bag/bag.module#BagModule',
  },
  {
    path: 'checkout',
    loadChildren: './checkout/checkout.module#CheckoutModule',
  },
  {
    path: 'auth',
    loadChildren: './auth/auth.module#AuthModule',
  },
  {
    path: 'custom',
    loadChildren: './custom/custom.module#CustomModule',
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
