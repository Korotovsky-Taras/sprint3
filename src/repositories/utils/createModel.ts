import {model, Model, Schema, Types} from "mongoose";
import {WithId} from "mongodb";

export interface CustomModel<IDoc, IDocMethods> extends Model<IDoc, {}, IDocMethods> {
    isValidId(id: string): boolean
}

export function createModel<IType, IDoc extends WithId<IType>, IDocMethods, IModel extends CustomModel<IDoc, IDocMethods>>(
    name: string,
    definition: Record<keyof IType, any>,
    connection: (schema: Schema<IDoc, IModel>) => void) {
    const schema = new Schema<IDoc, IModel>(definition);

    connection(schema);

    schema.static('isValidId', async (id: string) => {
        return Types.ObjectId.isValid(id);
    });

    schema.static('isValidId', async (id: string) => {
        return Types.ObjectId.isValid(id);
    });

    return model<IDoc, IModel>(name, schema) as IModel;
}