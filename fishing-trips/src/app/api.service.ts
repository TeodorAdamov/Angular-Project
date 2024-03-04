import { Injectable, inject } from '@angular/core';

import { CollectionReference, DocumentData, DocumentSnapshot, Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDoc, setDoc, updateDoc } from '@angular/fire/firestore';
import { Storage, StorageReference, getDownloadURL, ref } from '@angular/fire/storage';
import { Observable, from } from 'rxjs';
import { UserCredential, user } from '@angular/fire/auth';
import { Trip } from '../types/tripType';
import { ConvertService } from './shared/convert.service';

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

    constructor(private convertService: ConvertService) {
        const tripsCollectionRef = collection(this.firestore, 'trips');
        this.tripsCollectionRef = tripsCollectionRef
        this.trips$ = collectionData(tripsCollectionRef);
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
        addDoc(this.tripsCollectionRef, trip).then((res) => {
            const docId = res.id;
            const tripRef = doc(collection(this.firestore, 'trips'), docId);
            updateDoc(tripRef, { id: docId })
        })
    }

    addLikeToATrip(userId: string, tripId: string) {

        this.getFirebaseDocumentById(tripId).subscribe((res) => {

            if (res.exists()) {
                const tripRef = doc(collection(this.firestore, 'trips'), tripId);
                const tripDocumentData = res.data();
                const trip = this.convertService.convertToTrip(tripDocumentData);

                if (trip.likes.includes(userId)) {
                    const index = trip.likes.indexOf(userId)
                    trip.likes.splice(index, 1)
                } else {
                    trip.likes.push(userId);
                }

                setDoc(tripRef, trip);
            }
        })
    }


    deleteTrip(tripId: string) {
        const tripRef = doc(collection(this.firestore, 'trips'), tripId);
        deleteDoc(tripRef);
    }
}