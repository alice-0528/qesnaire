import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatRadioModule} from '@angular/material/radio';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatIconModule} from '@angular/material/icon';
import {MatDividerModule} from '@angular/material/divider';
import {MatButtonModule} from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';

export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}


@Component({
  selector: 'app-inner-page',
  imports: [FormsModule, MatFormFieldModule, MatInputModule,MatRadioModule,MatCheckboxModule,MatButtonModule, MatDividerModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './inner-page.component.html',
  styleUrl: './inner-page.component.scss',
})
export class InnerPageComponent {
  constructor(private fb: FormBuilder,private route: ActivatedRoute) {}

  surveyForm!: FormGroup;
  currentSurvey: any;

  allMockData = [
      {
        id: 1,
        name: '早餐喜好調查',
        description: '想了解大家早餐都吃什麼。',
        questions: [
          { id: 101, title: '你早餐喝什麼？', type: 'radio', options: ['奶茶', '咖啡', '豆漿'] },
          { id: 102, title: '加不加辣？', type: 'text', options: [] }
        ]
      },
      {
        id: 2,
        name: '那些開高走低的爛尾番',
        description: '如題，發洩一下下怨念。',
        questions: [
          { id: 201, title: '你最喜歡哪個番的開頭？', type: 'radio', options: ['咒術回戰', '我推的孩子', '火影忍者'] },
          { id: 202, title: '選出結尾最讓你最失望的番。', type: 'checkbox', options: ['咒術回戰', '我推的孩子', '火影忍者'] }
        ]
      }
    ];

    ngOnInit() {
    // 抓取網址上的 id (例如網址是 /inner-page/1，id 就是 "1")
    const idFromUrl = this.route.snapshot.paramMap.get('id');

    // 根據 id 去 allMockData 裡面找資料
    this.currentSurvey = this.allMockData.find(s => s.id === Number(idFromUrl));

    if (this.currentSurvey) {
      // 初始化表單
      this.initForm();
    }
    }

    initForm() {
      this.surveyForm = this.fb.group({
        userName: ['', Validators.required],
        userEmail: ['', [Validators.required, Validators.email]],
        answers: this.fb.array([])
      });

      const answersArray = this.surveyForm.get('answers') as FormArray;

      // 根據「撈出來的那份問卷題目」產生表單欄位
      this.currentSurvey.questions.forEach((q: any) => {
        if (q.type === 'checkbox') {
          answersArray.push(this.fb.array(q.options.map(() => false)));
        } else {
          answersArray.push(this.fb.control('', Validators.required));
        }
      });
    }


  get answerControls() {
    return (this.surveyForm.get('answers') as FormArray).controls;
  }

  onSubmit() {
    if (this.surveyForm.valid) {
      console.log('提交的數據：', this.surveyForm.value);
      alert('送出成功！看控制台 (F12)');
    } else {
      alert('請檢查欄位是否填寫完整');
    }
  }
}



