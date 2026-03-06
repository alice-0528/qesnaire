import { routes } from './../../app.routes';
import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';import { FormsModule } from '@angular/forms';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import {ChangeDetectionStrategy,} from '@angular/core';
import {FormControl, FormGroup,  ReactiveFormsModule} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginatorModule,MatPaginator} from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


export interface PeriodicElement {
  name: string;
  position: number;
  state: string;
  start: string;
  end: string;
  result?: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', state: '尚未開始', start: '2026/04/01', end: '2026/05/31'},
  {position: 2, name: 'Helium', state: '進行中', start: '2026/01/01', end: '2026/05/31', result: '前往'},
  {position: 3, name: 'Lithium', state: '進行中', start: '2026/01/01', end: '2026/05/31', result: '前往'},
  {position: 4, name: 'Beryllium', state: '已結束', start: '2026/01/01', end: '2026/02/28', result: '前往'},
  {position: 5, name: 'Boron', state: '已結束', start: '2026/01/01', end: '2026/02/28', result: '前往'},
  {position: 6, name: 'Carbon', state: '已結束', start: '2026/01/01', end: '2026/02/28', result: '前往'},
  {position: 7, name: 'Nitrogen', state: '已結束', start: '2026/01/01', end: '2026/02/28', result: '前往'},
  {position: 8, name: 'Oxygen', state: '已結束', start: '2026/01/01', end: '2026/02/28', result: '前往'},
  {position: 9, name: 'Fluorine', state: '已結束', start: '2026/01/01', end: '2026/02/28', result: '前往'},
  {position: 10, name: 'Neon', state: '已結束', start: '2026/01/01', end: '2026/02/28', result: '前往'},
];

@Component({
  selector: 'app-list',
  imports: [FormsModule,MatFormFieldModule, MatInputModule, MatDatepickerModule,MatButtonModule, MatDividerModule, MatIconModule, MatDatepickerModule, ReactiveFormsModule,MatTableModule,MatPaginatorModule,CommonModule],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class ListComponent implements AfterViewInit, OnInit {

  constructor(private cdr: ChangeDetectorRef, private router:Router) {}

  search!: string;


  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });


  displayedColumns: string[] = ['position', 'name', 'state', 'start', 'end', 'result'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  questionNaireName: string = '';

  ngOnInit(): void {
    // 搜尋過濾邏輯

    this.dataSource.filterPredicate = (data: PeriodicElement, filter: string) => {

      // 將問卷名稱與搜尋關鍵字都轉為小寫，並去掉前後空白
      const name = data.name.trim().toLowerCase();
      const filterText = filter.trim().toLowerCase();

      return name.includes(filterText);

    };
  }

  getQesName() {

    // 直接取得雙向綁定的值，並轉小寫後交給 dataSource
    // 注意：賦值給 .filter 就會自動觸發過濾
    let filterValue = this.questionNaireName.trim().toLowerCase();
    console.log('正在搜尋：', filterValue);

    this.dataSource.filter = filterValue;

    //當有paginator(分頁)時，搜尋後可以回到第一頁
    if(this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

   // 強制更新畫面
    this.cdr.detectChanges();
    console.log('剩餘資料筆數：', this.dataSource.filteredData.length);


  }


  goResult(id: number) {
    this.router.navigate(['/statistics-page', id]);
  }

  goQesnaire(id: number) {
    this.router.navigate(['/inner-page', id]);
  }


}
