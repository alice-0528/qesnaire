import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
  selector: 'app-statistics-page',
  imports: [],
  templateUrl: './statistics-page.component.html',
  styleUrl: './statistics-page.component.scss'
})
export class StatisticsPageComponent {

  ngAfterViewInit(): void {


    for(let chartList of this.chartArray) {
      // 獲取 canvas 元素
    let ctx = document.getElementById(chartList.id) as HTMLCanvasElement;

    // 設定數據
    let data = {
      // x 軸文字
      labels: chartList.labels,
      datasets: [
        {
          // 上方分類文字
          label: chartList.label,
          // 數據
          data: chartList.data,
          // 線與邊框顏色
          backgroundColor: chartList.backgroundColor,
          //設定hover時的偏移量，滑鼠移上去表會偏移，方便觀看選種的項目
          hoverOffset: 20,
        },
      ],
    };

    // 創建圖表
    let chart = new Chart(ctx, {
      type: 'pie',
      data: data,
    });

    }


      }








      chartArray=[
    {
      id:'1',
      labels:['option1','option2','option3'],
      label:'投票數',
      data:[200,680,1000],
      backgroundColor:['#e2859a','#4b8bb6','#e0c483',]
    },
    {
      id:'2',
      labels:['option1','option2','option3'],
      label:'投票數',
      data:[800,680,500],
      backgroundColor:['#aae285','#9161ad','#e9e49b',]
    },

  ]
}
