import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [MatButtonModule, MatDialogModule],
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {

    constructor(public dialog: MatDialog) {

    }
    openDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
        return this.dialog.open(ConfirmDialogComponent, {
            width: '250px',
            enterAnimationDuration,
            exitAnimationDuration,
        });
    }

}
