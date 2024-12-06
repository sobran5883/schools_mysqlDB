import express from "express";
import mysql from "mysql";
import cors from "cors";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
});

app.use(express.json({ limit: "500kb" })); // Set JSON payload limit to 500 KB
app.use(cors(
    {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}
));


// Test the database connection
db.connect((err) => {
    if (err) {
        console.error("Error connecting to the database:", err);
    } else {
        console.log("Connected to the database!");
    }
});

app.get("/", (req, res) => {
    res.json("Hello, this is the backend");
});

app.get("/schools", (req, res) => {
    const q = "SELECT * FROM schools";
    db.query(q, (err, data) => {
        if (err) {
            console.log(err);
            return res.json(err);
        }
        return res.json(data);
    });
});

app.post("/schools", (req, res) => {
    const q = "INSERT INTO schools (`name`, `address`, `city`, `state`, `contact`, `image`, `email`) VALUES (?)";
    const values = [
        req.body.name,
        req.body.address,
        req.body.city,
        req.body.state,
        req.body.contact,
        req.body.image,
        req.body.email,
    ];

    db.query(q, [values], (err, data) => {
        if (err) {
            return res.send(err);
        }
        return res.json("School has been created successfully");
    });
});

app.delete("/schools/:id", (req, res) => {
    const schoolId = req.params.id;
    const q = "DELETE FROM schools WHERE id = ?";

    db.query(q, [schoolId], (err, data) => {
        if (err) {
            return res.send(err);
        }
        return res.json("School has been deleted successfully");
    });
});

app.put("/school/:id", (req, res) => {
    const schoolId = req.params.id;
    const q = "UPDATE schools SET `name`=?, `address`=?, `city`=?, `state`=?, `contact`=?, `image`=?, `email`=?, WHERE id=?";

    const values = [
        req.body.name,
        req.body.address,
        req.body.city,
        req.body.state,
        req.body.contact,
        req.body.image,
        req.body.email,
    ];

    db.query(q, [...values, schoolId], (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json("School has been updated successfully");
    });
});

app.get("/schools/:id", (req, res) => {
    const schoolId = req.params.id;
    const q = "SELECT * FROM schools WHERE id = ?";

    db.query(q, [schoolId], (err, data) => {
        if (err) {
            return res.json(err);
        }
        return res.json(data[0]); // Send the school object
    });
});

const port = process.env.PORT || 8800;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});