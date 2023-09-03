import {EnhancedOmit, WithId} from "mongodb";
import {PaginationQueryModel, WithPaginationQuery} from "./custom";
import {Post} from "./posts";

export interface Blog {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string,
    isMembership: boolean,
}

export type BlogMongoModel = WithId<Blog>;

export type BlogCreateModel = Pick<Blog, 'name' | 'description' | 'websiteUrl'>;

export type BlogPostCreateModel = Pick<Post, 'title' | 'shortDescription' | 'content'>;

export type BlogUpdateModel = Pick<Blog, 'name' | 'description' | 'websiteUrl'>;

export type BlogViewModel = Pick<Blog, 'name' | 'description' | 'websiteUrl' | 'isMembership' | 'createdAt'> & { id: string }

export type BlogPaginationQueryModel = PaginationQueryModel<Blog> & {
    searchNameTerm?: string,
}

export type BlogPaginationRepositoryModel = EnhancedOmit<WithPaginationQuery<Blog>, "searchNameTerm"> & {
    searchNameTerm: string | null,
}

