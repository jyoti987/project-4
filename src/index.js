const express =require('express')
const app =express()
const mongoose = require('mongoose')
const route = require('./routes/route')
app.use(express.json())


mongoose.connect('mongodb+srv://kasarvaibhav777:VqAQ4xWgRUOXRW7N@cluster0.y2iweu3.mongodb.net/Project-04', {
    useNewUrlParser: true
})
.then( ()=> console.log("MongoDb is connected"))
.catch( err => console.log(err))


app.use('/', route)

app.listen(3000, function () {
    console.log('Express is running on port 3000')
})