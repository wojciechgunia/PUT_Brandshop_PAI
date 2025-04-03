import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appInputOnlyNumber]',
})
export class InputOnlyNumberDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    const initialValue = this.el.nativeElement.value;
    this.el.nativeElement.value = initialValue.replace(/[^0-9]/g, '');

    if (initialValue > 300 || initialValue < 1) {
      this.el.nativeElement.value = 1;
    }
  }
}
