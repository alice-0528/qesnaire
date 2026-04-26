import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute } from '@angular/router';
import { SurveyService } from '../../@services/survey.service';

export interface Task {
  name: string;
  completed: boolean;
  subtasks?: Task[];
}


@Component({
  selector: 'app-inner-page',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatRadioModule, MatCheckboxModule, MatButtonModule, MatDividerModule, MatIconModule, ReactiveFormsModule],
  templateUrl: './inner-page.component.html',
  styleUrl: './inner-page.component.scss',
})
export class InnerPageComponent {
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private surveyService: SurveyService
  ) { }

  surveyForm!: FormGroup;
  currentSurvey: any;
  isPreview: boolean = false;
  previewData: any;

  ngOnInit() {
    // 抓取網址上的 id (例如網址是 /inner-page/1，id 就是 "1")
    let idFromUrl = this.route.snapshot.paramMap.get('id');

    // 根據 id 去 allMockData 裡面找資料
    this.currentSurvey = this.surveyService.getSurveyById(Number(idFromUrl));

    if (this.currentSurvey) {
      // 初始化表單
      this.initForm();
    }
  }

  initForm() {
    // userData 區塊
    let userGroup: any = {};
    this.currentSurvey.userData.forEach((field: any) => {
      let validators = [];
      if (field.required) validators.push(Validators.required);
      if (field.validationType === 'email') validators.push(Validators.email);

      userGroup[field.key] = ['', validators];
    });

    this.surveyForm = this.fb.group({
      user: this.fb.group(userGroup), // 把使用者資訊包成一個子群組
      answers: this.fb.array([])      // 題目答案維持原樣
    });

    let answersArray = this.surveyForm.get('answers') as FormArray;

    // 根據「撈出來的那份問卷題目」產生表單欄位
    this.currentSurvey.questions.forEach((q: any) => {
      // 建立一個驗證器陣列
      let validators = q.required ? [Validators.required] : [];

      if (q.type === 'checkbox') {
        let checkboxValidators = q.required ? [this.minSelectedCheckboxes] : [];
        answersArray.push(this.fb.array(q.options.map(() => false), checkboxValidators));
      } else {
        answersArray.push(this.fb.control('', validators));
      }

    });

  }


  get answerControls() {
    return (this.surveyForm.get('answers') as FormArray).controls;
  }

  editBack() {
    this.isPreview = false; // 切換回編輯模式
  }

  isArray(val: any): boolean {
    return Array.isArray(val);
  }

  onSubmit() {
    this.surveyForm.markAllAsTouched(); //直接送出會視為全部觸發(觸發必填未填提示)

    if (this.surveyForm.valid) {
      let rawValues = this.surveyForm.value;

      this.previewData = {
        surveyName: this.currentSurvey.name,
        description: this.currentSurvey.description,
        userName: rawValues.user.userName,
        userEmail: rawValues.user.userEmail,
        processedAnswers: rawValues.answers.map((answer: any, index: number) => {
          let question = this.currentSurvey.questions[index];

          if (question.type === 'checkbox') {
            // answer 此時是 [true, false, true]
            // 我們要濾出為 true 的項目，並對應回原始選項名稱
            return question.options.filter((opt: string, i: number) => answer[i]);
          }
          return answer; // 單選或簡答直接回傳
        })
      };

      console.log('提交的答案：', this.previewData);
      localStorage.setItem('temp_preview', JSON.stringify(this.previewData));
      this.isPreview = true;

      // 滾動到頂部，讓使用者看到預覽頁開頭
      window.scrollTo(0, 0);
    } else {
      alert('請檢查欄位是否填寫完整');
    }


  }

  finalSubmit() {

  }


  // 一個簡單的自定義驗證：檢查陣列裡是否至少有一個 true
  minSelectedCheckboxes = (control: AbstractControl) => {
    let values = control.value as boolean[];
    let totalSelected = values ? values.filter(v => v === true).length : 0;
    return totalSelected >= 1 ? null : { required: true };
  }

}



