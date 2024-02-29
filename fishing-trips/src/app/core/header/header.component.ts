import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { CommonModule } from '@angular/common';
import { environment } from '../../environment';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, RouterOutlet, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
    siteLogo: string = '';
    constructor(
        private api: ApiService,
        public authService: AuthService,
        private router: Router) {

    }

    ngOnInit(): void {
        this.api.getItemFromFirebaseStorage(environment.firebaseStorage.siteLogo).then(url => {
            this.siteLogo = url;
        })
    }

    logout() {
        this.authService.signOut();
        this.router.navigate(['/home']);
        this.authService.currentUser = null;
    }
}
