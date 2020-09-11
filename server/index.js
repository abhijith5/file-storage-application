const express = require('express')
const app = express()

const pool = require("./db")
const uuid = require("uuid")
const cors = require("cors")
const bcrypt = require('bcryptjs')

//middleware
app.use(cors());
app.use(express.json()); //req.body

const fileUpload = require("express-fileupload");
app.use(fileUpload());


// Upload api using express-fileUpload

app.post('/api/upload', async (req, res) => {

  // console.log(req.files.pdffile)
  if (req.files === null) {
    return res.status(400).json({ msg: 'No file uploaded' });
  }
  const file = req.files.pdffile
  // console.log(file)

  const file_ext = Math.floor(Math.random() * Math.floor(10000));

  file.mv(`../client/public/uploads/${file.name}`, err => {
    if (err) {
      console.error(err);
      return res.status(500).send(err);
    }
    file.mv(`../client/public/uploads/${file.name}`),
      res.json({ fileName: file.name, filePath: `/uploads/${file.name}` });

  });

})


// API for pdf add into the database
app.post("/pdf/add", async (req, res) => {
  try {
    const { userid, pdfpath, pdfname } = req.body

    const uploadpdfPath = await pool.query(
      `INSERT INTO pdfdetails (id,userid,pdfpath,pdfname,isadmin) VALUES ('${uuid.v4()}','${userid}','${pdfpath}','${pdfname}',${true} ) RETURNING *`,
    );
    res.json({ code: 300, data: uploadpdfPath.rows[0], message: "successfully pdf uploaded" });

  } catch (e) {
    console.error(e.message);

  }
})

// TO get pdf data for admin 
app.post("/admin/pdf/data", async (req, res) => {
  try {

    const getpdfdata = await pool.query(
      `SELECT ud.username,pd.pdfpath,pd.pdfname FROM pdfdetails as pd 
      INNER JOIN userdetails as ud ON ud.id=pd.userid WHERE pd.isadmin=${req.body.role}`
    );

    console.log(getpdfdata)

    res.json({ message: "sucessfully get pdf data", code: 500, data: getpdfdata.rows })


  } catch (e) {
    console.log(e.message)
  }
})


// To get pdf data for general users (users)
app.post("/pdf/data", async (req, res) => {
  try {

    const getpdfdata = await pool.query(
      `SELECT * FROM pdfdetails WHERE userid='${req.body.userid}' or isadmin=${req.body.role}`
    );

    res.json({ message: "sucessfully get pdf data", code: 500, data: getpdfdata.rows })


  } catch (e) {
    console.log(e.message)
  }
})

// API for searchable result 
app.post("/pdf/data/search", async (req, res) => {
  try {

    const getpdfdata = await pool.query(
      `SELECT * FROM pdfdetails WHERE userid='${req.body.userid}' and pdfname='${req.body.searchFilename}'`
    );

    res.json({ message: "sucessfully get pdf data", code: 00, data: getpdfdata.rows })


  } catch (e) {
    console.log(e.message)
  }
})

// API for searchable result in admin
app.post("/admin/pdf/data/search", async (req, res) => {
  try {

    const getpdfdata = await pool.query(
      `SELECT ud.username,pd.pdfpath,pd.pdfname FROM pdfdetails as pd 
      INNER JOIN userdetails as ud ON ud.id=pd.userid WHERE pd.isadmin=${req.body.role} and pdfname='${req.body.searchFilename}'`
    );

    res.json({ message: "sucessfully get pdf data", code: 00, data: getpdfdata.rows })


  } catch (e) {
    console.log(e.message)
  }
})


// Register
app.post("/register", async (req, res) => {
  try {
    const { username, password, email, userRole } = req.body;

    let hashPass = bcrypt.hashSync(password, 8);

    const checkEmail = await pool.query(
      `SELECT email from userdetails WHERE email ='${email}'`
    )
    if (checkEmail.rowCount > 0) {
      res.json({ code: 301, message: "Email already Exsict" })
    } else {
      const user = await pool.query(
        `INSERT INTO userdetails (id,username,email,password,userRole) VALUES ('${uuid.v4()}',  '${username}','${email}', '${hashPass}','user') RETURNING *`,
      );
      res.json({ code: 300, data: user.rows[0], message: "successfully signup" });
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
      `SELECT id,email,password,username,userrole FROM userdetails WHERE email='${email}'`
    )

    let hashPass = bcrypt.compareSync(password, dbEmail.rows[0].password);

    console.log(dbEmail.rows[0])
    if (hashPass) {
      res.json({
        code: 300,
        userid: dbEmail.rows[0].id,
        username: dbEmail.rows[0].username,
        email: dbEmail.rows[0].email,
        userrole: dbEmail.rows[0].userrole,
        message: "Sucesfully loged"
      })
    } else {
      res.json({ code: 301, message: "Invalid username / password" })
    }

  } catch (err) {
    console.error(err.message);
  }
})


app.listen(5000, () => {
  console.log("server has started on port 5000");
});

