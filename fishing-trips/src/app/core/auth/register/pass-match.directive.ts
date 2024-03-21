import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

@Directive({
    selector: '[appPassMatch]',
    standalone: true,
    providers: [{
        provide: NG_VALIDATORS,
        useExisting: PassMatchDirective,
        multi: true,
    }]
})
export class PassMatchDirective implements Validator {
    @Input() appPassMatch: string | undefined;

    constructor() { }
    validate(control: AbstractControl<any, any>): ValidationErrors | null {
        const password = this.appPassMatch;
        const confirmPassword = control.value;

        if (password !== confirmPassword) {
            return { appPassMatch: true }
        }
        return null;
    }
}
