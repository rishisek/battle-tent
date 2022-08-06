import { Schema, model } from "mongoose";

export interface IField {
  name: string;
  type: string;
  number: number;
}

const FieldSchema = new Schema<IField>({
  name: { type: String, required: true },
  type: { type: String, required: true },
  number: { type: Number, required: true },
});

export interface IMessage {
  name: string;
  fields: Array<IField>;
  version: number;
}

const MessageSchema = new Schema<IMessage>({
  name: { type: String, required: true },
  fields: { type: [FieldSchema], required: true },
  version: { type: Number, required: true },
});

MessageSchema.index({ version: -1 });

const MessageModel = model<IMessage>("Message", MessageSchema);

export default MessageModel;
