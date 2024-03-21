import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { from } from 'rxjs';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SnackBarService } from '../../../shared/snackbar.service';
import { PassMatchDirective } from './pass-match.directive';
import { FirebaseError } from '@angular/fire/app';



@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, PassMatchDirective],
    templateUrl: './register.component.html',
    styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy {
    googleLogo: string = '';
    emailAlreadyInUse: boolean = false;

    constructor(
        private authService: AuthService,
        private snackBar: SnackBarService,
        private router: Router) {

    }


    submitHandler(form: NgForm) {
        const { email, password, displayName, photoURL } = form.value

        if (form.invalid) {
            this.snackBar.openSnackBar('Registration is invalid!', 5000)
            return;
        }

        if (!this.authService.currentUser) {
            from(this.authService.getEmailAndPassword(email, password, displayName, photoURL)).subscribe({
                next: () => {
                    this.snackBar.openSnackBar('Registration successful', 3000);
                    form.reset();
                    this.router.navigate(['/home']);
                },
                error: (error: FirebaseError) => {
                    if (error.message.includes('auth/email-already-in-use')) {
                        this.emailAlreadyInUse = true;
                    }
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
