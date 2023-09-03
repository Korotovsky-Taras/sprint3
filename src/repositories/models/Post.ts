import {Post, PostMongoModel, PostsCreateModel} from "../../types";
import {createModel, CustomModel} from "../utils/createModel";
import {HydratedDocument} from "mongoose";
import {toIsoString} from "../../utils/date";


interface IPostMethods {

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
}, (schema) => {

    schema.static('createPost', function createPost(inputModel: PostsCreateModel) {
        const model : HydratedDocument<PostMongoModel> = new PostModel(inputModel);
        model.createdAt = toIsoString(new Date());
        return model
    });

})
