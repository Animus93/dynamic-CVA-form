import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TestInputComponent} from './components/test-input/test-input.component';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {TestFormService} from './test-form.service';
import {TestNumberComponent} from './components/test-number/test-number.component';
import {TestSelectComponent} from './components/test-select/test-select.component';
import {TestCheckboxComponent} from './components/test-checkbox/test-checkbox.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TestInputComponent, ReactiveFormsModule, TestNumberComponent, TestSelectComponent, TestCheckboxComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribeAll = new Subject<any>();
  public testForm: FormGroup = new FormGroup({
    // name: new FormControl<string>('test'),
    // number: new FormControl<number>(1),
    // checkbox: new FormControl<boolean>(true),
    // select: new FormControl<any>(null)
  });
  // public TEMPoptions = ['test', 'data', 'cast', 'set', 'state']
  public formFields: any[] = [];

  constructor(private formService: TestFormService) {
    this.testForm.valueChanges.pipe(takeUntil(this.unsubscribeAll)).subscribe(data => {
      console.log('testForm', data)
    })
  }

  ngOnInit() {
    this.formService.formData$.pipe(takeUntil(this.unsubscribeAll)).subscribe(data => {
      this.formFields = data.fields
      this.createForm()
    })
  }

  createForm(): void {
    this.formFields.forEach((field: any) => {
      const validators = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      if (field.type === 'checkbox') {
        this.testForm.addControl(field.name, new FormArray([], validators), {emitEvent: false});
        const formArray = this.testForm.get(field.name) as FormArray;
        field.choices.forEach((choice: any) => {
          const existedChoice: number = field.value.indexOf(choice)
          formArray.push(new FormControl(existedChoice >= 0), {emitEvent: false})
        })
        formArray.push(new FormControl(false, validators), {emitEvent: false})
        console.log('formArray',formArray)
      } else {
        this.testForm.addControl(field.name, new FormControl(field.value ?? '', validators), {emitEvent: false});
      }
    })
    console.log('testForm', this.testForm)
  }

  getFormArray(name: string): FormArray {
    return (this.testForm.get(name) as FormArray)
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }

  protected readonly Validators = Validators;
}
