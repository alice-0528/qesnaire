import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
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
        userData: [
          { key: 'userName', label: '姓名：', type: 'text', required: true },
          { key: 'userEmail',label: 'Email：', type: 'text', required: false, validationType: 'email' },
        ],
        questions: [
          { id: 101, title: '你早餐喝什麼？', type: 'radio', options: ['奶茶', '咖啡', '豆漿', '牛奶'], required: true },
          { id: 102, title: '豆漿接不接受鹹的？', type: 'radio', options: ['當然可以', '哪裡來的邪教？(╬▔皿▔)╯'], required: true }
        ],
      },
      {
        id: 2,
        name: '那些開高走低的爛尾番',
        description: '如題，發洩一下下怨念。',
        userData: [
          { key: 'userName', label: '姓名：', type: 'text', required: true },
          { key: 'userEmail',label: 'Email：', type: 'text', required: false, validationType: 'email' },
        ],
        questions: [
          { id: 201, title: '你最喜歡哪個番(的前期)？', type: 'radio', options: ['咒術回戰', '我推的孩子', '火影忍者'], required: false },
          { id: 202, title: '選出結尾最讓你最失望的番。', type: 'checkbox', options: ['咒術回戰', '我推的孩子', '火影忍者'], required: false },
          { id: 203, title: '我沒寫上但你很失望的？', type: 'text', option: [], required: false }
        ],
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
      // 處理 userData 區塊
      const userGroup: any = {};
      this.currentSurvey.userData.forEach((field: any) => {
        const validators = [];
        if (field.required) validators.push(Validators.required);
        if (field.validationType === 'email') validators.push(Validators.email);

        userGroup[field.key] = ['', validators];
        });

      this.surveyForm = this.fb.group({
      user: this.fb.group(userGroup), // 把使用者資訊包成一個子群組
      answers: this.fb.array([])      // 題目答案維持原樣
      });

      const answersArray = this.surveyForm.get('answers') as FormArray;

      // 根據「撈出來的那份問卷題目」產生表單欄位
      this.currentSurvey.questions.forEach((q: any) => {
        // 建立一個驗證器陣列
        const validators = q.required ? [Validators.required] : [];

        if (q.type === 'checkbox' && q.required) {
          answersArray.push(this.fb.array(q.options.map(() => false), this.minSelectedCheckboxes));
        } else {
          answersArray.push(this.fb.control('', validators));
        }

      });

    }


  get answerControls() {
    return (this.surveyForm.get('answers') as FormArray).controls;
  }

  onSubmit() {
    this.surveyForm.markAllAsTouched();

    if (this.surveyForm.valid) {
      const rawValues = this.surveyForm.value;

      const processedAnswers = rawValues.answers.map((answer: any, index: number) => {
      const question = this.currentSurvey.questions[index];

      if (question.type === 'checkbox') {
        // answer 此時是 [true, false, true]
        // 我們要濾出為 true 的項目，並對應回原始選項名稱
        return question.options.filter((opt: string, i: number) => answer[i]);
      }
      return answer; // 單選或簡答直接回傳
      });

      console.log('提交的答案：', processedAnswers);
      alert('送出成功！');
    } else {
      alert('請檢查欄位是否填寫完整');
    }
  }

  // 一個簡單的自定義驗證：檢查陣列裡是否至少有一個 true
  minSelectedCheckboxes = (control: AbstractControl) => {
    const values = control.value as boolean[];
    const totalSelected = values ? values.filter(v => v === true).length : 0;
    return totalSelected >= 1 ? null : { required: true };
  }

}



