import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [],
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
