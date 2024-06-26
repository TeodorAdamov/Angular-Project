import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { comment, reply } from '../../../../types/comments';
import { ApiService } from '../../../api.service';
import { ActivatedRoute } from '@angular/router';
import { UtilService } from '../../../shared/util.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { DropdownComponent } from '../../../shared/dropdown/dropdown.component';
import { CommentsService } from './comments.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-comments',
    standalone: true,
    imports: [LoaderComponent, CommonModule, DropdownComponent, ConfirmDialogComponent],
    templateUrl: './comments.component.html',
    styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit, OnDestroy {
    public tripId: string = '';
    private commentsSubscription!: Subscription
    private routeSubscription: Subscription | undefined;
    comments?: comment[]
    loadingComments: boolean = true;
    isEdittingComment: boolean = false;
    commentToEdit?: comment
    replyToEdit?: reply
    @Input() 'isOwner': boolean
    @ViewChild('editCommentTextAreaRef') editCommentTextAreaRef?: ElementRef
    @ViewChild('editReplyTextAreaRef') editReplyTextAreaRef?: ElementRef


    constructor(
        public authService: AuthService,
        private api: ApiService,
        private route: ActivatedRoute,
        private util: UtilService,
        private commentService: CommentsService,) { }

    ngOnInit(): void {
        this.routeSubscription = this.route.paramMap.subscribe(params => {
            const id = params.get('id');
            if (id) {
                this.tripId = id;
            }
        })

        if (this.tripId) {
            this.commentService.updateTripId(this.tripId);
            this.initComments();
        }
    }

    initComments(): void {
        this.loadingComments = true;

        this.commentsSubscription = this.api.getCommentsForATrip(this.tripId!).subscribe(comments => {
            this.comments = comments.map(comment => this.util.convertToComment(comment));
            this.loadingComments = false;
        });
    }

    // SEND COMMENTS AND REPLIES

    onCommentSend(textareaRef: HTMLTextAreaElement) {
        this.commentService.onCommentSend(textareaRef)
    }

    onReplySend(textareaRef: HTMLTextAreaElement) {
        this.commentService.onReplySend(textareaRef)
    }
    onKeyDown(event: KeyboardEvent, textareaRef: HTMLTextAreaElement) {
        this.commentService.onKeyDown(event, textareaRef)
    }

    // EDIT COMMENTS AND REPLIES

    onCommentEdit(comment: comment): void {
        this.isEdittingComment = true;
        this.commentToEdit = comment
        setTimeout(() => {
            const textAreaElement = this.editCommentTextAreaRef?.nativeElement
            textAreaElement.focus();
            textAreaElement.setSelectionRange(textAreaElement.value.length, textAreaElement.value.length);

        }, 50)
    }

    onCommentEditSave(textareaRef: HTMLTextAreaElement) {
        if (!textareaRef.value) {
            return
        }

        if (this.commentToEdit) {
            this.commentToEdit.comment = textareaRef.value
            const updatedComment = this.commentToEdit
            this.api.updateComment(updatedComment, this.tripId);
            textareaRef.value = '';
            this.isEdittingComment = false;
        }
    }

    cancelEditting(event: KeyboardEvent, textareaRef: HTMLTextAreaElement, comment?: comment) {

        if (textareaRef.name == 'edit-comment') {
            if (event.key == 'Escape') {
                this.isEdittingComment = false;
                textareaRef.value = '';
            }
            if (event.key == 'Enter' && event.shiftKey == false) {
                this.onCommentEditSave(textareaRef)
                this.isEdittingComment = false;
                textareaRef.value = '';
            }
        } else if (textareaRef.name == 'edit-reply' && comment) {
            if (event.key == 'Escape') {
                if (this.replyToEdit) {
                    this.replyToEdit.isEditting = false;
                }
                textareaRef.value = '';
            }

            if (event.key == 'Enter' && event.shiftKey == false) {
                this.onReplyEditSave(textareaRef, comment)
                if (this.replyToEdit) {
                    this.replyToEdit.isEditting = false;
                }
                textareaRef.value = '';
            }
        }


    }

    onCancelClick() {
        this.isEdittingComment = false;
        if (this.replyToEdit) {
            this.replyToEdit.isEditting = false;
        }
    }

    onReplyEdit(reply: reply) {
        this.replyToEdit = reply;
        this.replyToEdit.isEditting = true;
        setTimeout(() => {
            const textAreaElement = this.editReplyTextAreaRef?.nativeElement
            textAreaElement.focus();
            textAreaElement.setSelectionRange(textAreaElement.value.length, textAreaElement.value.length);

        }, 50)
        console.log('reply edit');
    }

    onReplyEditSave(textareaRef: HTMLTextAreaElement, comment: comment) {
        if (!textareaRef.value) {
            return
        }

        if (this.replyToEdit) {
            this.replyToEdit.reply = textareaRef.value
            const updatedReply = this.replyToEdit
            this.api.updateReply(updatedReply, comment, this.tripId);
            textareaRef.value = '';
            this.replyToEdit.isEditting = false;
        }
    }



    // DELETE COMMENTS AND REPLIES

    onCommentDelete = (commentId: string, tripId: string) => this.api.deleteComment(commentId, tripId);

    onDeleteCommentWrapper = (commentId: string) => {
        this.onCommentDelete(commentId, this.tripId);
    }

    onReplyDelete = (replyId: string, commentId: string, tripId: string) => this.api.deleteReply(replyId, commentId, tripId);

    onDeleteReplyWrapper = (replyId: string, commentId: string) => {
        this.onReplyDelete(replyId, commentId, this.tripId)
    }



    ngOnDestroy(): void {
        this.commentsSubscription.unsubscribe();
    }
}
