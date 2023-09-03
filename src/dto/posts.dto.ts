import {PostMongoModel, PostPaginationQueryModel, PostPaginationRepositoryModel, PostViewModel} from "../types";
import {withExternalDirection, withExternalNumber, withExternalString,} from "../utils/withExternalQuery";

const initialQuery: PostPaginationRepositoryModel = {
    sortBy: "createdAt",
    sortDirection: "desc",
    pageNumber: 1,
    pageSize: 10
}

export const PostsDto = {
    allPosts(items: PostMongoModel[]): PostViewModel[] {
        return items.map(PostsDto.post)
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
