import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { AdminGuard } from '../core/guards/admin.guard';
import { UserAdministrationComponent } from './components/administrator/user-administration/user-administration.component';
import { CategoryAdministrationComponent } from './components/administrator/category-administration/category-administration.component';
import { ProductAdministrationComponent } from './components/administrator/product-administration/product-administration.component';
import { OrderListComponent } from './components/administrator/order-list/order-list.component';
import { ProductEditorComponent } from './components/administrator/product-administration/product-editor/product-editor.component';

const routes: Routes = [
  {
    path: 'panel',
    component: AdministratorComponent,
    canActivate: [AdminGuard],
    children: [
      { path: 'kategorie', component: CategoryAdministrationComponent },
      { path: 'produkty', component: ProductAdministrationComponent },
      { path: 'produkty/edytor', component: ProductEditorComponent },
      { path: 'produkty/edytor/:uid', component: ProductEditorComponent },
      { path: 'uzytkownicy', component: UserAdministrationComponent },
      { path: 'zamowienia', component: OrderListComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
