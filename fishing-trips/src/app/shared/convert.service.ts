import { Injectable } from '@angular/core';
import { DocumentData } from '@angular/fire/firestore';
import { Trip } from '../../types/tripType';

@Injectable({
  providedIn: 'root'
})
export class ConvertService {

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
      comments: docData['comments']
    }
  }
}
