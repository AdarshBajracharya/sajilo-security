const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./database/database');
const cors = require('cors')
const fileUpload = require('express-fileupload')
const morgan = require('morgan');
const { default: rateLimit } = require('express-rate-limit');
const { default: helmet } = require('helmet');
const session = require('express-session');
const path = require('path')
const fs = require('fs')
const https = require('https')

const sslKey = fs.readFileSync(path.resolve(__dirname, '..', 'certs', 'localhost.key'));
const sslCert = fs.readFileSync(path.resolve(__dirname, '..', 'certs', 'localhost.crt'));

const app = express();

app.use(express.json())

app.use(fileUpload())

app.use(express.static('./public'))

const auditLogDir = path.join(__dirname, 'audit');
if (!fs.existsSync(auditLogDir)) {
  fs.mkdirSync(auditLogDir);
}

const logStream = fs.createWriteStream(path.join(auditLogDir, 'access.log'), { flags: 'a' });

morgan.token('timestamp', () => new Date().toISOString());

const logFormat = '[:timestamp] :method :url :status :response-time ms';

app.use(morgan(logFormat, { stream: logStream }));


const corsOptions = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200

}
app.use(cors(corsOptions))


dotenv.config()

connectDB();


app.use(session({
  secret: process.env['SESSION_SECRET'],
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 20 * 60 * 1000,
    httpOnly: true,
    secure: true,
  }
}));

app.use((req, res, next) => {
  if (req.session) {
    req.session._garbage = Date.now();
    req.session.touch();
  }
  next();
});

const PORT = process.env.PORT;


app.use('/api/user', require('./routes/userRoutes'))
app.use('/api/product', require('./routes/productRoutes'))
app.use('/api/cart', require('./routes/cartRoutes'))
app.use('/api/order', require('./routes/orderRoutes'))
app.use('/api/payment', require('./routes/khalti'))
app.use("/api/activity-log", require('./routes/activityroutes'));

https.createServer(
  {
    key: sslKey,
    cert: sslCert,
  },
  app
).listen(PORT, () => {
  console.log(`✅ HTTPS server running at https://localhost:${PORT}`);
});

module.exports = app;