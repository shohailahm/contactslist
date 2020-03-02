const express = require("express");
const redis = require("redis");

const bodyParser = require("body-parser");

//setup port constants
const port_redis = process.env.PORT || 6379;
const port = process.env.PORT || 5000;

//configure redis client on port 6379
 exports.redis_client = redis.createClient(port_redis);

//configure express server
const app = express();

//const router = express.Router({mergeParams:true});

//Body Parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//listen on port 5000;
app.listen(port, () => console.log(`Server running on Port ${port}`));
var routes = require('./routes'); //importing route


routes(app); 
