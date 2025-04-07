import { NgModule } from '@angular/core';
import { AngularEditorModule } from '@kolkov/angular-editor';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministratorComponent } from './components/administrator/administrator.component';
import { SharedModule } from '../shared/shared.module';
import { UserAdministrationComponent } from './components/administrator/user-administration/user-administration.component';
import { ProductAdministrationComponent } from './components/administrator/product-administration/product-administration.component';
import { CategoryAdministrationComponent } from './components/administrator/category-administration/category-administration.component';
import { OrderListComponent } from './components/administrator/order-list/order-list.component';
import { DialogConfirmComponent } from './components/administrator/dialog-confirm/dialog-confirm.component';
import { ProductEditorComponent } from './components/administrator/product-administration/product-editor/product-editor.component';
import { DialogImageComponent } from './components/administrator/dialog-image/dialog-image.component';
import { DialogChangeRoleComponent } from './components/administrator/user-administration/dialog-change-role/dialog-change-role.component';
import { OrderModule } from '../order/order.module';
import { DialogCategoryAddComponent } from './components/administrator/category-administration/dialog-category-add/dialog-category-add.component';
import { DialogSetStatusComponent } from './components/administrator/order-list/dialog-set-status/dialog-set-status.component';
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UploadedImagesComponent } from './components/administrator/product-administration/product-editor/uploaded-images/uploaded-images.component';

@NgModule({
  declarations: [
    AdministratorComponent,
    UploadedImagesComponent,
    UserAdministrationComponent,
    ProductAdministrationComponent,
    CategoryAdministrationComponent,
    OrderListComponent,
    DialogConfirmComponent,
    ProductEditorComponent,
    DialogImageComponent,
    DialogChangeRoleComponent,
    DialogCategoryAddComponent,
    DialogSetStatusComponent,
  ],
  imports: [
    HttpClientModule,
    SharedModule,
    AdministrationRoutingModule,
    AngularEditorModule,
    OrderModule,
    RouterLink,
  ],
})
export class AdministrationModule {}
