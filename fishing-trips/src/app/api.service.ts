import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ApiService {

    firestore: Firestore = inject(Firestore);
    items$: Observable<any[]>;

    constructor() {
        const aCollection = collection(this.firestore, 'items');
        this.items$ = collectionData(aCollection);
    }

    getCollection(): Observable<any> {
        return this.items$;
    }
}
