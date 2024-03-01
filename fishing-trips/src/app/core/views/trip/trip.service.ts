import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TripService {

    constructor() { }


    getRandomImageUrl(imageArr: string[]) {
        return imageArr[Math.floor(Math.random() * imageArr.length)]
    }
}
