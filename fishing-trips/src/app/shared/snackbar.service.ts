import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',

})
export class SnackBarService {
  horizontalPosition: MatSnackBarHorizontalPosition = 'center';
  verticalPosition: MatSnackBarVerticalPosition = 'top'; // Adjust vertical position as needed

  constructor(private snackBar: MatSnackBar) { }

  openSnackBar(message: string, length: number) {
    this.snackBar.open(message, 'Close', {
      duration: length, // Duration in milliseconds
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition
    });
  }
}
