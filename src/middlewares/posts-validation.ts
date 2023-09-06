import {withValidator} from "../utils/withValidator";
import {checkSchema} from "express-validator";
import {BlogsDto} from "../dto/blogs.dto";
import {LikeStatus} from "../types/likes";
import {ioc} from "../ioc.config";
import {IBlogsQueryRepository} from "../types/repository";
import {BlogsQueryRepository} from "../repositories/blogs-query-repository";

const blogsQueryRepository : IBlogsQueryRepository =  ioc.resolve<IBlogsQueryRepository>(BlogsQueryRepository)

export const postCreationValidator = withValidator(() => {
    return [
        checkSchema({
            shortDescription: {
                in: ['body'],
                trim: true,
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: {min: 1, max: 100},
                    errorMessage: "length should be > 0 < 100"
                },
            }
        }),
        checkSchema({
            title: {
                in: ['body'],
                trim: true,
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: {min: 1, max: 30},
                    errorMessage: "length should be > 0 < 30"
                },
            }
        }),
        checkSchema({
            content: {
                in: ['body'],
                trim: true,
                isString: {
                    errorMessage: "should be a string",
                },
                isLength: {
                    options: {min: 1, max: 1000},
                    errorMessage: "length should be > 0 < 1000"
                },
            }
        })
    ]
})
export const postUpdateWithIdValidator = withValidator(() => {
    return [
        checkSchema({
            blogId: {
                in: ['body'],
                trim: true,
                isMongoId: {
                    errorMessage: "wrong id type",
                },
                custom: {
                    options: async (blogId) => {
                        const res = await blogsQueryRepository.getBlogById(blogId, BlogsDto.blog);
                        if (res === null) {
                            throw Error("blog is not exist")
                        }
                    },
                },
            }
        }),
        ...postCreationValidator,
    ]
})

export const postCreationWithIdValidator = withValidator(() => {
    return [
        checkSchema({
            blogId: {
                in: ['body'],
                trim: true,
                isMongoId: {
                    errorMessage: "wrong id type",
                },
                custom: {
                    options: async (blogId) => {
                        const res = await blogsQueryRepository.getBlogById(blogId, BlogsDto.blog);
                        if (res === null) {
                            throw Error("blog is not exist")
                        }
                    },
                },
                isLength: {
                    options: {min: 1},
                    errorMessage: "length should be > 0"
                },
            }
        }),
        ...postCreationValidator,
    ]
})

export const postsUpdateLikeStatusValidator = withValidator(() => {
    const enumValues = Object.values(LikeStatus);

    return [
        checkSchema({
            likeStatus: {
                in: ['body'],
                trim: true,
                errorMessage: 'Invalid field value',
                custom: {
                    options: async (likeStatus) => {
                        if (!enumValues.includes(likeStatus)) {
                            throw Error(`Field value must be one of ${enumValues.join(', ')}`)
                        }
                    },
                },
            }
        }),
    ]
})
