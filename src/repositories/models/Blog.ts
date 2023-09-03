import {Blog, BlogCreateModel, BlogMongoModel} from "../../types";
import {createModel, CustomModel} from "../utils/createModel";
import {HydratedDocument} from "mongoose";
import {toIsoString} from "../../utils/date";


export interface IBlogMethods {

}

interface IBlogModel extends CustomModel<BlogMongoModel, IBlogMethods> {
    createBlog(inputModel: BlogCreateModel): HydratedDocument<BlogMongoModel>;
}

export const BlogModel: IBlogModel = createModel<Blog, BlogMongoModel, IBlogMethods, IBlogModel>("Blog",{
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl: String,
    createdAt: String,
    isMembership: Boolean,
}, (schema) => {

    schema.static('createBlog', function createBlog(inputModel: BlogCreateModel) {
        const model : HydratedDocument<BlogMongoModel> = new BlogModel(inputModel);
        model.createdAt = toIsoString(new Date());
        model.isMembership = false;
        return model
    });

})
