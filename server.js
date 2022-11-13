require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true})
const db = mongoose.connection;
db.on('error', (error) => console.log(error));
db.once('open', () => console.log('Connected to Database'));

app.use(express.json());

const userRouter = require('./routes/user');
app.use('/user', userRouter);

const ownedBooksRouter = require('./routes/owned-books');
app.use('/owned-books', ownedBooksRouter);

app.listen(3000, (() => console.log('Server started')));
