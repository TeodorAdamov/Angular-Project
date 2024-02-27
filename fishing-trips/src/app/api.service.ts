import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Storage, StorageReference, getDownloadURL, ref, uploadBytes } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private firestore: Firestore = inject(Firestore);
    private storage: Storage = inject(Storage);
    items$: Observable<any[]>;

    constructor() {
        const aCollection = collection(this.firestore, 'items');
        this.items$ = collectionData(aCollection);
    }

    getCollection(): Observable<any> {
        return this.items$;
    }

    getStorage(): Observable<string> {
        const imageRef: StorageReference = ref(this.storage, 'gs://softuni-angular-project-dev.appspot.com/I am looking fo 3bf91462-c234-426b-9325-92a9cde0f0ca.png');
        return from(getDownloadURL(imageRef))
    }
}
