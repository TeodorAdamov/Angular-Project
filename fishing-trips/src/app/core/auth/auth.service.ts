import { Injectable, OnDestroy, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, User, UserCredential, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile, } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { HeaderService } from '../header/header.service';
import { ApiService } from '../../api.service';
import { environment } from '../../environment';






@Injectable({
    providedIn: 'root'
})
export class AuthService implements OnDestroy {
    private auth: Auth = inject(Auth)
    authState$ = authState(this.auth);
    userSubscription: Subscription
    currentUser: User | null = null;


    constructor(private api: ApiService) {
        this.userSubscription = this.authState$.subscribe((aUser: User | null) => {
            if (aUser) {
                this.currentUser = aUser;
            }
        })
    }

    async getEmailAndPassword(email: string, password: string, displayName: string, photoURL?: string) {
        const userData = await createUserWithEmailAndPassword(this.auth, email, password)
        const currentUser = this.auth.currentUser;
        if (currentUser) {
            if (!photoURL) {
                this.api.getItemFromFirebaseStorage(environment.firebaseStorage.defaultProfileImage).then((link) => {
                    photoURL = link

                }).then(() => {
                    updateProfile(currentUser, { displayName, photoURL })
                })
            } else {
                await updateProfile(currentUser, { displayName, photoURL })
            }
        }

        return userData;
    }

    byGoogle(): Promise<UserCredential> {
        return signInWithPopup(this.auth, new GoogleAuthProvider());
    }

    signIn(email: string, password: string): Promise<UserCredential> {
        return signInWithEmailAndPassword(this.auth, email, password)
    }

    signOut() {
        this.auth.signOut();
    }



    ngOnDestroy(): void {
        this.userSubscription.unsubscribe();
    }
}


