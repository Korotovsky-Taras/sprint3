import {EnhancedOmit} from "mongodb";

export type Like =  {
    userId: string,
    status: LikeStatus,
    createdAt: string,
}

export enum LikeStatus {
    NONE="None",
    LIKE="Like",
    DISLIKE="Dislike",
}

export type LikesInfo = {
    likesCount: number,
    dislikesCount: number,
}

export type LikeUserInfo = {
    userId: string,
    userLogin: string,
}

export type LastLike = {
    userId: string,
    userLogin: string
    createdAt: string,
}

export type LikesExtendedInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus,
    newestLikes: LikesExtendedLastLike[]
}

export type LikesExtendedLastLike = {
    addedAt: string,
    userId: string,
    login: string
}

export type LikesUserStatus = {
    myStatus: LikeStatus,
}

export type WithLikes<T> = EnhancedOmit<T, 'likesInfo'> & {
    likesInfo: LikesInfo & LikesUserStatus;
}

export type WithExtendedLikes<T> = EnhancedOmit<T, 'extendedLikesInfo'> & {
    extendedLikesInfo: LikesExtendedInfo;
}

export type LikeStatusUpdateModel = {
    likeStatus: LikeStatus
};


