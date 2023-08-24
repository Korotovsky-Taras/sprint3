import {
    PostMongoModel,
    PostPaginationQueryModel,
    PostPaginationRepositoryModel,
    PostsListMongoModel,
    PostsListViewModel,
    PostViewModel
} from "../types";
import {withExternalDirection, withExternalNumber, withExternalString,} from "../utils/withExternalQuery";

const initialQuery: PostPaginationRepositoryModel = {
    sortBy: "createdAt",
    sortDirection: "desc",
    pageNumber: 1,
    pageSize: 10
}

export const PostsDto = {
    allPosts(list: PostsListMongoModel): PostsListViewModel {
        return {
            pagesCount: list.pagesCount,
            page: list.page,
            pageSize: list.pageSize,
            totalCount: list.totalCount,
            items: list.items.map(PostsDto.post)
        }
    },
    post({ _id, title, shortDescription, content, blogId, blogName, createdAt }: PostMongoModel): PostViewModel {
        return {
            id: _id.toString(),
            title,
            shortDescription,
            content,
            blogId,
            blogName,
            createdAt,
        }
    },
    toRepoQuery(query: PostPaginationQueryModel): PostPaginationRepositoryModel {
        return {
            sortBy: withExternalString(initialQuery.sortBy, query.sortBy),
            sortDirection: withExternalDirection(initialQuery.sortDirection, query.sortDirection),
            pageNumber: withExternalNumber(initialQuery.pageNumber, query.pageNumber),
            pageSize: withExternalNumber(initialQuery.pageSize, query.pageSize)
        };
    },
}
