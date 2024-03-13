import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { ApiService } from '../../../api.service';
import { Subscription, map } from 'rxjs';
import { Trip } from '../../../../types/tripType';
import { UtilService } from '../../../shared/util.service';
import { RouterLink } from '@angular/router';
import { ref, Storage, uploadBytesResumable } from '@angular/fire/storage';
import { environment } from '../../../environment';
import { updateProfile } from '@angular/fire/auth';

@Component({
    selector: 'app-my-profile',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './my-profile.component.html',
    styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {
    userPostsSubscription!: Subscription
    userTrips: Trip[] = [];
    imageBase64: string = '';
    private readonly storage: Storage = inject(Storage);

    constructor(
        public authService: AuthService,
        private api: ApiService,
        private util: UtilService) { }

    ngOnInit(): void {
        this.userPostsSubscription = this.api.getCollection()
            .pipe(
                map(trips => trips.filter(trip => trip['userID'] == this.authService.currentUser?.uid))
            ).subscribe(filteredTrips => {
                this.userTrips = filteredTrips.map(this.util.convertToTrip)
            })
    }

    onSaveUserProfile(usernameRef: HTMLInputElement, photoRef: HTMLInputElement) {
        const displayName = usernameRef.value;
        const currentUser = this.authService.currentUser;

        if (currentUser) {
            if (this.imageBase64) {
                const imageBlob = this.util.dataURItoBlob(this.imageBase64);
                const imageName = 'profileImages/' + this.util.generateRandomString(20) + '.jpg';
                const storageRef = ref(this.storage, imageName);
                let photoURL: string = '';

                uploadBytesResumable(storageRef, imageBlob).then(() => {

                    this.api.getItemFromFirebaseStorage(environment.firebaseStorage.tripImage + imageName)
                        .then((url) => {
                            photoURL = url
                            if (currentUser) {
                                if (displayName) {
                                    updateProfile(currentUser, { photoURL, displayName })
                                } else {
                                    updateProfile(currentUser, { photoURL })
                                }
                            }
                        }).then(() => {
                            this.imageBase64 = '';
                            photoRef.value = '';
                            usernameRef.value = '';
                        });
                })
            } else if (displayName) {
                updateProfile(currentUser, { displayName }).then(() => {
                    usernameRef.value = '';
                })
            }
        }
    }

    onFileSelected(event: Event): void {
        if (!(event.target instanceof HTMLInputElement)) return;
        if (event.target.files) {
            if (event.target.files[0].type !== 'image/jpeg' &&
                event.target.files[0].type !== 'image/png') {
                return
            }
            const file = event.target.files[0];
            this.util.getBase64(file).then((data: string) => {
                this.imageBase64 = data;
            });
        }
    }
}
