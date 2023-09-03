import {EnhancedOmit, WithId} from "mongodb";


export type Like =  {
    parentId: string,
    userId: string,
    status: LikeStatus,
    createdAt: Date,
    updatedAt: Date,
}

export enum LikeStatus {
    NONE="None",
    LIKE="Like",
    DISLIKE="Dislike",
}

export type LikesInfo = {
    likesCount: number,
    dislikesCount: number,
    myStatus: LikeStatus
}

export type WithLikes<T> = EnhancedOmit<T, 'likesInfo'> & {
    likesInfo: LikesInfo;
}

export type LikeMongoModel = WithId<Like>;

export type LikeCreateModel = Pick<Like, "parentId" | "userId" | "status">

export type LikeStatusUpdateModel = Pick<Like, "parentId" | "userId" | "status">

