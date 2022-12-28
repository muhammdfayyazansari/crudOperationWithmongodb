import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";

let productShema = new mongoose.Schema({
  name: { type: String, required: true },
  price: Number,
  category: String,
  description: String,
  createdOn: { type: Date, default: Date.now },
});

const productModel = mongoose.model("products", productShema);

const app = express();
app.use(express.json());
// app.use(cors())
const port = process.env.PORT || 5001;

app.post("/product", (req, res) => {
  const body = req.body;
  console.log("My Product >>> ", body)
  if (!body.name || !body.price || !body.category || !body.description) {
    res.status(400).send(`required parameter missing. example request body: {
      'name': 'value',
      'price': 'value',
      'category': 'value',
      'description': 'value'
    }`);
    return;
  }
  productModel.create(
    {
      name: body.name,
      price: body.price,
      category: body.category,
      description: body.description,
    },
    (err, saved) => {
      if (!err) {
        console.log(saved);
        res.send({
          message: "your product is saved.",
        });
      } else {
        res.status(500).send({
          message: "server error",
        });
      }
    }
  );
});

app.get("/products", (req, res) => {
  productModel.find({}, (err, data) => {
    if (!err) {
      res.send({
        message: "Here are your products list.",
        data: data,
      });
    } else {
      res.status(500).send({
        message: "Server error",
      });
    }
  });
});

app.get("/product/:id", (req, res) => {
  const id = req.params.id;
  productModel.findOne({ _id: id }, (err, data) => {
    if (!err) {
      if (data) {
        res.send({
          message: "Here is your Product.",
          data: data,
        });
      } else {
        res.send({
          message: "no product found.",
          data: data,
        });
      }
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
});

app.put("/product/:id", async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  // console.log("Body >>>", body)
  if (!body.name || !body.price || !body.category || !body.description) {
    res.status(400).send(`required parameter missing. example request body: {
    'name': 'value',
    'price': 'value',
    'category': 'value',
    'description': 'value'
  }`);
    return;
  }
  try {
    let data = await productModel
      .findByIdAndUpdate(
        id,
        {
          name: body.name,
          price: body.price,
          category: body.category,
          description: body.description,
        },
        { new: true }
      )
      .exec();

    console.log("updated Data>>>", data);
    res.send({
      message: "Product updated successfully",
      data: data,
    });
  } catch (error) {
    res.status(500).send({
      message: "server error",
    });
  }
});

app.delete("/products", (req, res) => {
  productModel.deleteMany({}, (err, data) => {
    if (!err) {
      res.send({
        message: "All products has been successfully deleted.",
      });
    } else {
      res.status(500).send({
        message: "error error",
      });
    }
  });
});

app.delete("/product/:id", (req, res) => {
  const id = req.params.id;
  // console.log("id ", id)
  productModel.deleteOne({ _id: id }, (err, deletedData) => {
    console.log("deleted Data >>> ", deletedData);
    if (!err) {
      if (deletedData.deletedCount !== 0) {
        res.send({
          message: "Product has been deleted successfully.",
          data : deletedData
        });
      } else {
        res.send({
          message: `No product found with this id: ${id}`,
        });
      }
    } else {
      res.status(500).send({
        message: "server error",
      });
    }
  });
});
// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// app.get("/weather", (userRequest, adminRespond) => {
//   let karachiWeather = {
//     cityName: "karachi",
//     temperature: "29",
//     humidity: "24%",
//     min: "28",
//     max: "30",
//   };
//   // console.log(`${userRequest} is asking for weather`)
//   console.log(userRequest);
//   adminRespond.send(karachiWeather);
// });

const _dirname = path.resolve();
app.get("/", express.static(path.join(_dirname, "/web")));
app.use("/", express.static(path.join(_dirname, "/web")));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

/////////////////////// /////////////////////// Mongo Db Setup  ///////////////////////////////////////

const dbUri =
  "mongodb+srv://dbuser:dbpassword@cluster0.8y9ksq0.mongodb.net/?retryWrites=true&w=majority";
mongoose.connect(dbUri);

/////////////////////// Monogdb connected disconnected Events ///////////////////////////////////////
mongoose.connection.on("connected", function () {
  console.log("Mongoose is connected ");
});

mongoose.connection.on("disconnected", function () {
  console.log("Mogoose is disconnected >>>>>>");
  prodcess.exit(1);
});

mongoose.connection.on("error", function (err) {
  console.log("Mongoose connection error ", err);
  process.exit(1);
});

process.on("SIGINT", function () {
  // This function will just be
  console.log("app is terminating ");
  mongoose.connection.lose(function () {
    console.log("Mongoose default connection closed");
    process.exit(0);
  });
});
/////////////////////// Monogdb connected disconnected Events ///////////////////////////////////////
