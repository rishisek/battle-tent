import { Router } from "express";
import mongoose, { HydratedDocument } from "mongoose";
import MessageModel, { IMessage, IField } from "../models/message";
import _ from "lodash";

const routes = Router();

const protoStringFromSpec = (spec: HydratedDocument<IMessage>) => {
  let message_str = "";
  message_str += `message ${spec.name} { `;
  for (const field of spec.fields) {
    message_str += `${field.type} ${field.name} = ${field.number}; `;
  }
  message_str += "}";
  return message_str;
};

routes.post("/create", async (req, res, next) => {
  await mongoose.connect("mongodb://localhost:8080");
  let message = new MessageModel(req.body);

  MessageModel.findOne({ name: message.name }).exec((err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).send("Database error.");
    }
    if (result) {
      return res.status(400).send("Message exists. Try updating instead.");
    }
    message.version = 1;
    message
      .save()
      .then(() => {
        let message_str = protoStringFromSpec(message);
        res.send(message_str);
      })
      .catch((err) => {
        res.status(400).send(err.message);
      });
  });
});

const getMessageHistoryPromise = (message_name: string, count: number) => {
  return MessageModel.find({ name: message_name }, null, {
    sort: { version: -1 },
    limit: count,
  }).exec();
};

routes.post("/update", async (req, res, next) => {
  await mongoose.connect("mongodb://localhost:8080");
  let message = new MessageModel(req.body);
  getMessageHistoryPromise(message.name, 1)
    .then((result) => {
      if (!result) {
        return res
          .status(400)
          .send("Message does not exist. Try creating instead.");
      }
      let latest = result[0];
      if (_.isEqual(cleanSpec(latest), cleanSpec(message)))
        return res.send("No change.");
      message.version = latest.version + 1;
      message
        .save()
        .then(() => {
          let message_str = protoStringFromSpec(message);
          res.send(message_str);
        })
        .catch((err) => {
          res.status(400).send(err.message);
        });
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Database error.");
    });
});

routes.get("/messages", async (req, res, next) => {
  await mongoose.connect("mongodb://localhost:8080");
  MessageModel.find()
    .distinct("name")
    .exec()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Database error.");
    });
});

const cleanSpec = (message: IMessage) => {
  let fields = message.fields.map((field) => ({
    type: field.type,
    name: field.name,
    number: field.number,
  }));
  return { name: message.name, fields: fields };
};

routes.get("/:message_name", async (req, res, next) => {
  await mongoose.connect("mongodb://localhost:8080");
  let message_name = req.params.message_name;
  let json = req.query.json;
  let count = 1;
  getMessageHistoryPromise(message_name, count)
    .then((result) => {
      if (!result) {
        return res.status(400).send("Message does not exist.");
      }
      return res.send(
        json ? cleanSpec(result[0]) : protoStringFromSpec(result[0])
      );
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Database error.");
    });
});

routes.get("/:message_name/history", async (req, res, next) => {
  await mongoose.connect("mongodb://localhost:8080");
  let message_name = req.params.message_name;
  let count = req.query.count ? +req.query.count : 10;
  getMessageHistoryPromise(message_name, count)
    .then((result) => {
      if (!result) {
        return res.status(400).send("Message does not exist.");
      }
      return res.send(result.map(protoStringFromSpec));
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Database error.");
    });
});

export default routes;
