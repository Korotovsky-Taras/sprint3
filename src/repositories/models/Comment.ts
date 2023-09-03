import {createModel, CustomModel} from "../utils/createModel";
import {HydratedDocument} from "mongoose";
import {toIsoString} from "../../utils/date";
import {Comment, CommentCreateInputModel, CommentMongoModel} from "../../types/comments";
import {Like, LikeStatus} from "../../types/likes";


export interface ICommentMethods {
    updateLike(userId: string, likeStatus: LikeStatus): void
}

interface ICommentModel extends CustomModel<CommentMongoModel, ICommentMethods> {
    createComment(inputModel: CommentCreateInputModel): HydratedDocument<CommentMongoModel>;
}

export const CommentModel: ICommentModel = createModel<Comment, CommentMongoModel, ICommentMethods, ICommentModel>("Comment",{
    postId: {type: String, required: true},
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    },
    likes: [{
        '_id': false,
        userId: {type: String, required: true},
        status: {type: String, enum: LikeStatus, required: true},
        createdAt: {type: String, required: true},
    }],
    createdAt: {type: String, required: true}
}, (schema) => {

    schema.method('updateLike', function updateLike(userId: string, likeStatus: LikeStatus) {
        const likeIndex = this.likes.findIndex((like: Like) => like.userId === userId);
        if (likeIndex >= 0) {
            this.likes[likeIndex].status = likeStatus;
            this.likes[likeIndex].createdAt = toIsoString(new Date());
        } else {
            this.likes.push({
                userId: userId,
                status: likeStatus,
                createdAt: toIsoString(new Date())
            })
        }
    });

    schema.static('createComment', function createComment(inputModel: CommentCreateInputModel) {
        const model : HydratedDocument<CommentMongoModel> = new CommentModel(inputModel);
        model.createdAt = toIsoString(new Date());
        return model
    });

})
