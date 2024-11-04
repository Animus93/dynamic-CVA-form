import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestFormService {
  public data = {
    "fields": [
      {
        "label": "Имя",
        "name": "name",
        "value": "",
        "description": "Укажите ваше имя",
        "required": true,
        "type": "text"
      },
      {
        "label": "ВУЗ",
        "name": "university",
        "value": "",
        "multiple": true,
        "description": "Укажите заведения, в которых вы учились.",
        "required": false,
        "type": "text"
      },
      {
        "label": "Возраст",
        "value": "",
        "name": "age",
        "description": "",
        "required": true,
        "type": "number"
      },
      {
        "label": "Семейное положение",
        "value": "",
        "name": "maritalStatus",
        "description": "",
        "required": true,
        "type": "select",
        "choices": ["Не женат / не замужем", "Женат / замужем"]
      },
      {
        "label": "Место рождения",
        "name": "birthPlace",
        "value": "",
        "description": "",
        "required": false,
        "type": "select",
        "choices": [
          "Не важно",
          "Астрахань",
          "Волгоград",
          "Волжский",
          "Ростов-на-Дону",
          "Саратов",
          "Элиста"
        ]
      },
      {
        "label": "Навыки",
        "name": "skills",
        "value": ["Вождение"],
        "description": "",
        "required": false,
        "multiple": true,
        "type": "checkbox",
        "choices": [
          "Общение",
          "Иностранные языки",
          "Бег с препятствиями",
          "Быстрое чтение",
          "Самозащита",
          "Вождение",
          "Программирование",
          "Управление вертолетом",
          "Оперное пение"]
      },
    ]
  }

  private formDataSubject: BehaviorSubject<any> = new BehaviorSubject<any>(this.data);
  public formData$: Observable<any> = this.formDataSubject.asObservable();

  constructor() {
  }

  updateData(data: any): void {
    if (data) {
      this.formDataSubject.next({"fields": JSON.parse(data?.target?.value)})
    }
  }
}
