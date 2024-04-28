const express = require('express')
const app = express()
const cors = require('cors');
const countries = require('./countries.json');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello Roton!')
})


const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.mi2xoxt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const dataBasecollection = client.db('databaseCollection').collection('TravelSpot')
    const CountryDataBase = client.db('databaseCollection').collection('country')
    // const countriesDB =client.db('countriesDb').collection('country');

      // const result = await CountryDataBase.insertMany(countries);
      
    app.get('/contries', async(req,res)=>{
      const cursor = await CountryDataBase.find().toArray()
      res.send(cursor);
    })
    app.get('/ReleteCountryData/:countryName', async(req,res)=>{
      const country = req.params.countryName;
      // console.log(country);
      const query = {countryName:country}
      const cursor = await dataBasecollection.find(query).toArray()
      res.send(cursor);
    })

    app.get('/addTousristSpot',async(req, res)=>{
      const cursor =await dataBasecollection.find().toArray();
      res.send(cursor);
    })
    app.get('/addTousristSpot/:email',async(req, res)=>{
      const email = req.params.email;
      const query = { email: email};
      const cursor =await dataBasecollection.find(query).toArray();
      res.send(cursor);
    })
    app.get('/details/:id',async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id)};
      const cursor =await dataBasecollection.findOne(query)
      res.send(cursor);
    })
    app.get('/updateTourist/:id', async (req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const cursor =await dataBasecollection.findOne(query)
      res.send(cursor);
    })

    app.patch('/updateTourist/:id',async(req, res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const update = { 
        $set:{
          Tourist:req.body.Tourist, 
          TravelTime:req.body.TravelTime, 
          averageCost:req.body.averageCost, 
          countryName:req.body.countryName, 
          email:req.body.email, 
          image:req.body.image, 
          located:req.body.located, 
          seasonality:req.body.seasonality,  
          short_description:req.body.short_description, 
          visitor:req.body.visitor
      }
    };
      const result = await dataBasecollection.updateOne(query, update,options);
      res.send(result);
    })

    app.delete('/addTousristSpot/:id',async (req,res)=>{
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await dataBasecollection.deleteOne(query);
      res.send(result);
    })
    app.post('/addTousristSpot' , async(req,res)=>{
      const data =  req.body
      const result = await dataBasecollection.insertOne(data);
      res.send(result);
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connect MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})