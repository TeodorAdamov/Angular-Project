import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';


@Component({
    selector: 'app-dropdown',
    standalone: true,
    imports: [MatIconModule, MatMenuModule, MatButtonModule],
    templateUrl: './dropdown.component.html',
    styleUrl: './dropdown.component.css'
})
export class DropdownComponent {
    @Input() editAction!: () => void; // Method for edit action
    @Input() deleteCommentAction!: (commentId: string) => void; // Method for delete action
    @Input() deleteReplyAction!: (replyId: string, commentId: string) => void; // Method for delete action
    @Input() commentId: string | undefined;
    @Input() replyId: string | undefined;
    constructor(
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef) { }


        onEdit() {
            this.editAction();
        }

    onDelete() {
        this.openDialog('0ms', '0ms').afterClosed().subscribe(result => {
            if (result) {
                if (this.commentId && this.replyId == undefined) {
                    this.deleteCommentAction(this.commentId);
                } else if (this.replyId && this.commentId) {
                    this.deleteReplyAction(this.replyId, this.commentId);
                }
            }
        })
    }

    openDialog(enterAnimationDuration: string, exitAnimationDuration: string) {
        return this.dialog.open(ConfirmDialogComponent, {
            width: '250px',
            enterAnimationDuration,
            exitAnimationDuration,
        });
    }
}
