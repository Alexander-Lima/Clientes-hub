import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isblank'
})
export class IsblankPipe implements PipeTransform {
  transform(value: string | undefined | null): string | undefined{
    return value ? value?.toUpperCase() : "----";
  }
}
