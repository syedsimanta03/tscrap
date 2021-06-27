const express = require("express");
const cors = require("cors");
const cheerio = require("cheerio");
const axios = require("axios");
const app = express();
const { authentication } = require("./util/authentication");
const { db, admin, functions } = require("./util/admin");

app.use(cors({ origin: true }));

// create user doc on auth 
exports.createUser = functions.auth.user().onCreate(async (user) => {
  const user_profile = {
      uid: user.uid,
      email: user.email,
      handle: null,
      level: [
        {level:1 , createdAt: Date.now()}
      ]
  }

  // go to firestore and create user profile
    await db.collection('users')
    .doc(`/${user.uid}/`)
    .create(user_profile)

    return null;
})

// add authentication middleware
app.get("/api/:channelId/upvote", authentication, async (req, res) => {
  try {
    const upvote_by = {
      uid: req.user.uid,
      createdAt: Date.now(),
    };
    const channelId = req.params.channelId;
    const channelSnapshot = await db.collection(`channels`);

    channelSnapshot
      .doc(`/${channelId}/`)
      .update({
        upvotesCount: admin.firestore.FieldValue.increment(1),
        upvotes: admin.firestore.FieldValue.arrayUnion(upvote_by),
      });

    return res.status(200).send("Upvoted!");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// add authentication middleware
app.get("/api/:channelId/downvote", authentication, async (req, res) => {
  try {
    const upvote_by = {
      uid: req.user.uid,
      createdAt: Date.now(),
    };
    const channelId = req.params.channelId;
    const channelSnapshot = await db.collection(`channels`);

    channelSnapshot
      .doc(`/${channelId}/`)
      .update({
        upvotesCount: admin.firestore.FieldValue.increment(-1),
        upvotes: admin.firestore.FieldValue.arrayUnion(upvote_by),
      });

    return res.status(200).send("Downvoted!");
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

// submit channels
app.post("/api/channel/submit", authentication , async (req, res) => {
    try {
      const { url } = req.body;
      const { data } = await axios.get(url);
      const $ = cheerio.load(data);

            // getting metadata
            const metadata =  
            {
                title: $('meta[name="title"]').attr('content'),
                keywords: $('meta[name="keywords"]').attr('content').split(' '),
                desc: $('meta[name="description"]').attr('content'),
                channelId: $('meta[itemprop="channelId"]').attr('content'),
                subscribe: $('link[itemprop="url"]').attr('href') + '?sub_confirmation=1',
                isFamilyFriendly: $('meta[itemprop="isFamilyFriendly"]').attr('content'),
                imgSrc:$('link[rel="image_src"]').attr('href'),
                dateSubmitted: Date.now(),
                upvotesCount: 0,
                upvotes: [],
                submitedBy: req.user.uid
            }

      // get top 20 videos
      await db
        .collection("channels")
        .doc("/" + metadata.channelId + "/")
        .create(metadata);
      return res.status(200).send(metadata);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
});

// get all channels
app.get("/api/channels", async (req, res) => {
    try {
      const channelSnapshot = await db.collection("channels").orderBy("dateSubmitted", 'desc').get();
      const channels = [];
      channelSnapshot.forEach((doc) => {
        channels.push(doc.data());
      });
      res.status(200).send(channels);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
});

// get videos by channels
app.get("/api/videos/:channelId", async (req, res) => {
    try {
      const channelId = req.params.channelId;
      const { data } = await axios.get(`https://www.youtube.com/channel/${channelId}`);
      const $ = cheerio.load(data);

      const regex = /watch[?]v=(\S{11})/g;

      videoIds = []
      while ((match = regex.exec(data)) !== null) {
        videoIds.push(match[1])
      }

      response = {
        status: 200,
        // make videoId unique
        videoIds: [...new Set(videoIds)]
      }

      res.status(200).send(response);
    } catch (error) {
      console.log(error);
      return res.status(500).send(error);
    }
});

// add comment to a channel
app.post('/api/:channelId/comment', authentication, async (req, res) => {
      try {          
          const channelId = req.params.channelId;
          const { comment } = req.body;
          const comment_object = {
            comment: comment,
            uid: req.user.uid,
            createdAt: Date.now(),
          };

          // create new comments
          await db.collection(`channels`)
          .doc(`/${channelId}/`)
          .update({comments: admin.firestore.FieldValue.arrayUnion(comment_object)})
          
          return res.status(200).send(`added comment: ${comment}!`);

      } catch(error) {
          console.log(error);
          return res.status(500).send(error);
      }
});

// a

exports.app = functions.https.onRequest(app);
