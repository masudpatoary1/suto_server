const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5000;
const app = express();
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_KEY}@cluster-2.xmtom.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const partsCollection = await client.db('ph-manufacturing').collection('carParts');
        const companyOverview = await client.db('ph-manufacturing').collection('companyOverview');
        const reviewCollection = await client.db('ph-manufacturing').collection('reviews');
        const orderCollection = await client.db('ph-manufacturing').collection('orders');
        const adminCollection = await client.db('ph-manufacturing').collection('admin');
        const userCollection = await client.db('ph-manufacturing').collection('user');

        app.get('/autoparts', async (req, res) => {
            const query = {}
            const cursor = partsCollection.find(query);
            autoParts = await cursor.toArray();
            res.send(autoParts)
        })


        app.get('/autoparts/:id', async (req, res) => {
            const id = req.params.id;
           
            const query = { _id: ObjectId(id) };
            const parts = await partsCollection.findOne(query);
            res.send(parts);
        })
        app.get('/myorder/:email', async (req, res) => {
            const email = req.params.email;
            const query = { clientEmail: email };
            const orders = await orderCollection.find(query);
            let myOrders = await orders.toArray();
            res.send(myOrders);
        })
        app.get('/order/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const myOrder = await orderCollection.findOne(query);
            res.send(myOrder);
        })
        app.get('/myreview/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const reviews = await reviewCollection.find(query);
            let myReviews = await reviews.toArray();
            res.send(myReviews);
        })

        app.get('/companyoverview', async (req, res) => {
            const query = {}
            const cursor = companyOverview.find(query);
            overview = await cursor.toArray();
            res.send(overview)
        })
        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewCollection.find(query);
            reviews = await cursor.toArray();
            res.send(reviews)
        })
        app.get('/order', async (req, res) => {
            const query = {}
            const cursor = orderCollection.find(query);
            orders = await cursor.toArray();
            res.send(orders)
        })
        app.get('/admin', async (req, res) => {
            const query = {}
            const cursor = adminCollection.find(query);
            admin = await cursor.toArray();
            res.send(admin)
        })
        app.get('/user', async (req, res) => {
            const query = {}
            const cursor = userCollection.find(query);
            user = await cursor.toArray();
            res.send(user)
        })
        app.get('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const singleAdmin = await adminCollection.findOne(query);
            res.send(singleAdmin);
        })

        app.post('/order', async (req, res) => {
            const newOrder = req.body;
            // console.log(newOrder)
            const result = await orderCollection.insertOne(newOrder);
            res.send(result);
        });
        app.post('/autoparts', async (req, res) => {
            const newParts = req.body;
            const result = await partsCollection.insertOne(newParts);
            res.send(result);
        });
        app.post('/admin', async (req, res) => {
            const newAdmin = req.body;
            const result = await adminCollection.insertOne(newAdmin);
            res.send(result);
        });
        app.get('/reviewlimit', async (req, res) => {
            const newReview = req.body;
            const result = await reviewCollection.find(newReview).sort({$natural:-1}).limit(4);;
            const resultforWeb= await result.toArray();
            console.log(resultforWeb)
            res.send(resultforWeb);
        });

        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const status = await req.body.userType;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    userType: status
                }
            }
            const result = await userCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
        app.put('/autoparts/:id', async (req, res) => {
            const id = req.params.id;
            // const requester = req.decoded.email;
            const updatedQty = req.body.inStockQty;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    inStockQty: updatedQty
                }
            }

            const result = await partsCollection.updateOne(filter, updatedDoc, options);
            // console.log(updatedQty)
            res.send(result);
        })
        app.delete('/autoparts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await partsCollection.deleteOne(query);
            res.send(result);
        });
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id;
            
            const query = { _id: ObjectId(id) };
            const result = await orderCollection.deleteOne(query);
            res.send(result);
        });

        app.put('/admin/:email', async (req, res) => {
            const email = req.params.email;
            const updatedUser = await req.body;
            const filter = { email: email };
            const options = { upsert: true };
            const updatedDoc = {
                $set: updatedUser
            }
            const result = await adminCollection.updateOne(filter, updatedDoc, options);
           console.log(result)
            res.send(result);
        })

        app.put('/order/:id', async (req, res) => {
            const id = req.params.id;
            const status = await req.body.shippingStatus;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    shippingStutus: status
                }
            }
            const result = await orderCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })
        app.put('/order/shipping/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const payment = await req.body.payment;
            console.log(await payment)
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    paymentStutus: payment
                }
            }
            const result = await orderCollection.updateOne(filter, updatedDoc, options);
            console.log(result)
            res.send(result);
        })

    }
    finally { }
}
run().catch(console.dir);
app.get('/', (req, res) => {
    res.send('Valley auto parts is running successfully')
})

app.listen(port, () => {
    console.log('Valley auto parts is running at port:', port)
})