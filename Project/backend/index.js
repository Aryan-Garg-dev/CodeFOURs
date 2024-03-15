const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const rootRouter = require("./routes/index");
const PORT = 3000;

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/v1", rootRouter);

app.listen(PORT, (req, res)=>{
    console.log(`App is listening to the ${PORT}`);
})
