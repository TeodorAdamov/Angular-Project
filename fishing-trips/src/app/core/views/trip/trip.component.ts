import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { TripsComponent } from '../trips/trips.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Trip } from '../../../../types/tripType';
import { TripsService } from '../trips/trips.service';
import { DocumentData } from '@angular/fire/firestore';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { TripService } from './trip.service';
import { AuthService } from '../../auth/auth.service';

@Component({
    selector: 'app-trip',
    standalone: true,
    imports: [CommonModule, LoaderComponent],
    templateUrl: './trip.component.html',
    styleUrl: './trip.component.css'
})
export class TripComponent implements OnInit {
    tripId: string | null = '';
    trip!: Trip
    documentData: DocumentData | undefined
    isLoading: boolean = true;
    randomImageUrl: string = '';
    isOwner: boolean = false;


    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        private tripsService: TripsService,
        private tripService: TripService,
        private authService: AuthService) { }

    ngOnInit(): void {
        this.tripId = this.route.snapshot.paramMap.get('id');



        if (this.tripId) {

            this.api.getFirebaseDocumentById(this.tripId).subscribe((snapshot) => {
                this.documentData = snapshot.data();
                if (this.documentData) {
                    this.trip = this.tripsService.convertToTrip(this.documentData);
                }
                if (this.trip.imageUrl) {
                    this.randomImageUrl = this.tripService.getRandomImageUrl(this.trip.imageUrl)
                }
                if (this.trip.userID === this.authService.currentUser?.uid) {
                    this.isOwner = true;
                }
                this.isLoading = false;
            })
        }
    }

    onLike() {
        
    }



}
