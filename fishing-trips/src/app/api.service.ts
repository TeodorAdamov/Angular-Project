import { Injectable, inject } from '@angular/core';
import {
    CollectionReference,
    DocumentData,
    DocumentSnapshot,
    Firestore,
    addDoc,
    collection,
    collectionData,
    deleteDoc,
    doc,
    getDoc,
    setDoc,
    updateDoc,
} from '@angular/fire/firestore';
import { Storage, StorageReference, getDownloadURL, ref } from '@angular/fire/storage';
import { Observable, from, take } from 'rxjs';
import { UserCredential } from '@angular/fire/auth';
import { Trip } from '../types/tripType';
import { UtilService } from './shared/util.service';
import { comment, reply } from '../types/comments';
import { CommaExpr } from '@angular/compiler';

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

    constructor(private util: UtilService) {
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
                const trip = this.util.convertToTrip(tripDocumentData);

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


    editTrip(updatedTrip: Trip) {
        const tripId = updatedTrip.id
        const tripRef = doc(collection(this.firestore, 'trips'), tripId);
        return setDoc(tripRef, updatedTrip);
    }


    async deleteTrip(tripId: string) {
        const tripRef = doc(collection(this.firestore, 'trips'), tripId);


        const commentsQuery = collection(this.firestore, `trips/${tripId}/comments`);
        const commentsCollection = collectionData(commentsQuery).pipe(take(1)).toPromise();
        const commentsData = await commentsCollection;

        if (commentsData) {
            const comments = commentsData.map(this.util.convertToComment)
            for (let comment of comments) {
                const commentDocRef = doc(commentsQuery, comment.id)
                await deleteDoc(commentDocRef)
            }
            deleteDoc(tripRef)
        }
    }


    addComment(comment: comment, tripId: string,) {
        const commentsCollectionRef = collection(this.firestore, `trips/${tripId}/comments`);
        addDoc(commentsCollectionRef, comment).then((res) => {
            const commentId = res.id;
            const commentRef = doc(collection(this.firestore, `trips/${tripId}/comments`), commentId);
            updateDoc(commentRef, { id: commentId })
        })
    }



    addReplyToComment(reply: reply, tripId: string, commentId: string) {
        const commentRef = doc(collection(this.firestore, `/trips/${tripId}/comments`), commentId);
        from(getDoc(commentRef)).subscribe((res) => {
            const commentDocumentData = res.data();

            if (commentDocumentData) {
                const comment = this.util.convertToComment(commentDocumentData);
                comment.replies.push(reply);
                setDoc(commentRef, comment)
            }
        });
    }


    getCommentsForATrip(tripId: string) {
        const commentsCollectionRef = collection(this.firestore, `trips/${tripId}/comments`);
        return collectionData(commentsCollectionRef);
    }


    //EDIT COMMENT AND COMMENT REPLY

    updateComment(comment: comment, tripId: string) {
        const commentId = comment.id
        const docRef = doc(collection(this.firestore, `trips/${tripId}/comments`), commentId)
        setDoc(docRef, comment)
    }

    updateReply(reply: reply, commentObj: comment, tripId: string) {
        const commentId = commentObj.id;
        const docRef = doc(collection(this.firestore, `trips/${tripId}/comments`), commentId);

        getDoc(docRef).then((result) => {
            const commentData = result.data();

            if (commentData) {
                const comment = this.util.convertToComment(commentData);
                const replyRef = comment.replies.find((rep) => rep.id == reply.id);

                if (replyRef) {
                    const index = comment.replies.indexOf(replyRef);
                    comment.replies.splice(index, 1, reply);
                    console.log(comment);


                }
                setDoc(docRef, comment)
            }

        })

        console.log(docRef);



    }

    //DELETE COMMENT AND REPLY

    deleteComment(commentId: string, tripId: string) {
        const commentRef = doc(collection(this.firestore, `trips/${tripId}/comments`), commentId)
        deleteDoc(commentRef);
    }

    deleteReply(replyId: string, commentId: string, tripId: string) {
        const commentRef = doc(collection(this.firestore, `trips/${tripId}/comments`), commentId)
        getDoc(commentRef).then((result) => {
            const commentData = result.data();
            if (commentData) {
                const comment = this.util.convertToComment(commentData);
                const replyRef = comment.replies.find((reply) => reply.id == replyId);
                if (replyRef) {
                    const index = comment.replies.indexOf(replyRef)
                    comment.replies.splice(index, 1);
                    setDoc(commentRef, comment)
                }
            }
        })
    }
}