import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { RouterLink, RouterOutlet } from '@angular/router';
import { environment } from '../../environment';
import { AuthService } from '../../auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, RouterOutlet],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
    siteLogo: string = '';

    constructor(private api: ApiService, private authService: AuthService) {

    }

    ngOnInit(): void {
        this.api.getItemFromFirebaseStorage(environment.firebaseStorage.siteLogo).subscribe(url => {
            this.siteLogo = url;
        })
    }

    logout() {
        this.authService.signOut();
    }
}
