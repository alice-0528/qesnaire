import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SurveyService {
  constructor() {}

  allMockData = [
    {
      id: 1,
      name: '早餐喜好調查',
      description: '想了解大家早餐都吃什麼。',
      startDate: '2026/04/26',
      endDate: '2026/12/26',
      userData: [
        { key: 'userName', label: '姓名：', type: 'text', required: true },
        {
          key: 'userEmail',
          label: 'Email：',
          type: 'text',
          required: false,
          validationType: 'email',
        },
      ],
      questions: [
        {
          id: 101,
          title: '你早餐喝什麼？',
          type: 'radio',
          options: ['奶茶', '咖啡', '豆漿', '牛奶'],
          required: true,
        },
        {
          id: 102,
          title: '豆漿接不接受鹹的？',
          type: 'radio',
          options: ['當然可以', '哪裡來的邪教？(╬▔皿▔)╯'],
          required: true,
        },
      ],
    },
    {
      id: 2,
      name: '那些開高走低的爛尾番',
      description: '如題，發洩一下下怨念。',
      startDate: '2026/04/26',
      endDate: '2026/12/26',
      userData: [
        { key: 'userName', label: '姓名：', type: 'text', required: true },
        {
          key: 'userEmail',
          label: 'Email：',
          type: 'text',
          required: false,
          validationType: 'email',
        },
      ],
      questions: [
        {
          id: 201,
          title: '你最喜歡哪個番(的前期)？',
          type: 'radio',
          options: ['咒術回戰', '我推的孩子', '火影忍者'],
          required: false,
        },
        {
          id: 202,
          title: '選出結尾最讓你最失望的番。',
          type: 'checkbox',
          options: ['咒術回戰', '我推的孩子', '火影忍者'],
          required: false,
        },
        {
          id: 203,
          title: '我沒寫上但你很失望的？',
          type: 'text',
          option: [],
          required: false,
        },
      ],
    },
  ];

  // 提供一個方法讓大家拿清單
  getSurveys() {
    return this.allMockData;
  }

  // 提供一個方法讓內頁根據 ID 找問卷
  getSurveyById(id: number) {
    return this.allMockData.find((s) => s.id === id);
  }
}
