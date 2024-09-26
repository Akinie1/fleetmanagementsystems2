const express = require("express"); // requiring the express package
const path = require('path');
const app = express(); // creating an object from express package
const mongoose  = require('mongoose');
const fleetControllers = require('./Controllers/fleetControllers');
const RegisterVehicles = require('./models/registerVehiclesModel');
const {requireAuth} = require('./Middleware/authController');
const cookieParser = require('cookie-parser')
const serverless = require('serverless-http');
// connect to mongodb
const dbURI = 'mongodb+srv://samuel:test1234@cluster0.ghsyetl.mongodb.net/node-tuts';
mongoose.connect(dbURI,{useNewUrlParser:true})
 .then((result)=> 
    // listen for requests
app.listen(3000))
 .catch((err)=> console.log(err));

// register view engine
app.set('view engine','ejs');
// parses the data to an object on the request body
app.use(express.urlencoded({ extended: true }));
// This is a middleware to serve static files like CSS, JS, Images)
app.use(express.static('public')); 
// Serve static files from the views directory
app.use('/views', express.static(path.join(__dirname, 'views')));
// Middleware to parse JSON request bodies
app.use(express.json());
// Middleware to ignore favicon.ico requests
app.get('/favicon.ico', (req, res) => res.status(204));
app.use(cookieParser());

// GET ROUTES
// app.get('/chart',requireAuth,fleetControllers.chartGetRequestController);
app.get('/', requireAuth,fleetControllers.homeGetRequestController);
app.get('/allvehicles',requireAuth,fleetControllers.allVehiclesGetRequestController)
// pdf
app.get('/pdf', requireAuth,fleetControllers.PdfGetRequestController);
// excel
app.get('/exports',requireAuth,fleetControllers.ExcelGetRequestController)
app.get('/login',fleetControllers.GetRequestLoginController);
app.get('/signup',fleetControllers.GetRequestSignUpController);
app.get('/resetPassword',fleetControllers.GetRequestResetPasswordController);
app.get('/logout',fleetControllers.GetRequestLogoutController);
app.get('/createPassword/:id/:token',fleetControllers.GetRequestCreatePasswordController)

// // MIDDLEWARE 404 PAGE
// app.use((req,res)=>{
//   res.status(404).render('404',{title:'404 Not Found',styleName:'404.css'});

// })
app.get('/:id',fleetControllers.IndividualVehicleGetRequestController)

// POST ROUTES
app.post('/',fleetControllers.homePostRequestController);
app.post('/importExcel',fleetControllers.ImportExcelPostRequestController)
app.post('/login',fleetControllers.LoginPostRequestController);
app.post('/resetPassword',fleetControllers.ResetPasswordPostRequestController);
app.post('/createPassword', fleetControllers.CreatePasswordPostRequestsController);

// DELETE ROUTES
app.delete('/delete/:id',fleetControllers.deleteVehicleController);


// UPDATE ROUTES
app.put('/',fleetControllers.homePutRequestController);

// TEST ROUTES
app.get('/test',(req,res)=>{
  res.render('update-modal');
})



