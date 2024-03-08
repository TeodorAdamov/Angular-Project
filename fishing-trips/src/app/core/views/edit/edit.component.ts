import { Component } from '@angular/core';
import { ApiService } from '../../../api.service';
import { Trip } from '../../../../types/tripType';
import { DocumentData } from '@angular/fire/firestore';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UtilService } from '../../../shared/util.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
    selector: 'app-edit',
    standalone: true,
    imports: [LoaderComponent, CommonModule, RouterLink, FormsModule],
    templateUrl: './edit.component.html',
    styleUrl: './edit.component.css'
})
export class EditComponent {
    tripId: string | null = '';
    trip!: Trip
    documentData: DocumentData | undefined
    isLoading: boolean = true;

    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        private util: UtilService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.tripId = this.route.snapshot.paramMap.get('id');



        if (this.tripId) {


            this.api.getFirebaseDocumentById(this.tripId).subscribe((snapshot) => {
                this.documentData = snapshot.data();
                if (this.documentData) {
                    this.trip = this.util.convertToTrip(this.documentData);
                }
                this.isLoading = false;
            })
        }
    }


    onSubmit(form: NgForm) {
        const myTrip: Trip = form.value

        if (!myTrip.catches
            || !myTrip.description
            || !myTrip['fishing-shops']
            || !myTrip['lures-used']
            || !myTrip['fishing-spots']) {
            return;
        } else {
            this.trip = { ...this.trip, ...myTrip };
        }
        this.api.editTrip(this.trip).then(() => {
            this.router.navigate(['/trips', this.trip.id])
        })

    }
}
