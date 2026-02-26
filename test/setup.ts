// Runs before every test file is executed.

// Use a "dummy" connection instead of connecting to MongoDB Atlas.
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";  
import { beforeAll, afterAll, beforeEach } from "vitest";   // To define additional setup and teardown.

// Declare, but initialize specifically for each setup/teardown case.
let dummyMongoDb: MongoMemoryServer;

// Setup before all tests:
//  - initialize dummy MongoDB 
//  - connect dummy DB to mongoose
beforeAll(async () => {
  dummyMongoDb = await MongoMemoryServer.create();
  await mongoose.connect(dummyMongoDb.getUri());
});

// After all tests run:
//  - kill mongoose::dummy Mongo connection
//  - kill dummy Mongo DB
afterAll(async () => {
  await mongoose.disconnect();
  await dummyMongoDb.stop();
});

// Setup before each test is run:
//  - kill all existing connections so current test has clean slate
beforeEach(async () => {
  for (const key in mongoose.connection.collections) {
    await mongoose.connection.collections[key]?.deleteMany({});
  }
});