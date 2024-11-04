import {
  AfterViewInit,
  Component,
  ElementRef,
  forwardRef, HostListener,
  Input,
  input,
  OnDestroy,
  OnInit,
  Renderer2, signal,
  ViewChild, WritableSignal
} from '@angular/core';
import {ControlValueAccessor, FormControl, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';

@Component({
  selector: 'app-test-select',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TestSelectComponent),
    multi: true
  }],
  templateUrl: './test-select.component.html',
  styleUrl: './test-select.component.scss'
})
export class TestSelectComponent implements ControlValueAccessor {
  @ViewChild('value') value!: ElementRef;
  @Input() options: any[] = []
  public initialValue: WritableSignal<any> = signal(null);
  public showOptions: boolean = false
  public onChange!: (value: any) => void;
  public onTouched!: () => void;

  constructor(private _renderer: Renderer2, private elementRef: ElementRef) {
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.showOptions = false;
    }
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

  onTouch(): void {
    this.onTouched()
    this.showOptions = !this.showOptions
  }

  setValue(option: any): void {
    this.onChange(option)
    this.initialValue.set(option);
    this.showOptions = !this.showOptions
  }
}
