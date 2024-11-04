import {Component, OnDestroy, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {TestInputComponent} from './components/test-input/test-input.component';
import {
  AbstractControlOptions, Form,
  FormArray,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {TestFormService} from './test-form.service';
import {TestNumberComponent} from './components/test-number/test-number.component';
import {TestSelectComponent} from './components/test-select/test-select.component';
import {TestCheckboxComponent} from './components/test-checkbox/test-checkbox.component';
import {log} from '@angular-devkit/build-angular/src/builders/ssr-dev-server';
import {JsonPipe} from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TestInputComponent, ReactiveFormsModule, TestNumberComponent, TestSelectComponent, TestCheckboxComponent, JsonPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit, OnDestroy {
  private unsubscribeAll = new Subject<any>();
  public testForm: FormGroup = new FormGroup({});
  public formFields: any[] = [];
  public formData: any;

  constructor(public formService: TestFormService) {
  }

  ngOnInit() {
    this.formService.formData$.pipe(takeUntil(this.unsubscribeAll)).subscribe(data => {
      this.formFields = data.fields
      console.log('data', data)
      this.testForm = new FormGroup({})
      this.createForm()
    })
  }

  createForm(): void {
    this.formFields.forEach((field: any) => {
      const validators: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null | undefined = [];
      if (field.required) {
        validators.push(Validators.required);
      }
      if (field.type === 'checkbox') {
        this.testForm.addControl(field.name, new FormArray([], validators), {emitEvent: false});
        const formArray = this.testForm.get(field.name) as FormArray;
        field.choices.forEach((choice: any) => {
          const existedChoice: number = field.value?.indexOf(choice)
          formArray.push(new FormControl(existedChoice >= 0, validators), {emitEvent: false})
          // formArray.push(new FormControl(existedChoice >= 0 ? true : null, validators), {emitEvent: false})
        })
        const checkAll = new FormControl(false, validators)
        formArray.push(checkAll, {emitEvent: false})
        formArray.controls.forEach(control => {
          control.valueChanges.pipe(takeUntil(this.unsubscribeAll)).subscribe((value: any) => {
            if (checkAll.value && !value) {
              checkAll.setValue(false, {emitEvent: false});
            }
          })
        })
        checkAll.valueChanges.pipe(takeUntil(this.unsubscribeAll)).subscribe(data => {
          formArray.controls.forEach((control: any, index: number, arr: any[]) => {
            if (index !== arr.length - 1) {
              control.setValue(data)
            } else {
              console.log(control)
            }
          })
        })
      } else if (field.multiple) {
        this.testForm.addControl(field.name, new FormArray(field.value ?? [new FormControl('', validators)], validators), {emitEvent: false});
      } else {
        this.testForm.addControl(field.name, new FormControl(field.value ?? '', validators), {emitEvent: false});
      }
    })
    console.log(this.testForm)
  }

  addFieldInArray(formArray: FormArray): void {
    formArray.controls.push(new FormControl(''));
  }

  removeFieldFromArray(formArray: FormArray, index: number) {
    formArray.removeAt(index);
  }

  submit(): void {
    const checkBoxes: any = {}
    this.formFields.forEach(field => {
      if (field.type === 'checkbox') {
        checkBoxes[field.name] = []
        this.getFormArray(field.name).value.forEach((value: any, index: number, arr: []) => {
          if (value && (index !== arr.length - 1)) {
            checkBoxes[field.name].push(field.choices[index])
          }
        })
      }
    })
    const result = this.testForm.getRawValue()
    for (let key in result) {
      if (checkBoxes[key]) {
        result[key] = checkBoxes[key]
      }
      if (Array.isArray(result[key])) {
        result[key] = result[key].filter((item: any) => item != false)
      }
    }
    console.log(result)
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
