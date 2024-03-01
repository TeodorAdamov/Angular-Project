import { Injectable, inject } from '@angular/core';

import { CollectionReference, DocumentData, DocumentSnapshot, Firestore, addDoc, collection, collectionData, doc, getDoc } from '@angular/fire/firestore';
import { Storage, StorageReference, getDownloadURL, ref } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { UserCredential } from '@angular/fire/auth';
import { Trip } from '../types/tripType';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    private firestore: Firestore = inject(Firestore);
    private storage: Storage = inject(Storage);
    trips$: Observable<(DocumentData | (DocumentData & { id: string }))[]>;
    tripsCollectionRef: CollectionReference;
    userData!: UserCredential
    trip$!: Promise<DocumentSnapshot<DocumentData, DocumentData>>

    constructor() {
        const tripsCollectionRef = collection(this.firestore, 'trips');
        this.tripsCollectionRef = tripsCollectionRef
        this.trips$ = collectionData(tripsCollectionRef, { idField: 'id' });
    }

    getFirebaseDocumentById(id: string) {
        const documentRef = doc(collection(this.firestore, 'trips'), id);
        this.trip$ = getDoc(documentRef);
        return from(this.trip$);
    }

    getCollection() {
        return this.trips$;
    }

    getItemFromFirebaseStorage(url: string): Promise<string> {
        const imageRef: StorageReference = ref(this.storage, url);
        return getDownloadURL(imageRef)
    }

    createTrip(trip: Trip) {
        if (!trip) {
            return;
        }
        return addDoc(this.tripsCollectionRef, trip);
    }
}