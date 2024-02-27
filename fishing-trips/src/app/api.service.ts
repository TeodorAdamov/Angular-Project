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

    getItemFromFirebaseStorage(url: string): Observable<string> {
        const imageRef: StorageReference = ref(this.storage, url);
        return from(getDownloadURL(imageRef))
    }



}
