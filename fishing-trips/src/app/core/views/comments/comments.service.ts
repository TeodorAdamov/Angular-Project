import { Injectable } from '@angular/core';
import { ApiService } from '../../../api.service';
import { AuthService } from '../../auth/auth.service';
import { comment, reply } from '../../../../types/comments';
import { BehaviorSubject, Subscription, of, switchMap } from 'rxjs';
import { UtilService } from '../../../shared/util.service';

@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    private tripIdSubject = new BehaviorSubject<string | null>(null);
    tripId$ = this.tripIdSubject.asObservable();
    comments?: comment[]
    loadingComments: boolean = true;
    commentsSubscription!: Subscription


    constructor(
        private authService: AuthService,
        private api: ApiService,
        private util: UtilService) { }

    updateTripId(tripId: string | null) {
        this.tripIdSubject.next(tripId)
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
        this.tripId$.subscribe((tripId => {
            if (tripId) {
                this.api.addComment(comment, tripId)
                textareaRef.value = '';
            }
        })).unsubscribe()

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
            id: this.util.generateRandomString(20)
        }
        this.tripId$.subscribe((tripId) => {
            if (tripId) {

                this.api.addReplyToComment(reply, tripId, commentId);
            }
        }).unsubscribe()
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

}
