import "reflect-metadata";

import {
    IAuthRouterController,
    IBlogService,
    IBlogsRouterController,
    ICommentsRouterController,
    ICommentsService,
    IPostsRouterController,
    IPostsService,
    IUsersRouterController,
    IUsersService
} from "./types";
import {
    IAuthSessionQueryRepository,
    IAuthSessionRepository,
    IBlogsQueryRepository,
    IBlogsRepository,
    ICommentsQueryRepository,
    ICommentsRepository,
    ILogsQueryRepository,
    ILogsRepository,
    IPostsQueryRepository,
    IPostsRepository,
    IUsersQueryRepository,
    IUsersRepository
} from "./types/repository";

import {BlogsRouterController} from "./controllers/BlogsRouterController";
import {BlogsService} from "./services/BlogsService";
import {BlogsQueryRepository} from "./repositories/blogs-query-repository";
import {BlogsRepository} from "./repositories/blogs-repository";
import {UsersRouterController} from "./controllers/UsersRouterController";
import {UsersService} from "./services/UsersService";
import {UsersRepository} from "./repositories/users-repository";
import {UsersQueryRepository} from "./repositories/users-query-repository";
import {PostsRouterController} from "./controllers/PostsRouterController";
import {PostsService} from "./services/PostsService";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsQueryRepository} from "./repositories/posts-query-repository";
import {CommentsRouterController} from "./controllers/CommentsRouterController";
import {CommentsService} from "./services/CommentsService";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsQueryRepository} from "./repositories/comments-query-repository";

import {Container} from "inversify";
import {LogsRepository} from "./repositories/logs-repository";
import {LogsQueryRepository} from "./repositories/logs-query-repository";
import {AuthSessionRepository} from "./repositories/auth-session-repository";
import {AuthRouterController} from "./controllers/AuthRouterController";
import {AuthSessionQueryRepository} from "./repositories/auth-session-query-repository";

export const ioc = new Container();

ioc.bind<IBlogsRouterController>(BlogsRouterController).toSelf();
ioc.bind<IBlogService>(BlogsService).toSelf();
ioc.bind<IBlogsRepository>(BlogsRepository).toSelf();
ioc.bind<IBlogsQueryRepository>(BlogsQueryRepository).toSelf();

ioc.bind<IUsersRouterController>(UsersRouterController).toSelf();
ioc.bind<IUsersService>(UsersService).toSelf();
ioc.bind<IUsersRepository>(UsersRepository).toSelf();
ioc.bind<IUsersQueryRepository>(UsersQueryRepository).toSelf();

ioc.bind<IPostsRouterController>(PostsRouterController).toSelf();
ioc.bind<IPostsService>(PostsService).toSelf();
ioc.bind<IPostsRepository>(PostsRepository).toSelf();
ioc.bind<IPostsQueryRepository>(PostsQueryRepository).toSelf();

ioc.bind<ICommentsRouterController>(CommentsRouterController).toSelf();
ioc.bind<ICommentsService>(CommentsService).toSelf();
ioc.bind<ICommentsRepository>(CommentsRepository).toSelf();
ioc.bind<ICommentsQueryRepository>(CommentsQueryRepository).toSelf();

ioc.bind<ILogsRepository>(LogsRepository).toSelf();
ioc.bind<ILogsQueryRepository>(LogsQueryRepository).toSelf();

ioc.bind<IAuthSessionQueryRepository>(AuthSessionQueryRepository).toSelf();
ioc.bind<IAuthSessionRepository>(AuthSessionRepository).toSelf();
ioc.bind<IAuthRouterController>(AuthRouterController).toSelf();
