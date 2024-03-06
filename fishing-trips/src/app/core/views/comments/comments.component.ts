import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { comment } from '../../../../types/comments';
import { ApiService } from '../../../api.service';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-comments',
    standalone: true,
    imports: [],
    templateUrl: './comments.component.html',
    styleUrl: './comments.component.css'
})
export class CommentsComponent implements OnInit {
    tripId: string | null = '';
    constructor(
        private authService: AuthService,
        private api: ApiService,
        private route: ActivatedRoute) { }

    ngOnInit(): void {
        this.tripId = this.route.snapshot.paramMap.get('id');
    }

    onSend(textareaRef: HTMLTextAreaElement) {
        const username = this.authService.currentUser?.displayName;
        const userId = this.authService.currentUser?.uid;
        const commentValue = textareaRef.value;

        if (!username || !userId || !commentValue) {
            return;
        }

        const comment: comment = {
            username,
            userId,
            comment: commentValue,
            replies: []
        }
        if (this.tripId) {
            this.api.addComment(comment, this.tripId)
            textareaRef.value = '';

        }
    }

    onKeyDown(event: KeyboardEvent, textareaRef: HTMLTextAreaElement) {
        if (event.key == 'Enter' && event.shiftKey == false) {
            event.preventDefault();
            this.onSend(textareaRef)
        }
    }
}
