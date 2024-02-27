import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [RouterLink, RouterOutlet],
    templateUrl: './header.component.html',
    styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
    siteLogo: string = '';

    constructor(private api: ApiService) {

    }

    ngOnInit(): void {
        this.api.getStorage().subscribe(url => {
            this.siteLogo = url;
        })
    }
}
