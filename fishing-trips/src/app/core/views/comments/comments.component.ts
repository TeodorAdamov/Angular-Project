import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { comment, reply } from '../../../../types/comments';
import { ApiService } from '../../../api.service';
import { ActivatedRoute } from '@angular/router';
import { DocumentData } from '@angular/fire/firestore';
import { ConvertService } from '../../../shared/convert.service';
import { LoaderComponent } from '../../../shared/loader/loader.component';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-comments',
    standalone: true,
    imports: [LoaderComponent, CommonModule],
    templateUrl: './comments.component.html',
    styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit, OnDestroy {
    tripId: string | null = '';
    comments?: comment[]
    loadingComments: boolean = true;
    userPhoto: string = '';
    commentsSubscription!: Subscription

    constructor(
        public authService: AuthService,
        private api: ApiService,
        private route: ActivatedRoute,
        private convert: ConvertService) { }

    ngOnInit(): void {
        this.tripId = this.route.snapshot.paramMap.get('id');
        if (this.tripId) {
            this.commentsSubscription = this.api.getCommentsForATrip(this.tripId).subscribe((comments: DocumentData[]) => {
                this.comments = comments.map(comment => this.convert.convertToComment(comment));
                this.loadingComments = false;
            })
        }


    }

    onCommentSend(textareaRef: HTMLTextAreaElement) {
        const username = this.authService.currentUser?.displayName;
        const userId = this.authService.currentUser?.uid;
        const commentValue = textareaRef.value;
        const userPhoto = this.authService.currentUser?.photoURL;

        if (!username || !userId || !commentValue || !userPhoto) {
            return;
        }

        const comment: comment = {
            username,
            userId,
            userPhoto,
            comment: commentValue,
            replies: []
        }
        if (this.tripId) {
            this.api.addComment(comment, this.tripId)
            textareaRef.value = '';

        }
    }

    onReplySend(textareaRef: HTMLTextAreaElement) {
        const username = this.authService.currentUser?.displayName;
        const userId = this.authService.currentUser?.uid;
        const replyValue = textareaRef.value;
        const userPhoto = this.authService.currentUser?.photoURL;
        const commentId = textareaRef.id

        if (!username || !userId || !replyValue || !userPhoto) {
            return;
        }

        const reply: reply = {
            username,
            userId,
            userPhoto,
            reply: replyValue,
        }
        if (this.tripId) {
            this.api.addReplyToComment(reply, this.tripId, commentId);
        }

    }

    onKeyDown(event: KeyboardEvent, textareaRef: HTMLTextAreaElement) {
        if (event.key == 'Enter' && event.shiftKey == false) {
            event.preventDefault();
            if (textareaRef.name == 'comment') {
                this.onCommentSend(textareaRef)
            } else if (textareaRef.name == 'comment-reply') {
                this.onReplySend(textareaRef);
            }

        }
    }

    ngOnDestroy(): void {
        this.commentsSubscription.unsubscribe();
    }
}
