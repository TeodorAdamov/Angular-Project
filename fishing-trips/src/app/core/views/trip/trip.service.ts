import { Injectable } from '@angular/core';
import { ApiService } from '../../../api.service';

@Injectable({
    providedIn: 'root'
})
export class TripService {

    constructor(private api: ApiService) { }


    getRandomImageUrl(imageArr: string[]) {
        return imageArr[Math.floor(Math.random() * imageArr.length)]
    }


    like(userId: string, tripId: string) {
        this.api.addLikeToATrip(userId, tripId)

    }

    delete(userId: string) {
        this.api.deleteTrip(userId)
    }
}
