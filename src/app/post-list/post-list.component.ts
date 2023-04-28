import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { UserService } from '../services/user.service';
import { CommentService } from '../services/comment.service';
import { Post } from '../models/post.model';
import { User } from '../models/user.model';
import { CommentModel } from '../models/comment.model';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css'],
})
export class PostListComponent implements OnInit {
  constructor(
    private postService: PostService,
    private userService: UserService,
    private commentService: CommentService
  ) {}
  posts: Post[] = [];
  users: any[] = [];
  comments: CommentModel[] = [];

  ngOnInit(): void {
    this.postService.getPosts().subscribe((jsonPosts) => {
      this.posts = jsonPosts;
    });
    this.userService.getUsers().subscribe((jsonUsers) => {
      this.users = jsonUsers;
    });
    this.commentService.getComments().subscribe((jsonComments) => {
      this.comments = jsonComments;
    });
  }

  getUserById(userId: number): User {
    return this.users?.find((user) => user.id === userId);
  }

  countCommentsForPost(postId: number): number {
    return this.comments.filter((comment) => comment.postId === postId).length;
  }

  isValidId(id: any): boolean {
    return !isNaN(parseInt(id, 10));
  }
}
