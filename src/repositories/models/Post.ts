import {Post, PostMongoModel, PostsCreateModel, UserMongoModel} from "../../types";
import {createModel, CustomModel} from "../utils/createModel";
import {HydratedDocument} from "mongoose";
import {toIsoString} from "../../utils/date";
import {Like, LikeStatus} from "../../types/likes";
import {UserModel} from "./User";


export interface IPostMethods {
    updateLike(userId: string, likeStatus: LikeStatus): Promise<void>
}

interface IPostModel extends CustomModel<PostMongoModel, IPostMethods> {
    createPost(inputModel: PostsCreateModel): HydratedDocument<PostMongoModel>;
}

export const PostModel: IPostModel = createModel<Post, PostMongoModel, IPostMethods, IPostModel>("Post",{
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: {type: String, required: true},
    likes: [{
        '_id': false,
        userId:  {type: String, required: true},
        status: {type: String, enum: LikeStatus, required: true},
        createdAt: {type: String, required: true},
    }],
    likesInfo: {
        '_id': false,
        likesCount: {type: Number, required: true, default: 0},
        dislikesCount: {type: Number, required: true, default: 0},
    },
    lastLikes: [{
        '_id': false,
        userId: String,
        userLogin: String,
        createdAt:  String
    }],
}, (schema) => {

    schema.method('updateLike', async function updateLike(userId: string, likeStatus: LikeStatus) {

        // Обновляем или устанавливаем лайк
        const likeIndex = this.likes.findIndex((like: Like) => like.userId === userId);
        if (likeIndex >= 0) {
            console.log("UPDATE OLD")
            this.likes[likeIndex].status = likeStatus;
            this.likes[likeIndex].createdAt = toIsoString(new Date());
        } else {
            console.log("ADD NEW")
            this.likes.push({
                userId: userId,
                status: likeStatus,
                createdAt: toIsoString(new Date())
            });
        }

        // Обновляем статистику лайков
        this.likesInfo.likesCount = 0;
        this.likesInfo.dislikesCount = 0;
        this.likes.forEach((like: Like) => {
            if (like.status === LikeStatus.LIKE) {
                this.likesInfo.likesCount++;
            }
            if (like.status === LikeStatus.DISLIKE) {
                this.likesInfo.dislikesCount++;
            }
        })

        //Обновляем список последних лайков
        this.lastLikes = [];
        const sortedLikes: Like[] = this.likes.sort((a: Like, b: Like) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        for (let like of sortedLikes) {
            const user: UserMongoModel | null = await UserModel.findById(like.userId).lean<UserMongoModel>() as UserMongoModel;
            if (user && like.status === LikeStatus.LIKE && this.lastLikes.length < 3) {
                this.lastLikes.push({
                    userId: user._id.toString(),
                    userLogin: user.login,
                    createdAt: like.createdAt,
                })
            }
        }
    });


    schema.static('createPost', function createPost(inputModel: PostsCreateModel) {
        const model : HydratedDocument<PostMongoModel> = new PostModel(inputModel);
        model.createdAt = toIsoString(new Date());
        return model
    });

})
