import {
  AfterContentInit,
  AfterViewInit,
  Component,
  Input,
} from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { BehaviorSubject, switchMap } from 'rxjs';
import { Category } from 'src/app/modules/core/models/categories.model';
import { AddProduct } from 'src/app/modules/core/models/forms.model';
import { Image } from 'src/app/modules/core/models/image.model';
import {
  AddProductData,
  Product,
} from 'src/app/modules/core/models/product.model';
import { CategoriesService } from 'src/app/modules/core/services/categories.service';
import { FormService } from 'src/app/modules/core/services/form.service';
import { ImageService } from 'src/app/modules/core/services/image.service';
import { ProductsService } from 'src/app/modules/core/services/products.service';
import { DialogImageComponent } from '../../dialog-image/dialog-image.component';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-product-editor',
  templateUrl: './product-editor.component.html',
  styleUrls: ['./product-editor.component.scss'],
})
export class ProductEditorComponent implements AfterViewInit {
  selectedFile: File | null = null;
  fileName: string | null = null;
  btnName = 'Dodaj produkt';
  productToEdit: Product | null = null;

  imageUrls: Image[] = [];

  success: string | null = null;
  error: string | null = null;
  error2: string | null = null;

  addProductForm: FormGroup<AddProduct> = this.formService.initAddProductForm();

  categories: BehaviorSubject<Category[]> = this.categoriesService.categories;

  constructor(
    private imageService: ImageService,
    private formService: FormService,
    private categoriesService: CategoriesService,
    private productService: ProductsService,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer
  ) {}
  ngAfterViewInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((paramMap) => {
          const [name, date] = (paramMap.get('uid') as string).split('-');
          return this.productService.getProduct(name, date);
        })
      )
      .subscribe({
        next: (product) => {
          this.productToEdit = { ...product };
          this.addProductForm.controls.name.setValue(product.name);
          this.addProductForm.controls.mainDesc.setValue(product.mainDesc);
          this.addProductForm.controls.descHtml.setValue(product.descHtml);
          this.addProductForm.controls.price.setValue(String(product.price));
          this.addProductForm.controls.category.setValue(
            product.categoryDTO.shortId
          );
          let i = 0;
          let paramx = product.parameters.split('","');
          for (let param of paramx) {
            param = param.replaceAll('{', '').replaceAll('}', '');
            let [key, value] = param.split('":"');
            this.addProductForm.controls.parameters.at(i).setValue({
              key: key.replaceAll('"', ''),
              value: value.replaceAll('"', ''),
            });
            this.addParameter();
            i++;
          }
          this.deleteParameter(i--);
          for (let url of product.imageUrls) this.imageUrls.push({ url: url });
          this.btnName = 'Zapisz zmiany';
        },
      });
    document.getElementsByClassName(
      'angular-editor-toolbar-set'
    )[10].innerHTML =
      document.getElementsByClassName('angular-editor-toolbar-set')[10]
        .innerHTML +
      '<button _ngcontent-ng-c834769704="" type="button" title="Add Image" tabindex="-1" class="angular-editor-button" id="addImageButton"><i _ngcontent-ng-c834769704="" class="fa fa-image"></i></button>';
    // .appendChild(button);
    document.getElementById('addImageButton')?.addEventListener('click', () => {
      const dialogRef = this.dialog.open(DialogImageComponent, {
        width: '80%',
        enterAnimationDuration: '200ms',
        exitAnimationDuration: '200ms',
      });
      dialogRef.afterClosed().subscribe((result: Image) => {
        if (result) {
          this.controls.descHtml.setValue(
            this.controls.descHtml.value +
              `<img src="${result.url}" alt="Zdjęcie produktu" style="max-width: 70vw;max-height: 50vh;"></img>`
          );
        }
      });
    });
  }

  get controls() {
    return this.addProductForm.controls;
  }

  get parameters(): FormArray<
    FormGroup<{
      key: FormControl<string>;
      value: FormControl<string>;
    }>
  > {
    return this.addProductForm.controls.parameters;
  }

  addFile() {
    const dialogRef = this.dialog.open(DialogImageComponent, {
      width: '80%',
      enterAnimationDuration: '200ms',
      exitAnimationDuration: '200ms',
    });
    dialogRef.afterClosed().subscribe((result: Image) => {
      if (result) {
        this.imageUrls.push(result);
      }
    });
  }

  setActiveImages(imageArray: Image[]) {
    this.imageUrls = [...imageArray];
  }

  getErrorMessage(typ: string, control: FormControl): string {
    return this.formService.getErrorMessage(typ, control);
  }

  config: AngularEditorConfig = this.imageService.config;

  addProduct() {
    const formValue = this.addProductForm.getRawValue();
    const parametersObject: { [key: string]: string } = {};
    formValue.parameters.forEach((item) => {
      parametersObject[item.key] = item.value;
    });
    const parameters = `${JSON.stringify(parametersObject)}`;
    // console.log(parameters);
    const imagesUid = this.imageUrls.map((url) => {
      const [, uid] = url.url.split('uid=');
      return uid;
    });

    const addProductData: AddProductData = {
      ...formValue,
      price: Number(formValue.price),
      parameters,
      imagesUid,
    };
    console.log(addProductData);
    if (this.productToEdit) {
      this.productService
        .editProduct(addProductData, this.productToEdit.uid)
        .subscribe({
          next: () => {
            this.error2 = '';
            this.success = 'Poprawnie edytowano produkt';
          },
          error: (err) => {
            this.success = '';
            this.error2 = err;
          },
        });
    } else {
      this.productService.addProduct(addProductData).subscribe({
        next: () => {
          this.addProductForm.reset();
          this.imageUrls = [];
          this.error2 = '';
          this.success = 'Poprawnie dodano produkt';
        },
        error: (err) => {
          this.success = '';
          this.error2 = err;
        },
      });
    }
  }

  deleteParameter(i: number) {
    this.parameters.removeAt(i);
  }

  addParameter() {
    const newGroup = new FormGroup({
      key: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
        nonNullable: true,
      }),
      value: new FormControl('', {
        validators: [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(100),
        ],
        nonNullable: true,
      }),
    });
    this.parameters.push(newGroup);
  }
}
