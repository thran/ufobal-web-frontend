import { Injectable, Pipe, PipeTransform } from '@angular/core';

export type SortOrder = 'asc' | 'desc';

@Injectable()
@Pipe({
  name: 'sort',
})
export class SortPipe implements PipeTransform {
  transform(value: any[], sortKey: string, sortOrder: SortOrder | string = 'asc'): any {
    sortOrder = sortOrder && (sortOrder.toLowerCase() as any);
    if (sortKey && sortKey?.startsWith('-')) {
      sortOrder = 'desc';
      sortKey = sortKey.substring(1);
    }

    if (!value || (sortOrder !== 'asc' && sortOrder !== 'desc')) return value;
    let sorted = [];

    if (sortKey) {
      const sortKeys = sortKey.split('.');
      sorted = value.sort((a, b) => {
        let v1 = sortKeys.reduce((d, k) => d[k], a)
        let v2 = sortKeys.reduce((d, k) => d[k], b)
        if (v1 < v2) return -1;
        else if (v1 > v2) return 1;
        else return 0;
      });
    } else {
      sorted = value.sort();
    }
    return sortOrder === 'asc' ? sorted : sorted.reverse();
  }
}
