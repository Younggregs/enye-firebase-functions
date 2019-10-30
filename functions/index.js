'use strict';

const express = require('express');
const cors = require('cors');

const uuidv4 = require('uuid/v4')
const uuidv5 = require('uuid/v5');


// Firebase init
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// Express and CORS middleware init
const app = express();
app.use(cors());

// POST / method
app.post("/", (request, response) => {
    const entry = request.body;

    return admin.database().ref('/entries').push(entry)
        .then(() => {
            return response.status(200).send(entry)
        }).catch(error => {
            console.error(error);
            return response.status(500).send('Error: ' + error);
        });
});



// GET / method
app.get("/", (request, response) => {
    return admin.database().ref('/entries').on("value", snapshot => {
        return response.status(200).send(snapshot.val());
    }, error => {
        console.error(error);
        return response.status(500).send(' Error: ' + error);
    });
});


exports.onCreateUser = functions.database
.ref('/entries/{entriesId}')
.onCreate((snapshot, context) => {
     
      const user = snapshot.val();
      const user_id = addUUIDv5()

      return snapshot.ref.update({user_id: user_id});
    });

function addUUIDv5(){
    const seed = uuidv4()
    const url = 'https://enye-challenge.herokuapp.com/' + seed
    const user_id = uuidv5(url, uuidv5.URL);

    return user_id
}


exports.entries = functions.https.onRequest(app);