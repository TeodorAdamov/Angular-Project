import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { ApiService } from '../../../api.service';
import { Trip } from '../../../../types/tripType';
import { AuthService } from '../../auth/auth.service';
import { Router } from '@angular/router';
import { environment } from '../../../environment';
import { UtilService } from '../../../shared/util.service';


@Injectable({
    providedIn: 'root'
})
export class CreateTripService {
    imageUrl: string[] = [];
    imageBlobs: Blob[] = [];
    imageLinks: string[] = [];
    promiseArray: Promise<string>[] = [];
    private readonly storage: Storage = inject(Storage);


    constructor(
        private api: ApiService,
        private authService: AuthService,
        private router: Router,
        private util: UtilService) { }

    async uploadImageThenCreateTrip(myTrip: Trip, isLoading: boolean) {

        if (this.authService.currentUser) {

            //CONVERTING IMAGE URI TO IMAGE BLOBS

            for (let i = 0; i < this.imageUrl.length; i++) {

                const imageBlob = this.dataURItoBlob(this.imageUrl[i]);
                this.imageBlobs.push(imageBlob)
            }

            //UPLOADING TO FIREBASE STORAGE THEN GETTING THE LINK FOR EVERY IMAGE AND PUSHING IN ARRAY
            //COLLECTING ALL THE PROMISES IN AN ARRAY 

            for (let blob of this.imageBlobs) {
                const imageName = 'images/' + this.util.generateRandomString(20) + '.jpg'
                const storageRef = ref(this.storage, imageName);


                await uploadBytesResumable(storageRef, blob).then((res) => {
                    this.promiseArray.push(this.api.getItemFromFirebaseStorage(environment.firebaseStorage.tripImage + imageName))
                })
            }

            //WHEN ALL PROMISES ARE RESOLVED CREATING MY POST AND REDIRECTING TO TRIPS PAGE

            Promise.all(this.promiseArray).then((res) => {
                this.imageLinks = res;
            }).then(() => {
                myTrip.imageUrl = this.imageLinks;
                myTrip.userID = this.authService.currentUser?.uid
                myTrip.likes = [];
                this.api.createTrip(myTrip)
            }).finally(() => {
                this.imageUrl = [];
                this.imageBlobs = [];
                this.imageLinks = [];
                this.promiseArray = [];
                isLoading = false;
                this.router.navigate(['/trips']);
            })
        }
    }

    getBase64(file: File): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    }

    dataURItoBlob(dataURI: string): Blob {
        const byteString = atob(dataURI.split(',')[1]);
        const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);

        for (let i = 0; i < byteString.length; i++) {
            intArray[i] = byteString.charCodeAt(i);
        }

        return new Blob([intArray], { type: mimeString });
    }


}
