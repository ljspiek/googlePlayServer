const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(morgan('common'));

const googleApps = require('./playstore')

app.get('/apps', (req, res) => {
    const { genres = "", sort } = req.query;

    if(sort) {
        if(!['rating', 'app'].includes(sort)) {
            return res
                .status(400)
                .send('Sort must be rating or app.')
        }
    }

    if(genres){
        if(!['action', 'puzzle', 'strategy', 'casual', 'arcade', 'card'].includes(genres)){
            return res
                .status(400)
                .send('Genre must be action, puzzle, strategy, casual, arcade or card.')
        }
    }
    

    let results = googleApps
        .filter(googleApp => 
            googleApp
                .Genres
                .toLowerCase()
                .includes(genres.toLowerCase()));
    if (sort) {
        results
            .sort((a, b) => {
                return a[sort] > b[sort] ? 1 : a[sort] < b[sort] ? -1: 0;
            });
    }

    res
        .json(results);
})

app.listen(8000, () => {
    console.log('Server started on PORT 8000');
})