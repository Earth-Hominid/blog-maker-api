const express = require('express');
const path = require('path');
const colors = require('colors');
const dotenv = require('dotenv').config();
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDatabase = require('./config/db');
const port = process.env.PORT || 8001;

connectDatabase();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Serve frontend routes
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build/static')));

  app.get('*', (req, res) =>
    res.sendFile('index.html', {
      root: path.join(__dirname, '../../client/build/'),
    })
  );
} else {
  app.get('/', (req, res) => res.send('Set to production'));
}

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
