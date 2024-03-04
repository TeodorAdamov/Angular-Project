import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { from, repeat } from 'rxjs';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { UserType } from '../../../../types/userType';
import { SnackBarService } from '../../../shared/snackbar.service';



@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, RouterOutlet],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy {
    googleLogo: string = '';

    constructor(
        private authService: AuthService,
        private snackBar: SnackBarService,
        private router: Router) {

    }


    submitHandler(form: NgForm) {
        const { email, password, passwordRepeat, displayName, photoURL } = form.value
        if (!email || !password || !passwordRepeat || !displayName) {
            this.snackBar.openSnackBar('All fields required, only Photo URL is optional', 10000)
            return;
        }
        if (password.trim().length < 7) {
            this.snackBar.openSnackBar('Password must be longer than 6 symbols', 8000)
            form.reset();
            return;
        }
        if (password.trim() !== passwordRepeat.trim()) {
            this.snackBar.openSnackBar('Passwords must match!', 5000)
            form.reset();
            return;
        }

        if (!this.authService.currentUser) {
            form.reset();
            from(this.authService.getEmailAndPassword(email, password, displayName, photoURL)).subscribe({
                next: () => {
                    this.snackBar.openSnackBar('Registration successful', 3000)
                    this.router.navigate(['/home'])
                },
                error: (error) => {
                    console.error('Registration error:', error);
                }
            });
        }
    }


    googleSignIn(): void {
        this.authService.byGoogle()
    }

    ngOnDestroy(): void {
    }
}
