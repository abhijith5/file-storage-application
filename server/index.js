const express = require('express')
const app = express()

const pool = require("./db")
const uuid = require("uuid")
const cors = require("cors")
const bcrypt = require('bcryptjs')
const multer = require("multer")

//middleware
app.use(cors());
app.use(express.json()); //req.body

var Storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./files")
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
  }
})

var upload = multer({
  storage: Storage
}).array("imgUploader", 3)

app.post("/api/Upload", function (req, res) {

  // console.log(req)
  upload(req, res, function (err) {

    if (err) {
      return res.end("Something went wrong!");
    }
    return res.end("File uploaded sucessfully!.");

  });

});

// Routes
// Register
app.post("/register", async (req, res) => {
  try {
    const { username, password, email, userRole } = req.body;

    let hashPass = bcrypt.hashSync(password, 8);

    const checkEmail = await pool.query(
      `SELECT email from userdetails WHERE email ='${email}'`
    )
    if (checkEmail.rowCount > 0) {
      res.json({ message: "Email already Exsict" })
    } else {
      const newTodo = await pool.query(
        `INSERT INTO userdetails (id,username,email,password,userRole) VALUES ('${uuid.v4()}',  '${username}','${email}', '${hashPass}','${userRole}') RETURNING *`,
      );
      res.json({ data: newTodo.rows[0], message: "successfully signup" });
    }

  } catch (err) {
    console.error(err.message);
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    let dbEmail = await pool.query(
      `SELECT email,password,username FROM userdetails WHERE email='${email}'`
    )

    let hashPass = bcrypt.compareSync(password, dbEmail.rows[0].password);

    console.log(dbEmail.rows[0])
    if (hashPass) {
      res.json({
        username: dbEmail.rows[0].username,
        email: dbEmail.rows[0].email,
        message: "Sucesfully loged"
      })
    } else {
      res.json({ message: "Invalid username / password" })
    }

  } catch (err) {
    console.error(err.message);
  }
})


app.listen(5000, () => {
  console.log("server has started on port 5000");
});

