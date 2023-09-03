import {createModel, CustomModel} from "../utils/createModel";
import {HydratedDocument} from "mongoose";
import {toIsoString} from "../../utils/date";
import {Comment, CommentCreateInputModel, CommentMongoModel} from "../../types/comments";


interface ICommentMethods {

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
    createdAt: {type: String, required: true}
}, (schema) => {

    schema.static('createComment', function createComment(inputModel: CommentCreateInputModel) {
        const model : HydratedDocument<CommentMongoModel> = new CommentModel(inputModel);
        model.createdAt = toIsoString(new Date());
        return model
    });

})
