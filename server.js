require("dotenv").config();
const path = require('path')
const express = require('express')
const cors = require('cors')
const {logger} = require('./middleware/logEvents')
const {errorHandler} = require('./middleware/errorHandler')
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser')
const credentials = require('./middleware/credentials')
const corsOptions = require('./config/corsOptions')
const app = express()
const mongoose =  require('mongoose')
const connectDb = require('./config/dbConn')
const PORT = process.env.PORT || 3500


//connect to mongoDb
connectDb()

//custom middleware logger
app.use(logger)
//Handle options credentials check - before CORS!
//and fetch cookies credentials requirement
app.use(credentials)
app.use(cors(corsOptions))

app.use(express.urlencoded({extended: false}))

//built in middleware for json
app.use(express.json())

//middleware for cookies
app.use(cookieParser())

app.use('/', express.static(path.join(__dirname, '/public')))

app.use('/', require('./routes/root'))
app.use('/students', require('./routes/api/students'))
app.use('/register', require('./routes/api/register'))
app.use('/auth', require('./routes/api/auth'))
app.use('/refresh', require('./routes/api/refresh'))
app.use('/logout', require('./routes/api/logout'))

app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))


app.all('/*', (req, res) => {
    res.status(404);
    if(req.accepts('html'))
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    else if(req.accepts('json'))
        res.json({error: "404 Not Found"})
    else 
        res.type('txt').send('404 Not Found')

})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log("Connected to the mongo db")
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
})
