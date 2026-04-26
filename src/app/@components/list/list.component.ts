import { routes } from './../../app.routes';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SurveyService } from '../../@services/survey.service';

export interface PeriodicElement {
  name: string;
  id: number;
  state?: string;
  startDate: string;
  endDate: string;
  result?: string;
}

@Component({
  selector: 'app-list',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    CommonModule,
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListComponent implements AfterViewInit, OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private surveyService: SurveyService,
  ) {}

  search!: string;
  dataSource = new MatTableDataSource<any>([]);

  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  displayedColumns: string[] = [
    'id',
    'name',
    'state',
    'start',
    'end',
    'result',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  questionNaireName: string = '';

  ngOnInit(): void {
    let data = this.surveyService.getSurveys();
    this.dataSource.data = data;

    // 搜尋過濾邏輯
    this.dataSource.filterPredicate = (
      data: PeriodicElement,
      filter: string,
    ) => {
      // 這裡要判斷：如果 filter 是 JSON 字串才解析，否則當作一般字串處理
      let nameSearch = '';
      let filterStart: Date | null = null;
      let filterEnd: Date | null = null;

      try {
        let searchTerms = JSON.parse(filter);
        nameSearch = searchTerms.name || '';
        filterStart = searchTerms.start ? new Date(searchTerms.start) : null;
        filterEnd = searchTerms.end ? new Date(searchTerms.end) : null;
      } catch {
        nameSearch = filter; // 如果不是 JSON，就直接拿來當關鍵字
      }
      // --- 條件 A: 名稱比對 ---
      let nameMatch = data.name
        .toLowerCase()
        .includes(nameSearch.toLowerCase());

      // --- 條件 B: 日期比對 ---
      let dateMatch = true;
      // 將資料中的字串 '2026/01/01' 轉為 Date 物件進行比對
      let rowStart = new Date(data.startDate);
      let rowEnd = new Date(data.endDate);

      // 邏輯：資料的區間是否與搜尋的區間有交集 (或是完全包含)
      // 這裡採用簡單邏輯：只要資料的開始時間 >= 搜尋開始 且 資料結束 <= 搜尋結束
      if (filterStart) dateMatch = dateMatch && rowStart >= filterStart;
      if (filterEnd) dateMatch = dateMatch && rowEnd <= filterEnd;

      return nameMatch && dateMatch;
    };
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // getQesName() {
  //   // 直接取得雙向綁定的值，並轉小寫後交給 dataSource
  //   // 注意：賦值給 .filter 就會自動觸發過濾
  //   let filterValue = this.questionNaireName.trim().toLowerCase();
  //   console.log('正在搜尋：', filterValue);

  //   this.dataSource.filter = filterValue;

  //   //當有paginator(分頁)時，搜尋後可以回到第一頁
  //   if (this.dataSource.paginator) {
  //     this.dataSource.paginator.firstPage();
  //   }

  //   // 強制更新畫面
  //   this.cdr.detectChanges();
  //   console.log('剩餘資料筆數：', this.dataSource.filteredData.length);
  // }

  goResult(id: number) {
    this.router.navigate(['/statistics-page', id]);
  }

  goQesnaire(id: number) {
    this.router.navigate(['/inner-page', id]);
  }

  //搜尋觸發器
  applyAllFilters() {
    let filterObject = {
      name: this.questionNaireName.trim(), // 抓取雙向綁定的名字
      start: this.range.value.start, // 抓取日期範圍
      end: this.range.value.end,
    };
    // 將物件轉為字串送進 filter，會觸發上面的 filterPredicate
    this.dataSource.filter = JSON.stringify(filterObject);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.cdr.detectChanges(); // 確保 OnPush 模式下畫面會更新
  }

  getSurveyStatus(startDate: string, endDate: string): string {
    let now = new Date();
    let start = new Date(startDate);
    let end = new Date(endDate);

    if (now < start) return '尚未開始';
    if (now > end) return '已結束';
    return '進行中';
  }
}
