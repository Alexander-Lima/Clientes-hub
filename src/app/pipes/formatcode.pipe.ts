import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatcode'
})
export class FormatcodePipe implements PipeTransform {
  transform(value: string | null): string | null {
    if(value == null) return value;
    switch (value.trim().length) {
      case 14:
        return `${value.slice(0, 2)}.${value.slice(2, 5)}.${value.slice(5, 8)}/${value.slice(8, 12)}-${value.slice(12, 14)}`;
      case 11: 
        return `${value.slice(0, 3)}.${value.slice(3, 6)}.${value.slice(6, 9)}-${value.slice(9, 11)}`;
      default:
        return value;
    }
  }
}
