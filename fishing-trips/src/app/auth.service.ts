import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, UserCredential, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from '@angular/fire/auth';



@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth: Auth = inject(Auth)

    constructor() {

    }

    getEmailAndPassword(email: string, password: string) {
        return createUserWithEmailAndPassword(this.auth, email, password)
    }

    byGoogle(): Promise<UserCredential> {
        return signInWithPopup(this.auth, new GoogleAuthProvider());
    }

    signIn(email: string, password: string) {
        return signInWithEmailAndPassword(this.auth, email, password)
    }

    signOut() {
        this.auth.signOut();
    }
}

