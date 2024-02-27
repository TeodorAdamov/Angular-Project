import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { from } from 'rxjs';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../../api.service';



@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent {
    googleLogo: string = '';

    constructor(private authService: AuthService, private api: ApiService) {

    }


    submitHandler(form: NgForm) {
        const { email, password } = form.value
        form.reset();
        from(this.authService.getEmailAndPassword(email, password)).subscribe(userData => {
            console.log(userData);

        })
    }

    googleSignIn(): void {
        from(this.authService.byGoogle()).subscribe(data => console.log(data))
    }
}
