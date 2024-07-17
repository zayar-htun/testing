const faker = require("faker");

const { MongoClient, ObjectId } = require("mongodb");

const bcrypt = require("bcrypt");

const mongo = new MongoClient("mongodb://localhost");
const db = mongo.db("nnwp"); // Update with your actual database name


async function seedUsers() {
  await db.collection("users").deleteMany({});

  let hash = await bcrypt.hash("password", 10);

  let data = [
    {
      name: "Admin User1",
      role: "admin",
      email: "admin1@gmail.com",
      password: hash,
    },
    {
      name: "Admin User2",
      role: "admin",
      email: "admin2@gmail.com",
      password: hash,
    },
  ];

  try {
    return await db.collection("users").insertMany(data);
  } finally {
    console.log("User seeding done.");
  }
}

async function seedService() {
  await db.collection("service").deleteMany({});

  let data = [];
  for (let i = 0; i < 12; i++) {
    data.push({
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      fulldescription: faker.lorem.paragraph(),
      type: i % 2 === 0 ? "Diagnosis" : "Specialist",
      image1: "", // You can add base64 images here if needed
      image2: "", // You can add base64 images here if needed
    });
  }

  try {
    return await db.collection("service").insertMany(data);
  } finally {
    console.log("Service seeding done.");
  }
}

async function seedWhere() {
  await db.collection("where").deleteMany({});

  let data = [];
  for (let i = 0; i < 6; i++) {
    data.push({
      name: faker.lorem.words(2),
      address: faker.lorem.words(2),
      phone: faker.phone.phoneNumber("091#######"),
      open: [faker.random.arrayElement(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])],
      close: [faker.random.arrayElement(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])],
      image1: "",
      image2: "",
      map: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3819.8443428066016!2d96.13226977467062!3d16.78441811989629!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30c1eb7267ef0b31%3A0x208d774392f2a4f1!2sNi%20Ni%20Diagnostics%20%26%20Health%20Care!5e0!3m2!1sen!2smm!4v1705328566291!5m2!1sen!2smm",
    });
  }

  try {
    return await db.collection("where").insertMany(data);
  } finally {
    console.log("Where seeding done.");
  }
}

async function seedCategory() {
  await db.collection("category").deleteMany({});

  let data = [];
  for (let i = 0; i < 3; i++) {
    data.push({
      name: faker.lorem.words(2),
      image: "", // You can add base64 images here if needed
    });
  }

  try {
    return await db.collection("category").insertMany(data);
  } finally {
    console.log("Category seeding done.");
  }
}

async function seedDoctor() {
  await db.collection("doctor").deleteMany({});

  const categories = await db.collection("category").find().toArray();
  const places = await db.collection("where").find().toArray();

  let data = [];
  for (let i = 0; i < 24; i++) {
    const randomCategory = faker.random.arrayElement(categories);
    const randomPlace = faker.random.arrayElement(places);

    data.push({
      name: faker.name.firstName(),
      category: randomCategory._id,
      degree: "MBBS",
      place: randomPlace._id,
      day: [faker.random.arrayElement(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"])],
      time: `${faker.random.number({ min: 8, max: 12 })}:00 am to ${faker.random.number({ min: 1, max: 5 })}:00 pm`,
    });
  }

  try {
    return await db.collection("doctor").insertMany(data);
  } finally {
    console.log("Doctor seeding done.");
  }
}


async function seed() {

  console.log("Started seeding users...");
  await seedUsers()

  console.log("Started seeding service...");
  await seedService();

  console.log("Started seeding where...");
  await seedWhere();

  console.log("Started seeding category...");
  await seedCategory();

  console.log("Started seeding doctor...");
  await seedDoctor();

  process.exit(0);
}

seed();
