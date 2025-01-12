import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import {
	MatListOption,
	MatSelectionList,
	MatSelectionListChange,
} from '@angular/material/list';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { ShopService } from '../../core/services/shop.service';
import { Pagination } from '../../shared/models/pagination';
import { Product } from '../../shared/models/product';
import { ShopParams } from '../../shared/models/shopParams';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { ProductItemComponent } from './product-item/product-item.component';

@Component({
  selector: 'app-shop',
  standalone: true,
  imports: [
    MatCardModule,
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenu,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginatorModule,
    FormsModule
],
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss'
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  private dialogSerice = inject(MatDialog);

  products?: Pagination<Product>;

  sortOptions = [
    {name: 'Alphabetical', value: 'name'},
    {name: 'Price High-Low', value: 'priceAsc'},
    {name: 'Price Low-High', value: 'priceDesc'}
  ]

  shopParams = new ShopParams();
  pageSizeOptions = [5, 10, 15, 20];

  ngOnInit(): void {
    this.initializeShop();
  }

  initializeShop(){
    this.shopService.getBrands();
    this.shopService.getTypes();
    this.getProducts();
  }

  getProducts(){
    this.shopService.getProducts(this.shopParams).subscribe({
      next: response => (this.products = response),
      error: error => console.error(error)
    });
  }

  onSearchChange(){
    this.shopParams.pageNumber = 1;
    this.getProducts();
  }

  handlePageEvent(event: PageEvent){
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.getProducts();
  }

  onSortChange(event: MatSelectionListChange){
    const selectedOption = event.options[0];
    if(selectedOption){
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageNumber = 1;
      this.getProducts();
    }
  }

  openFiltersDialog(){
    const dialogRef = this.dialogSerice.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types
      }
    });
    dialogRef.afterClosed().subscribe({
      next: result => {
        if(result){
          console.log(result);
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber = 1;
          this.getProducts();
        }
      }
    });
  }
}
