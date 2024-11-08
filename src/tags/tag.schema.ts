import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class Tag extends Document {
    @Prop({
        type: String,
        isRequired: true,
        unique: true
    })
    name: string;

    @Prop({
        type: String,
        isRequired: true,
        unique: true
    })
    slug: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
