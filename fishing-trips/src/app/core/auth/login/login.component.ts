import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { from } from 'rxjs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FirebaseError } from '@angular/fire/app';
import { CommonModule } from '@angular/common';
import { SnackBarService } from '../../../shared/snackbar.service';


@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, FormsModule, MatSnackBarModule, CommonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    invalidEmailOrPassword: boolean = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private snackBar: SnackBarService) {

    }

    submitHandler(form: NgForm) {
        if (!this.authService.currentUser) {
            const { email, password } = form.value
            from(this.authService.signIn(email, password)).subscribe({
                next: () => {
                    form.reset();
                    this.router.navigate(['/home']);
                    this.snackBar.openSnackBar('Login Successful', 3000);
                },
                error: (error: FirebaseError) => {

                    if (error.message.includes('auth/invalid-credential')) {
                        this.invalidEmailOrPassword = true;
                    }
                }
            })
        }
    }
}
