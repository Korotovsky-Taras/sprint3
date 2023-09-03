import {User, UserConfirmation, UserConfirmationMongoModel, UserCreateInputModel, UserMongoModel} from "../../types";
import {createModel, CustomModel} from "../utils/createModel";
import {HydratedDocument} from "mongoose";
import {toIsoString} from "../../utils/date";


export interface IUserMethods {
    isAuthConfirmed(): boolean
    isAuthExpired(): boolean
    isPassConfirmed(): boolean
    isPassExpired(): boolean
    setAuthConfirmed(confirm: boolean): void
    setPassConfirmed(confirm: boolean): void
    setAuthConfirmation(conf: UserConfirmation): UserConfirmationMongoModel
    setPassConfirmation(conf: UserConfirmation): UserConfirmationMongoModel
}

export interface IUserModel extends CustomModel<UserMongoModel, IUserMethods> {
    createUser(input: UserCreateInputModel): HydratedDocument<UserMongoModel> & IUserMethods;
}

export const UserModel: IUserModel = createModel<User, UserMongoModel, IUserMethods, IUserModel>("User",{
    login: {type: String, required: true},
    email: {type: String, required: true},
    password: {
        salt: {type: String, required: true},
        hash: {type: String, required: true}
    },
    authConfirmation: {
        code: {type: String, required: true},
        confirmed: {type: Boolean, required: true},
        expiredIn: {type: String, required: true},
    },
    passConfirmation: {
        code: {type: String},
        confirmed: {type: Boolean},
        expiredIn: {type: String},
    },
    createdAt: {type: String, required: true},
}, (schema) => {

    schema.method('isAuthConfirmed', function isAuthConfirmed() {
       return this.authConfirmation.confirmed;
    })
    schema.method('isAuthExpired', function isAuthExpired() {
       return new Date().getTime() > new Date(this.authConfirmation.expiredIn).getTime();
    })
    schema.method('setAuthConfirmed', function setAuthConfirmed(confirm : boolean) {
        this.authConfirmation.confirmed = confirm;
    })
    schema.method('isPassExpired', function isPassExpired() {
       return new Date().getTime() > new Date(this.passConfirmation.expiredIn).getTime();
    })
    schema.method('isPassConfirmed', function isPassConfirmed(confirm : boolean) {
        this.passConfirmation.confirmed = confirm;
    })
    schema.method('setPassConfirmed', function hasPassConfirmation(confirm : boolean) {
        this.passConfirmation.confirmed = confirm;
    })
    schema.method('setAuthConfirmation', function setAuthConfirmation(conf: UserConfirmation) {
        this.authConfirmation = {
            code: conf.code,
            confirmed: conf.confirmed,
            expiredIn: conf.expiredIn,
        };
    })
    schema.method('setPassConfirmation', function setPassConfirmation(conf: UserConfirmation) {
        this.passConfirmation = {
            code: conf.code,
            confirmed: conf.confirmed,
            expiredIn: conf.expiredIn,
        };
    })

    schema.static('createUser', function createUser(inputModel: UserCreateInputModel) {
        const model : HydratedDocument<UserMongoModel> = new UserModel();
        model.login = inputModel.login;
        model.email = inputModel.email;
        model.password = inputModel.password;
        model.authConfirmation = inputModel.authConfirmation;
        model.createdAt = toIsoString(new Date());
        return model
    });

})


// interface IItemType {
//     id: boolean,
//     name: string
// }
//
// interface IItemVirtualType {
//     createVirtual(): void
// }
//
// interface IItemMethodsType {
//     create(): void
// }
//
// interface IItemModelType extends Model<IItemType, IItemVirtualType, IItemMethodsType> {
//     createStatic(): void
// }
//
// const itemSchema = new Schema<IItemType>({
//
// })
//
// itemSchema.virtual("createVirtual", function create() {
//     this.name = 2;
//
//     this.createVirtual();
// })
//
// itemSchema.method("create", function create() {
//     this.name = 2;
//
//     this.createVirtual();
// })
//
// itemSchema.static("createStatic", function create() {
//
// })
//
// const ItemModel = model<IItemType, IItemModelType>("Item", itemSchema);
//
// const itemInst  = new ItemModel();
//
// itemInst.create();


