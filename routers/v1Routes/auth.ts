import bcrypt from "bcrypt";
import express from "express";
import _ from "lodash";

import { User } from "../../models";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email });
  if (!user) return res.status(400).send("Invalid email or password.");

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password.");

  // @ts-ignore
  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "username", "email"]));
});

export default router;
