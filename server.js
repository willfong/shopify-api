import express from "express";
import morgan from "morgan";
import axios from "axios";

const app = express();
app.use(morgan('combined'));

const SHOPIFY_APP_API_KEY = process.env.SHOPIFY_APP_API_KEY;
const SHOPIFY_APP_API_SECRET = process.env.SHOPIFY_APP_API_SECRET;
const SHOPIFY_APP_API_SCOPE = process.env.SHOPIFY_APP_API_SCOPE;

app.get("/", (req, res) => {
  res.send("Sup yo");
});

app.get("/oauth/authorize", (req, res) => {
  const shop = req.query.shop;
  console.log(`Received authorization request for: ${shop}`);
  const redirect_uri = "http://localhost:3000/oauth/callback";
  const url = `https://${shop}/admin/oauth/authorize?client_id=${SHOPIFY_APP_API_KEY}&scope=${SHOPIFY_APP_API_SCOPE}&redirect_uri=${redirect_uri}`;
  res.redirect(url);
});

app.get("/oauth/callback", async (req, res) => {
  const code = req.query.code;
  const shop = req.query.shop;
  console.log(`Authorization code for [${shop}]: ${code}`);
  console.log("Exchanging code for access token...");
  const url = `https://${shop}/admin/oauth/access_token`;
  const params = {
    client_id: SHOPIFY_APP_API_KEY,
    client_secret: SHOPIFY_APP_API_SECRET,
    code
  }
  const response = await axios.post(url, params);
  console.log(response.data);
  res.json(response.data);
});

app.get("/error", (req, res) => {
  throw("This is an error");
});

app.use((req, res) => {
  res.status(404).send("404: File not found");
});

app.use((error, req, res, next) => {
  console.log(error);
  res.status(500).send("500: Internal server error");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));
