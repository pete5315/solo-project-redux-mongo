const express = require("express");
const {
  rejectUnauthenticated,
} = require("../modules/authentication-middleware");
const User = require("../models/user");
const lastListId = require("../modules/lastListId");
// const pool = require("../modules/pool");

// const router = express.Router();
const app = express();
const router = express.Router();
console.log("in users router");

// Define your routes and endpoints

//get all lists for a particular user
router.get("/", async (req, res) => {
  // Get all lists
  await User.find({
    _id: "64e6493ce50dc851f964407d",
  }) //will need to include the specific userid when authentication/login is working, hardcoded for now
    .then((documents) => {
      const jsonResult = JSON.parse(JSON.stringify(documents, null, 2)); //this converts the cursor to object format
      res.send(jsonResult[0].lists); //this should return the id of the newest list just added
    })
    .catch((error) => {
      console.error("Error fetching and converting documents:", error);
    });
});

router.get("/:id", async (req, res) => {
  // // Get all users
  // const users = await User.find();
  // res.json(users);
});

router.post("/", async (req, res) => {
  console.log("requser42", req.user);
  // Add a new list
  let newId = await lastListId(req.params.id, res);
  // console.log('newid', newId);
  console.log(await lastListId(req.params.id, res));
  User.updateOne(
    //this adds a new list
    // { _id: req.user.id, 'orders.orderId': orderId }, //need req.user.id to show the _id value from mongo
    { _id: "64e6493ce50dc851f964407d" }, //user id hardcoded currently
    {
      $push: {
        lists: [
          {
            __listId: newId + 1,
            games: [],
            matchups: [],
            results: [],
            lastModifiedDate: new Date(),
            completed: false,
          },
        ],
      },
    } //this is the list object format, __id hardcoded currently
  )
    .then((result) => {
      console.log("Update result:", result);
    })
    .catch((error) => {
      console.error("Error updating nested array:", error);
    });
  // res.json(user);
});

router.put("/:id", async (req, res) => {
  // // Update a user by ID
  // const user = await User.findById(req.params.id);
  // user.name = req.body.name;
  // user.age = req.body.age;
  // await user.save();
  // res.json(user);
});

router.delete("/:userId/:listId", async (req, res) => {
  // // Delete a user by ID
  console.log("delete req params", req.params.id);
  const { userId, listId } = req.params;

  try {
    const user = await User.findById('64e6493ce50dc851f964407d'); //userId hardcoded for now

    if (user) {
      // Use the $pull operator to remove the list by its listId
      user.lists = user.lists.filter(list => list.__listId !== parseInt(listId, 10));
      await user.save();

      console.log(`List with listId ${listId} deleted for user ${userId}`);
      res.status(200).json({ message: `List with listId ${listId} deleted successfully` });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error deleting list:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }

});

module.exports = router;