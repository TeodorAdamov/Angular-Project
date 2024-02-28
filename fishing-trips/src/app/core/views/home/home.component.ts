import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../../api.service';
import { environment } from '../../../environment';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
    siteLogo: string = '';
    constructor(private router: Router, private api: ApiService) {

    }


    ngOnInit(): void {
        this.api.getItemFromFirebaseStorage(environment.firebaseStorage.siteLogo).subscribe(url => {
            this.siteLogo = url;
        })
    }
}
