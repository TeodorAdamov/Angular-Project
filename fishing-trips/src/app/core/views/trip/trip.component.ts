import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../../../api.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Trip } from '../../../../types/tripType';
import { DocumentData } from '@angular/fire/firestore';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { TripService } from './trip.service';
import { AuthService } from '../../auth/auth.service';
import { ConvertService } from '../../../shared/convert.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommentsComponent } from '../comments/comments.component';

@Component({
    selector: 'app-trip',
    standalone: true,
    imports: [CommonModule, LoaderComponent, ConfirmDialogComponent, RouterLink, CommentsComponent],
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
    hasLiked: boolean = false;
    likesCount: number = 0;
    isCommenting: boolean = true;

    constructor(
        private api: ApiService,
        private route: ActivatedRoute,
        private router: Router,
        private convertService: ConvertService,
        private tripService: TripService,
        private authService: AuthService,
        public dialog: MatDialog) { }

    ngOnInit(): void {
        this.tripId = this.route.snapshot.paramMap.get('id');



        if (this.tripId) {


            this.api.getFirebaseDocumentById(this.tripId).subscribe((snapshot) => {
                this.documentData = snapshot.data();
                if (this.documentData) {
                    this.trip = this.convertService.convertToTrip(this.documentData);
                }
                if (this.trip.imageUrl) {
                    this.randomImageUrl = this.tripService.getRandomImageUrl(this.trip.imageUrl)
                }
                if (this.trip.userID === this.authService.currentUser?.uid) {
                    this.isOwner = true;
                }
                if (this.authService.currentUser?.uid) {
                    if (this.trip.likes.includes(this.authService.currentUser?.uid)) {
                        this.hasLiked = true;
                    }

                }
                this.likesCount = this.trip.likes.length; ``
                this.isLoading = false;
            })
        }
    }

    onLike() {
        const userID = this.authService.currentUser?.uid
        const tripID = this.tripId;
        if (userID && tripID) {
            this.tripService.like(userID, tripID);
            this.hasLiked = !this.hasLiked;
            if (this.hasLiked) {
                this.likesCount++;
            } else {
                this.likesCount--;
            }
        }
    }

    onDelete() {
        const tripID = this.tripId;
        if (tripID) {
            this.openDialog('0ms', '0ms').afterClosed().subscribe(result => {
                if (result) {
                    this.tripService.delete(tripID)
                    this.router.navigate(['/trips'])
                }
            })




        }
    }

    onComment() {
        this.isCommenting = !this.isCommenting
    }

    openDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
        return this.dialog.open(ConfirmDialogComponent, {
            width: '250px',
            enterAnimationDuration,
            exitAnimationDuration,
        });
    }

}
