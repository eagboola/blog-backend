import express from 'express';
import cors from 'cors';
import BlogRoutes from './routes/blogRoutes.ts';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());


// Mount Routes
app.use('/api/blogs', BlogRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Endpoint not found' });
})

export default app;