import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CreateTripService } from './create-trip.service';
import { Trip } from '../../../../types/tripType';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CommonModule } from '@angular/common';
import { UtilService } from '../../../shared/util.service';


@Component({
    selector: 'app-create-trip',
    standalone: true,
    imports: [CommonModule, FormsModule, MatFormFieldModule, LoaderComponent],
    templateUrl: './create-trip.component.html',
    styleUrl: './create-trip.component.css'
})
export class CreateTripComponent {
    isLoading: boolean = false;
    fieldError: boolean = false;

    constructor(
        private tripService: CreateTripService,
        private util: UtilService) { }

    onSubmit(form: NgForm): void {
        const myTrip: Trip = form.value

        if (this.tripService.imageUrl.length == 0 || form.invalid) {
            this.fieldError = true;
            return
        }

        this.isLoading = true;
        this.tripService.uploadImageThenCreateTrip(myTrip, this.isLoading)
    }

    onFileSelected(event: any): void {
        if (this.tripService.imageUrl.length > 0) {
            this.tripService.imageUrl = [];
        }
        const files: FileList = event.target.files;
        if (files) {
            for (let i = 0; i < files.length; i++) {
                this.util.getBase64(files[i]).then((data: string) => {
                    this.tripService.imageUrl.push(data)
                });
            }

        }

    }
    resetForm(form: NgForm) {
        form.reset();
    }
}
