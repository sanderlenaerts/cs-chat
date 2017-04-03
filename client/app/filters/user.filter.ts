import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'searchFilter' })
export class SearchPipe implements PipeTransform {
  transform(users: any[], [term]) {
    if (term == undefined || term == ''){
      return users;
    }
    return users.filter(user => user.username.includes(term));
  }
}
