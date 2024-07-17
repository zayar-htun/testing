const express = require("express");
const app = express();

const cors = require("cors");
app.use(cors());

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const jwt = require("jsonwebtoken");
const secret = "horse battery staple";

const { MongoClient, ObjectId } = require("mongodb");
const mongo = new MongoClient("mongodb://127.0.0.1");

const bcrypt = require("bcrypt");

const db = mongo.db("nnwp");

//get 3 service for home page
app.get("/service", async function (req, res) {
    try {
        const result = await db.collection("service").aggregate([]).toArray();

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "No services found" });
        }
    } catch (error) {
        console.error("Error retrieving services:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//get service detail by its id
app.get("/services/:serviceId", async function (req, res) {
    const { serviceId } = req.params;

    try {
        const result = await db
            .collection("service")
            .findOne({ _id: new ObjectId(serviceId) });

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Service not found" });
        }
    } catch (error) {
        console.error("Error retrieving service:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//get 2 place for home page
app.get("/place", async function (req, res) {
    try {
        const result = await db
            .collection("where")
            .aggregate([
                {
                    $limit: 2,
                },
            ])
            .toArray();

        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            return res.status(404).json({ message: "No services found" });
        }
    } catch (error) {
        console.error("Error retrieving services:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

//get location detail by its id
app.get("/location/:locationId", async function (req, res) {
    const { locationId } = req.params;

    try {
        const result = await db
            .collection("where")
            .findOne({ _id: new ObjectId(locationId) });

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Location not found" });
        }
    } catch (error) {
        console.error("Error retrieving service:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

//get all locations
app.get("/location", async function (req, res) {
    try {
        const result = await db.collection("where").find().toArray();
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Location not found" });
        }
    } catch (error) {
        console.error("Error retrieving service:", error);
        res.status(500).json({ message: "Internal service error" });
    }
});

//get Diagnostic Services
app.get("/diagnosticservice", async function (req, res) {
    try {
        const result = await db
            .collection("service")
            .aggregate([
                {
                    $match: { type: "Diagnosis" },
                },
            ])
            .toArray();
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Diagnosis Service Not Found" });
        }
    } catch (error) {
        console.error("Error retrieving service:", error);
        res.status(500).json({ message: "Internal service error" });
    }
});

//get Specialist Services
app.get("/specialistservice", async function (req, res) {
    try {
        const result = await db
            .collection("service")
            .aggregate([
                {
                    $match: { type: "Specialist" },
                },
            ])
            .toArray();
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Specialist Service Not Found" });
        }
    } catch (error) {
        console.error("Error retrieving service:", error);
        res.status(500).json({ message: "Internal service error" });
    }
});

//get all doctor
app.get("/doctor/:cateId", async function (req, res) {
    const { cateId } = req.params;
    try {
        if (cateId === "all") {
            const result = await db.collection("doctor").find().toArray();
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "Doctors not found" });
            }
        } else {
            const result = await db
                .collection("doctor")
                .aggregate([
                    {
                        $match: { category: new ObjectId(cateId) },
                    },
                ])
                .toArray();
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: "Doctors not found" });
            }
        }
    } catch (error) {
        console.error("Error retrieving service:", error);
        res.status(500).json({ message: "Internal service error" });
    }
});

//get all category
app.get("/allcategory", async function (req, res) {
    try {
        const result = await db.collection("category").find().toArray();
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: "Categories not found" });
        }
    } catch (error) {
        console.error("Error retrieving service:", error);
        res.status(500).json({ message: "Internal service error" });
    }
});

//login
app.post("/login", async function (req, res) {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ msg: "required: handle and password" });
    }

    try {
        const user = await db.collection("users").findOne({ email });

        if (user) {
            const result = await bcrypt.compare(password, user.password);

            if (result) {
                const token = jwt.sign(user, secret);
                return res.status(201).json({ token, user });
            }
        }

        return res.status(403).json({ msg: "Incorrect email or password" });
    } catch (e) {
        return res.status(500).json({ msg: e.message });
    }
});

//auth middleware
const auth = function (req, res, next) {
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Token required" });
    }

    try {
        let user = jwt.verify(token, secret);
        res.locals.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ msg: err.message });
    }
};

app.listen(8888, () => {
    console.log("X api running at 8888");
});
