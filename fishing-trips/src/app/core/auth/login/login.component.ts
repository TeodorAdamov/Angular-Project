import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.service';
import { from } from 'rxjs';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


@Component({
    selector: 'app-login',
    standalone: true,
    imports: [RouterLink, FormsModule, MatSnackBarModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top'; // Adjust vertical position as needed

    constructor(
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar) {

    }

    submitHandler(form: NgForm) {
        if (!this.authService.currentUser) {
            const { email, password } = form.value
            from(this.authService.signIn(email, password)).subscribe({
                next: UserData => {
                    this.router.navigate(['/home'])
                },
                error: err => {
                    console.error('Sign-in error:', err);
                    this.snackBar.open(`Failed to sign in. Please try again. ${err.message}`, 'Close', {
                        duration: 10000,
                        horizontalPosition: this.horizontalPosition,
                        verticalPosition: this.verticalPosition
                    });
                }
            })
        }
    }
}
