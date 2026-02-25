import app from './app.ts';
import connectDB from './config/db.ts';
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

connectDB()
  .then( () => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    })
  })
  .catch( error => {
    console.error(error);
    process.exit(1);
  })
