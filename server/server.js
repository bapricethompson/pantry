const express = require('express')
const multer = require('multer');
const cors = require('cors')
const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.zeen9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`,{
    dbName: "pantry-api"
});

const Food = mongoose.model('Food',{
    name: {
        type: String,
        required: [true,"missing food name"],
    },
    quantity: {
        type: Number,
        required: [true, "missing quantity"]
    },
    expiration: {
        type: Date,
        required: [true, "missing expiration"]
    },
    category: {
        type: String,
        required: [true, "missing category"]
    },
    storageLocation: {
        type:String,
        required: [true, "missing location"],
        enum: ['Shelf', 'Freezer', 'Fridge']
    }
})

const app = express()
app.use(express.json());
app.use(express.static('client'))
app.use(multer().none());
app.use(cors())


app.get('/foods', function (request, response) {
    Food.find().then(function (data) {
        // Sort the data by expiration date (closest first)
        const sortedData = data.sort((a, b) => new Date(a.expiration) - new Date(b.expiration));
        response.json(sortedData);
    }).catch(function (error) {
        response.status(500).json({ error: error.message });
    });
});


app.get('/foods/:id', function (request,response){
    Food.find(
        {_id:request.params.id}
    ).then(function (food) {
        response.json(food);
    })
}
)

app.delete('/foods/:id', function (request, response){
    Food.findOneAndDelete(
        {_id:request.params.id}
    ).then(function (foo){
        if (foo){
            console.log("Deleted:", foo);
            response.sendStatus(200);
        }else{
            console.log("Food doesn't exist", foo);
            response.sendStatus(404);
        }
    }).catch(function (error){
        console.log("Error occured while trying to delete");
        response.sendStatus(500);
    })
})

app.post('/foods', function (request,response){

    console.log("Request Body:", request.body);

    const foo =new Food({
        name: request.body.name,
        quantity: request.body.quantity,
        expiration: new Date(request.body.expiration),
        category: request.body.category,
        storageLocation: request.body.storageLocation
    });

    foo.save().then(function(){
        response.sendStatus(201)
    }).catch(function (error){
        if (error.errors){
            let errorMessages={};
            for (let field in error.errors){
                console.log("There was a validation error:", field);
                errorMessages[field]=error.errors[field].message;
            }
            response.status(422).json(errorMessages);
        }else{
            console.error("Error trying to save the food",error);
            response.sendStatus(500);
        }
    });


})

app.put('/foods/:id', function (request, response){
    console.log("Request Body:", request.body);
    Food.findOneAndUpdate(
        {_id:request.params.id},
        {
            name: request.body.name,
            quantity: request.body.quantity,
            expiration: new Date(request.body.expiration),
            category: request.body.category,
            storageLocation: request.body.storageLocation
        }
    ).then(function (foo){
        if (foo){
            console.log("Update:", foo);
            response.sendStatus(200);
        }else{
            console.log("Food doesn't exist, cannot update", foo);
            response.sendStatus(404);
        }
    }).catch(function (error){
        if (error.errors){
            let errorMessages={};
            for (let field in error.errors){
                console.log("There was a validation error:", field);
                errorMessages[field]=error.errors[field].message;
            }
            response.status(422).json(errorMessages);
        }else{
            console.error("Error trying to update the food",error);
            response.sendStatus(500);
        }
    });
  
})

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});



app.listen(3000, () => {
  console.log('Server running...')
})
