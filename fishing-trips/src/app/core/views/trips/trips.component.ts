import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Trip } from '../../../../types/tripType';
import { TripsService } from './trips.service';
import { DocumentData } from '@angular/fire/firestore';
import { RouterLink } from '@angular/router';
import { TripComponent } from '../trip/trip.component';

@Component({
    selector: 'app-trips',
    standalone: true,
    imports: [CommonModule, RouterLink, TripComponent],
    templateUrl: './trips.component.html',
    styleUrl: './trips.component.css'
})
export class TripsComponent implements OnInit, OnDestroy {
    tripsSubscription?: Subscription
    trips: Trip[] = []
    constructor(
        private api: ApiService,
        private tripsService: TripsService) { }


    ngOnInit(): void {
        this.tripsSubscription = this.api.getCollection().subscribe((trips: DocumentData[]) => {
            this.trips = trips.map(trip => this.tripsService.convertToTrip(trip))
        })
    }


    ngOnDestroy(): void {
        this.tripsSubscription?.unsubscribe();
    }
}
