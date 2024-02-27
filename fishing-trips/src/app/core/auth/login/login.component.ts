import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../auth.service';
import { user } from '@angular/fire/auth';
import { from } from 'rxjs';


@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, FormsModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {

    constructor(private authService: AuthService) {

    }

    submitHandler(form: NgForm) {
        const { email, password } = form.value
        from(this.authService.signIn(email, password)).subscribe(userData => {
            console.log(userData);

        });


    }
}
