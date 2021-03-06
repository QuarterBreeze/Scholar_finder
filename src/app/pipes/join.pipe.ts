import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'join',
})
export class JoinPipe implements PipeTransform {
  transform(value: Array<string>, sep: string = ''): string {
    return value.join(sep);
  }
}
