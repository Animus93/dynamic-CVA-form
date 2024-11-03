import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy,
  OnInit, Renderer2, signal,
  ViewChild,
  WritableSignal
} from '@angular/core';
import {ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-test-checkbox',
  standalone: true,
  imports: [],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TestCheckboxComponent),
    multi: true
  }],
  templateUrl: './test-checkbox.component.html',
  styleUrl: './test-checkbox.component.scss'
})
export class TestCheckboxComponent implements ControlValueAccessor {
  @ViewChild('value') value!: ElementRef;
  public initialValue: WritableSignal<any> = signal(null);
  public onChange!: (value: any) => void;
  public onTouched!: () => void;

  constructor(private _renderer: Renderer2) {
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  writeValue(obj: any): void {
    this.initialValue.set(obj);
  }


  setValue(): void {
    this.initialValue.set(!this.initialValue())
    this.onChange(this.initialValue())
    this.onTouched()
  }
}
