import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { from, repeat } from 'rxjs';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarModule, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { UserType } from '../../../../types/userType';



@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, MatSnackBarModule],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy {
    googleLogo: string = '';
    horizontalPosition: MatSnackBarHorizontalPosition = 'center';
    verticalPosition: MatSnackBarVerticalPosition = 'top'; // Adjust vertical position as needed

    constructor(
        private authService: AuthService,
        private snackBar: MatSnackBar,
        private router: Router) {

    }


    submitHandler(form: NgForm) {
        const { email, password, passwordRepeat, displayName, photoURL } = form.value
        if (!email || !password || !passwordRepeat || !displayName) {
            this.openSnackBar('All fields required, only Photo URL is optional', 10000)
            return;
        }
        if (password.trim().length < 7) {
            this.openSnackBar('Password must be longer than 6 symbols', 5000)
            form.reset();
            return;
        }
        if (password.trim() !== passwordRepeat.trim()) {
            this.openSnackBar('Passwords must match!', 5000)
            form.reset();
            return;
        }

        if (!this.authService.currentUser) {
            form.reset();
            from(this.authService.getEmailAndPassword(email, password, displayName, photoURL)).subscribe({
                next: () => {
                    this.openSnackBar('Registration successful', 3000)
                    this.router.navigate(['/home'])
                },
                error: (error) => {
                    console.error('Registration error:', error);
                }
            });
        }
    }


    openSnackBar(message: string, length: number) {
        this.snackBar.open(message, 'Close', {
            duration: length, // Duration in milliseconds
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition
        });
    }

    googleSignIn(): void {
        this.authService.byGoogle()
    }

    ngOnDestroy(): void {
    }
}
