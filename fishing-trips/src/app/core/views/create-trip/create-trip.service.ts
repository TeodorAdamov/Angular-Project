import { Injectable, inject } from '@angular/core';
import { Storage, ref, uploadBytesResumable } from '@angular/fire/storage';
import { environment } from '../../../environment';
import { ApiService } from '../../../api.service';
import { Trip } from '../../../../types/tripType';
import { AuthService } from '../../auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class CreateTripService {
    imageUrl: string = '';
    private readonly storage: Storage = inject(Storage);


    constructor(private api: ApiService, private authService: AuthService) { }

    uploadImageThenCreateTrip(myTrip: Trip) {

        if (this.authService.currentUser) {

            const imageName = 'images/' + new Date().getTime() + '.jpg'
            const storageRef = ref(this.storage, imageName);
            const imageBlob = this.dataURItoBlob(this.imageUrl);

            uploadBytesResumable(storageRef, imageBlob).then(() => {
                this.api.getItemFromFirebaseStorage(environment.firebaseStorage.tripImage + imageName).subscribe({
                    next: (link) => {
                        myTrip.imageUrl = link;
                        this.api.createTrip(myTrip)?.then((res) => {
                            console.log(res);
                        });
                    },
                    complete: () => {

                    }
                })
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
