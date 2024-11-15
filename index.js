const express = require('express');
const app = express();
const PORT = process.env.DB_HOST || 3000;
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/auth.routes');

app.use(
	cors({
		origin: process.env.CLIENT_DOMAIN || `localhost:${process.env.CLIENT_HOST || 5173}`,
		credentials: true,
	}),
);
app.use(express.json());

app.use(cookieParser());

app.use('/api', authRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
