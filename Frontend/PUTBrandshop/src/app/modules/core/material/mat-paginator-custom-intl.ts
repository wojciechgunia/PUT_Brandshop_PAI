/* eslint-disable prettier/prettier */
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import { Injectable } from '@angular/core';

@Injectable()
export class MatPaginatorCustomIntl extends MatPaginatorIntl {
  override firstPageLabel = 'Pierwsza strona';
  override lastPageLabel = 'Ostatnia strona';
  override nextPageLabel = 'Następna strona';
  override previousPageLabel = 'Poprzednia strona';
  override itemsPerPageLabel = 'Ilość przedmiotów na stronę:';
  override getRangeLabel = (page: number, pageSize: number, length: number) => {
    if (length === 0 || pageSize === 0) return `0 z ${length}`;

    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;

    return `${startIndex + 1}-${endIndex} z ${length}`;
  };
}
