const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const cors = require('cors');

//Middleware
app.use(cors());
app.use(express.json());

// Database Configuration
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.4b6iz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Run Function
async function run() {
    try {
        await client.connect();
        const database = client.db('bestWatchPoint');

        // Collections
        const productsCollection = database.collection('products');
        const orderCollection = database.collection('order');
        const reviewCollection = database.collection('reviews');
        const usersCollection = database.collection('users');


        //////////////////////////////////////////////////
        //////// Products Collection APIs Starts ////////////
        //////////////////////////////////////////////////


        // GET Products
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // GET Single Data API
        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const singleProduct = await productsCollection.findOne(query);
            res.json(singleProduct);
        });

        //////////////////////////////////////////////////
        //////// Products Collection APIs Ends ////////////
        //////////////////////////////////////////////////


        //////////////////////////////////////////////////
        //////// Order Collection APIs Starts ////////////
        //////////////////////////////////////////////////

        // POST an Order
        app.post('/order/add', async (req, res) => {
            const cursor = req.body;
            const result = await orderCollection.insertOne(cursor);
            res.json(result);
        });

        // Get All Order
        app.get('/order', async (req, res) => {
            const cursor = orderCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        // GET Single User Order Data
        app.get('/order/:email', async (req, res) => {
            const cursor = req.params.email;
            const query = { userEmail: cursor };
            const result = await orderCollection.find(query).toArray();
            res.json(result);
        });

        // DELETE Single Order 
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.json(result);
        })

        ////////////////////////////////////////////////
        //////// Order Collection APIs Ends ////////////
        ////////////////////////////////////////////////



        ////////////////////////////////////////////////
        //////// Review Collection APIs Starts /////////
        ////////////////////////////////////////////////

        app.post('/review/add', async (req, res) => {
            const cursor = req.body;
            console.log(cursor);
            const result = await reviewCollection.insertOne(cursor);
            res.json(result);
        });

        app.get('/review', async (req, res) => {
            const cursor = reviewCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/review/:email', async (req, res) => {
            const cursor = req.params.email;
            const query = { email: cursor };
            const result = await reviewCollection.find(query).toArray();
            res.json(result);
        })

        ////////////////////////////////////////////////
        //////// Review Collection APIs Ends ///////////
        ////////////////////////////////////////////////


        ////////////////////////////////////////////////
        //////// Users Collection APIs Starts ///////////
        ////////////////////////////////////////////////

        app.post('/users', async (req, res) => {
            const cursor = req.body;
            const result = await usersCollection.insertOne(cursor);
            res.json(result);
        })


        ////////////////////////////////////////////////
        //////// Users Collection APIs Ends ///////////
        ////////////////////////////////////////////////

    }
    finally {
        //await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('I am from Node Server');
});

app.get('/test', (req, res) => {
    res.send('test from heroku update test');
})

app.listen(port, () => {
    console.log('Listening Port ', port);
})