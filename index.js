const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.r3tx4xp.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)

    await client.connect();
    const toysCollection = client.db("EducationalToys").collection("toys");

    app.post("/addToy", async (req, res) => {
      const body = req.body;
      body.createdAt = new Date();
      const result = await toysCollection.insertOne(body);
      res.send(result);
      console.log(result);
    });

    app.get("/myToys/:email", async (req, res) => {
      const email = req.params.email;
      const result = await toysCollection
        .find({ sellerEmail: email })
        .toArray();
      res.send(result);
    });

    app.get("/allToys", async (req, res) => {
      const result = await toysCollection.find().toArray();
      res.send(result);
    });

    app.get('/details/:id', async(req,res)=>{
      const id = req.params.id;
      console.log(id)
      const query = {_id: new ObjectId(id)};
      const result = await toysCollection.findOne(query)
      res.send(result)
    })

    
    app.get("/allToys/:text", async (req, res) => {
      const text = req.params.text;
      // console.log(text)
      if (text == "math" || text == "language" || text == "science") {
        const result = await toysCollection.find({ category: text }).toArray();
        res.send(result);
      } 
      else {
        const result = await toysCollection.find({}).toArray();
        res.send(result);
      }
    });

    // app.get('/myToys/:id', async(req,res)=>{

    // })

    
    app.delete("/allToys/:id", async(req,res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Toys Is Running");
});

app.listen(port, () => {
  console.log(`Toys is running on port ${port}`);
});
