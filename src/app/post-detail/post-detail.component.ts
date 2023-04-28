import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PostService } from '../services/post.service';
import { Post } from '../models/post.model';
import { CommentService } from '../services/comment.service';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';
import { CommentModel } from '../models/comment.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css'],
})
export class PostDetailComponent implements OnInit {
  users: User[] = [];
  posts: Post[] = [];
  post!: Post;
  user!: User;
  comments!: CommentModel[];
  id: number = 0;
  isLoading: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    private commentService: CommentService
  ) {}

  ngOnInit(): void {
    //remove ?? 0 add error handling instead
    this.id = +(this.route.snapshot.paramMap.get('id') ?? '0');

    const fetchedPosts = this.postService.getPosts();
    const fetchedUsers = this.userService.getUsers();
    const fetchedComments = this.commentService.getComments();

    forkJoin([fetchedPosts, fetchedUsers, fetchedComments]).subscribe(
      (results) => {
        this.posts = results[0];
        this.users = results[1];
        this.comments = results[2];
        const foundPost = this.posts.find((post) => post.id === this.id);
        if (foundPost) this.post = foundPost;

        const foundUser = this.users.find(
          (user) => user.id === this.post.userId
        );
        if (foundUser) this.user = foundUser;

        const foundComments = this.comments.filter(
          (comment) => comment.postId === this.id
        );
        if (foundComments) this.comments = foundComments;

        this.isLoading = false;
      }
    );
  }
}
