import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Category } from 'src/app/modules/core/models/categories.model';
import { CategoriesService } from 'src/app/modules/core/services/categories.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  constructor(
    private categoriesService: CategoriesService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  categories: Category[] = [];

  ngOnInit(): void {
    this.categoriesService.getCategories().subscribe({
      next: (value) => {
        this.categories = [...value];
      },
    });
  }

  navigateToCategory(category: Category) {
    const queryParams: { [key: string]: string | number } = {
      kategoria: category.shortId,
      strona: 1,
    };

    const limit = this.route.snapshot.queryParamMap.get('limit');
    if (limit) {
      queryParams['limit'] = limit;
    }

    const sortuj_po = this.route.snapshot.queryParamMap.get('sortuj_po');
    if (sortuj_po) {
      queryParams['sortuj_po'] = sortuj_po;
    }

    const sortuj = this.route.snapshot.queryParamMap.get('sortuj');
    if (sortuj) {
      queryParams['sortuj'] = sortuj;
    }

    this.router.navigate(['/produkty'], {
      queryParams,
    });
  }
}
