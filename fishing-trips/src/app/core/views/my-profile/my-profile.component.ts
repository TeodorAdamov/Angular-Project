import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { User } from '@angular/fire/auth';

@Component({
    selector: 'app-my-profile',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './my-profile.component.html',
    styleUrl: './my-profile.component.css'
})
export class MyProfileComponent implements OnInit {

    constructor(
        public authService: AuthService,) { }

    ngOnInit(): void {

    }
}
