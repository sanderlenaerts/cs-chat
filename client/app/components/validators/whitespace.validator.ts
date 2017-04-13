


import {FormControl} from '@angular/forms';

export class WhitespaceValidator {

   static hasNoWhiteSpace(control: FormControl){
       if (control.value){
        var hasWhitespace =  control.value.replace(/ /g,'').length !== control.value.length;
        var isValid = !hasWhitespace;
        return isValid ? null : { 'whitespace': true }
       }

       else {
           return {'whitespace': true}
       }
    
    }
}