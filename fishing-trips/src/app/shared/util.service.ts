import { Injectable } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { Trip } from '../../types/tripType';
import { comment } from '../../types/comments';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor() { }

    convertToTrip(docData: DocumentData): Trip {
        return {
            destination: docData['destination'],
            'fishing-spots': docData['fishing-spots'],
            catches: docData['catches'],
            'lures-used': docData['lures-used'],
            'fishing-shops': docData['fishing-shops'],
            description: docData['description'],
            userID: docData['userID'],
            imageUrl: docData['imageUrl'],
            id: docData['id'],
            likes: docData['likes'],
        }
    }

    convertToComment(docData: DocumentData): comment {
        return {
            comment: docData['comment'],
            id: docData['id'],
            userPhoto: docData['userPhoto'],
            userId: docData['userId'],
            username: docData['username'],
            replies: docData['replies']
        }
    }

    generateRandomString(length: number) {
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        return result;
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
