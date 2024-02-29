import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateTripService } from './create-trip.service';
import { Trip } from '../../../../types/tripType';


@Component({
    selector: 'app-create-trip',
    standalone: true,
    imports: [FormsModule, MatFormFieldModule],
    templateUrl: './create-trip.component.html',
    styleUrl: './create-trip.component.css'
})
export class CreateTripComponent {


    constructor(private tripService: CreateTripService) { }

    onSubmit(form: NgForm): void {
        const myTrip: Trip = form.value

        if (!this.tripService.imageUrl
            || !myTrip.catches
            || !myTrip.description
            || !myTrip.destination
            || !myTrip['fishing-shops']
            || !myTrip['lures-used']
            || !myTrip['fishing-spots']) {
            return;
        }

        this.tripService.uploadImageThenCreateTrip(myTrip)
    }


    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            this.tripService.getBase64(file).then((data: string) => {
                this.tripService.imageUrl = data;
            });
        }

    }




    resetForm(form: NgForm) {
        form.reset();
    }
}
