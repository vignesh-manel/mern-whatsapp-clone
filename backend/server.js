const express = require('express');
const mongoose = require('mongoose');

const app = express()
const port = process.env.PORT || 9000

const connection_url = 'mongodb+srv://admin:xA1vF1OievwsDShq@cluster0.fujwv.mongodb.net/whatsappdb?retryWrites=true&w=majority'

mongoose.connect(connection_url,{
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.get('/',(req,res) => res.status(200).send('hello world'))

app.listen(port, () => console.log(`listening on localhost:${port}`))
