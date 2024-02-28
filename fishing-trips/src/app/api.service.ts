import { Injectable, inject } from '@angular/core';

import { CollectionReference, DocumentData, Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Storage, StorageReference, getDownloadURL, ref } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { UserCredential } from '@angular/fire/auth';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private firestore: Firestore = inject(Firestore);
    private storage: Storage = inject(Storage);
    users$: Observable<DocumentData>;
    usersCollection: CollectionReference;
    userData!: UserCredential

    constructor() {
        const userProfileCollection = collection(this.firestore, 'users');
        this.usersCollection = collection(this.firestore, 'users');
        this.users$ = collectionData(userProfileCollection);

    }

    getCollection(): Observable<any> {
        return this.users$;
    }

    getItemFromFirebaseStorage(url: string): Observable<string> {
        const imageRef: StorageReference = ref(this.storage, url);
        return from(getDownloadURL(imageRef))
    }
}