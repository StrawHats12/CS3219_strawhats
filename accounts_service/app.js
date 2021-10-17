const Account = require("./account");
const express = require("express");
const { PORT } = require("./const");
const {
  getAccountByUsername,
  addOrUpdateAccount,
  deleteAccount,
} = require("./dynamoDb");

const cors = require("cors");
const app = express();
const morgan = require("morgan");
const { auth, roles } = require("./auth");

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("Server is up and running!");
});

app.get("/account/:username", async (req, res) => {
  const username = req.params.username;
  try {
    const account = await getAccountByUsername(username);
    res.json(account);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.put("/account/:username", auth(roles.USER), async (req, res) => {
  const username = req.params.username;
  const body = req.body;
  body.username = username;
  const account = new Account(body);

  try {
    const oldAccount = await getAccountByUsername(username);

    if (oldAccount?.Item?.username !== req.user.username) {
      res
        .status(403)
        .json({ err: "User is not authorised to update this account" });
    }

    const newAccount = await addOrUpdateAccount(account);
    res.json(newAccount);
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.delete("/account/:username", auth(roles.USER), async (req, res) => {
  const username = req.params.username;
  try {
    const account = await getAccountByUsername(username);
    if (account?.Item?.username !== req.user.username) {
      res
        .status(403)
        .json({ err: "User is not authorised to delete this account" });
    }

    res.json(await deleteAccount(username));
  } catch (err) {
    console.error(err);
    res.status(500).json({ err: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
