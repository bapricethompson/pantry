const express = require('express')
const bcrypt = require('bcrypt')
const req = require('express/lib/request')
const session=require('express-session');
const app = express()

//global middlewares get called first
app.use(express.static('client'))
app.use(session({
    secret: 'adsvkn4t4kjtnaovhoaq2p0vadfnq9r0g',
    resave: false,
    saveUninitialized:true
}))
const multer = require('multer');
const cors = require('cors')
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.zeen9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`, {
    dbName: "pantry-api"});

function authorizeUser(request, response, next) {
    if (request.session.userId){
        //find user
        User.findOne({
            _id: request.session.userId
        }).then(function (user) {
            if (user){
                // current request is authenticated
                // if so next()
                request.user=user; //saves logged in user for other uses
                next();
            }
            else{
                response.sendStatus(401);
            }
        })
    } else {
        response.sendStatus(401);
    }
}

const User = mongoose.model('User',{
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,  // Prevents duplicate emails
        lowercase: true,  // Converts email to lowercase before saving
        trim: true,  // Removes leading/trailing spaces
        match: [/^\S+@\S+\.\S+$/, "Invalid email format"]  // Regex for email validation
    },
      encryptedPassword: {
        type: String,
          required: [true,"missing password"],
      }
      
  })

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
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})


app.use(express.json());
app.use(express.static('client'))
app.use(multer().none());
app.use(cors())


app.get('/foods', authorizeUser, function (request, response) {
    Food.find(
        {owner: request.session.userId}
    ).then(function (data) {
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

app.delete('/foods/:id', authorizeUser, function (request, response){
    Food.findOneAndDelete(
        {_id:request.params.id,
            owner: request.session.userId
        }
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

app.post('/foods', authorizeUser, function (request,response){

    console.log("Request Body:", request.body);

    const foo =new Food({
        name: request.body.name,
        quantity: request.body.quantity,
        expiration: new Date(request.body.expiration),
        category: request.body.category,
        storageLocation: request.body.storageLocation,
        owner: request.session.userId
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

//END POINT CREATE USER
app.post('/users', function (request, response) {
    User.findOne({ email: request.body.email })
        .then(existingUser => {
            if (existingUser) {
                return response.status(400).json({ error: "Email is already registered" });
            }
            
            return bcrypt.hash(request.body.password, 12)
                .then(hash => {
                    const newUser = new User({
                        email: request.body.email,
                        encryptedPassword: hash
                    });
                    
                    return newUser.save().catch(function (error){
                        if (error.errors){
                            let errorMessages={};
                            for (let field in error.errors){
                                console.log("There was a validation error:", field);
                                errorMessages[field]=error.errors[field].message;
                            }
                            response.status(422).json(errorMessages);
                        }else if (error.code == 11000){
                            response.status(422).json({
                                email:"Email must be unique"
                            });
                        }else{
                            console.error("Error trying to save the food",error);
                            response.sendStatus(500);
                        }
                    });;
                })
                .then(user => {
                    response.status(201).json(user);
                });
        })
        .catch(function (error){
            if (error.errors){
                let errorMessages={};
                for (let field in error.errors){
                    console.log("There was a validation error:", field);
                    errorMessages[field]=error.errors[field].message;
                }
                response.status(422).json(errorMessages);
            }else{
                console.error("Error trying to create user",error);
            response.sendStatus(500);
            }
        });
});

app.get('/session', authorizeUser, function (request, response){
    console.log("current session", request.session);
    response.json(request.user);
})

app.post('/session', function (request,response){
    User.findOne(
        {email:request.body.email}
    ).then(function (user){
        if (user){
            bcrypt.compare(request.body.password, user.encryptedPassword).then(function (result){
                if (result) {
                    request.session.userId = user._id;
                    response.sendStatus(201);
                } else{
                    response.sendStatus(401);
                }
            })
        } else{
            response.sendStatus(401);
        }
    })
})

app.delete('/session',authorizeUser, function(request, response){
    request.session.userId=null;
    response.sendStatus(200);
})

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(3000, () => {
  console.log('Server running...')
})
