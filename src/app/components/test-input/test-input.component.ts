import {Component, forwardRef, OnDestroy} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-test-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TestInputComponent),
    multi: true
  }],
  templateUrl: './test-input.component.html',
  styleUrl: './test-input.component.scss'
})
export class TestInputComponent implements ControlValueAccessor, OnDestroy {
  private unsubscribeAll = new Subject<any>();

  public input: FormControl<string> = new FormControl();
  public onChange!: (value: any) => void;
  public onTouched!: () => void;

  constructor() {
    this.input.valueChanges.pipe(takeUntil(this.unsubscribeAll)).subscribe(value => {
      if (this.onChange) {
        this.onChange(value);
      }
    })
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  writeValue(obj: any): void {
    this.input.setValue(obj)
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}
