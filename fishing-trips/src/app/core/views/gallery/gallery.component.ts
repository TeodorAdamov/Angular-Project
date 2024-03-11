import { Component, OnInit } from '@angular/core';
import { TripService } from '../trip/trip.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../../api.service';
import { Trip } from '../../../../types/tripType';
import { UtilService } from '../../../shared/util.service';

@Component({
    selector: 'app-gallery',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './gallery.component.html',
    styleUrl: './gallery.component.css'
})
export class GalleryComponent implements OnInit {
    tripGallery: string[] = [];
    tripId: string | null = '';
    trip!: Trip

    constructor(
        private route: ActivatedRoute,
        private api: ApiService,
        private util: UtilService) { }

    ngOnInit(): void {
        this.tripId = this.route.snapshot.paramMap.get('id');



        if (this.tripId) {


            this.api.getFirebaseDocumentById(this.tripId).subscribe((snapshot) => {
                const documentData = snapshot.data();
                if (documentData) {
                    this.trip = this.util.convertToTrip(documentData);
                    if(this.trip.imageUrl) {
                        this.tripGallery = this.trip.imageUrl
                        console.log(this.trip.imageUrl);
                        
                    }
                }
            })
        }
    }
}
