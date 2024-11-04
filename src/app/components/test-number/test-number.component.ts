import {Component, forwardRef, OnDestroy} from '@angular/core';
import {ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-test-number',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TestNumberComponent),
    multi: true
  }],
  templateUrl: './test-number.component.html',
  styleUrl: './test-number.component.scss'
})
export class TestNumberComponent implements ControlValueAccessor, OnDestroy {
  private unsubscribeAll = new Subject<any>();

  public input: FormControl<number> = new FormControl();
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

  increase(): void {
    this.input.setValue(Number(this.input.value + 1))
  }

  decrease(): void {
    if ((this.input.value - 1) > 0) {
      this.input.setValue(Number(this.input.value - 1))
    }
  }

  ngOnDestroy() {
    this.unsubscribeAll.next(null);
    this.unsubscribeAll.complete();
  }
}
