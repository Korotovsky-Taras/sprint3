import {
    BlogListMongoModel,
    BlogListViewModel,
    BlogMongoModel,
    BlogPaginationQueryModel,
    BlogPaginationRepositoryModel,
    BlogViewModel
} from "../types";
import {
    withExternalDirection,
    withExternalNumber,
    withExternalString,
    withExternalTerm,
} from "../utils/withExternalQuery";

const initialQuery: BlogPaginationRepositoryModel = {
    sortBy: "createdAt",
    searchNameTerm: null,
    sortDirection: "desc",
    pageNumber: 1,
    pageSize: 10
}

export const BlogsDto = {
    allBlogs(list: BlogListMongoModel): BlogListViewModel {
        return {
            pagesCount: list.pagesCount,
            page: list.page,
            pageSize: list.pageSize,
            totalCount: list.totalCount,
            items: list.items.map(BlogsDto.blog)
        }
    },
    blog({_id, name, description, websiteUrl, createdAt, isMembership}: BlogMongoModel): BlogViewModel {
        return {
            id: _id.toString(),
            name,
            description,
            websiteUrl,
            createdAt,
            isMembership,
        }
    },
    toRepoQuery(query: BlogPaginationQueryModel): BlogPaginationRepositoryModel {
        return {
            sortBy: withExternalString(initialQuery.sortBy, query.sortBy),
            searchNameTerm: withExternalTerm(initialQuery.searchNameTerm, query.searchNameTerm),
            sortDirection: withExternalDirection(initialQuery.sortDirection, query.sortDirection),
            pageNumber: withExternalNumber(initialQuery.pageNumber, query.pageNumber),
            pageSize: withExternalNumber(initialQuery.pageSize, query.pageSize)
        };
    },
}