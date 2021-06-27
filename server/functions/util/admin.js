const functions = require("firebase-functions");
const admin = require("firebase-admin");

const serviceAccount = require("../permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tube-hunt.firebaseio.com",
});

const db = admin.firestore();

module.exports = { admin, db, functions }