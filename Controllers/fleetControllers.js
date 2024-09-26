const UserModel = require('../models/userModel');
const {getTotalVehicles} = require('../Functions/getTotalVehicles');
const xlsx = require('xlsx');
const PDFDocument = require('pdfkit');
const { Writable } = require('stream');
const functions = require('../Functions/fleetFunctions');
const RegisterVehicles = require('../models/registerVehiclesModel');


// GET CONTROLLERS.
const homeGetRequestController = (req, res) => {
    // making request for the total vehicles.
      getTotalVehicles(1,res);
    };

const allVehiclesGetRequestController = (req,res)=>{
    RegisterVehicles.find()
    .then((vehicles)=>{
  
    // send vehicles if they are greater than zero.
    if(vehicles.length > 0 ){
      res.render('allVehicles',{vehicleCount: true, vehicles});
    }else {
      res.render('allVehicles',{vehicleCount:false,vehicles})
    }
     
    })
    .catch((err)=>{
      console.log(err);
    })
  };    

  const IndividualVehicleGetRequestController = (req, res) => {
    const id = req.params.id;
    
    RegisterVehicles.findById(id)
        .then((result) => {
            if (!result) {
                res.json({ message: "Vehicle not found" });
            }
            res.json({message:result});
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send({ message: "Internal server error" });
        });
};



const ExcelGetRequestController = async (req,res)=>{

  try {
    const vehicles = await RegisterVehicles.find(); // Fetch data from your database
    // Map the data to exclude unwanted fields
    const dataToExport = vehicles.map(vehicle => ({
        // id: vehicle._id,           // Include the ID
        ownerName: vehicle.ownerName,       
        vehicleBrand: vehicle.vehicleBrand,     
        registrationNumber: vehicle.registrationNumber,
        color: vehicle.color,
        vehicleType: vehicle.vehicleType,
        vehicleModel: vehicle.vehicleModel,
        manufactureYear: vehicle.manufactureYear

    }));

    // Create a new workbook and add a worksheet
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(dataToExport);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Vehicles');

    // Generate buffer and send it as an Excel file
    const buffer = xlsx.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    res.setHeader('Content-Disposition', 'attachment; filename=vehicles.xlsx');
    res.setHeader('Content-Type', 'application/octet-stream');
    res.send(buffer);
} catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).send('Error exporting data');
}}





const PdfGetRequestController = async (req, res) => {
  try {
    const vehicles = await RegisterVehicles.find(); // Fetch data from your database

    // Create a PDF document
    const doc = new PDFDocument({ margin: 30 });
    res.setHeader('Content-Disposition', 'attachment; filename=vehicles.pdf');
    res.setHeader('Content-Type', 'application/pdf');

    // Pipe the PDF to the response
    doc.pipe(res);

    // Add a title
    doc.fontSize(18).text('Vehicle Data', { align: 'center' });
    doc.moveDown(1.5);

    // Add a table header with column titles (without ID)
    const tableTop = 100;
    const columnPadding = 15;

    // Draw table headers (adjusted without ID)
    doc.fontSize(12).text('Owner Name', 30, tableTop);
    doc.text('Vehicle Brand', 130, tableTop);
    doc.text('Reg Number', 230, tableTop);
    doc.text('Color', 330, tableTop);
    doc.text('Type', 400, tableTop);
    doc.text('Model', 470, tableTop);
    doc.text('Year', 540, tableTop);

    // Add a horizontal line under the headers
    doc.moveTo(30, tableTop + 15).lineTo(580, tableTop + 15).stroke();

    // Define the starting point for vehicle data
    let y = tableTop + 25;

    // Add vehicle data in rows (without ID)
    vehicles.forEach((vehicle) => {
      if (y > 700) {
        doc.addPage();
        y = 50; // Reset y position for new page
      }

      doc.fontSize(10).text(vehicle.ownerName || 'N/A', 30, y);
      doc.text(vehicle.vehicleBrand || 'N/A', 130, y);
      doc.text(vehicle.registrationNumber || 'N/A', 230, y);
      doc.text(vehicle.color || 'N/A', 330, y);
      doc.text(vehicle.vehicleType || 'N/A', 400, y);
      doc.text(vehicle.vehicleModel || 'N/A', 470, y);
      doc.text(vehicle.manufactureYear || 'N/A', 540, y);

      // Move to the next row (adjust y position)
      y += 20;
    });

    // Finalize the PDF and end the stream
    doc.end();
  } catch (error) {
    console.error('Error exporting PDF:', error);
    res.status(500).send('Error exporting PDF');
  }
};


const GetRequestLoginController = (req,res)=>{
  error = false;
  res.render('login', { title: 'Login', error ,  styleName: 'LoginStyles.css'});
}


const GetRequestSignUpController = (req,res)=>{
  res.render('login', { title: 'Sign Up', error: false, styleName: 'SignUpStyles.css'});  
}



const GetRequestResetPasswordController = (req,res)=>{
res.render('resetPassword');
}

// logout function to clear the cookies and redirect the user.

const GetRequestLogoutController = (req,res)=>{
  res.clearCookie('authorized');
  res.redirect('/login');
}




const GetRequestCreatePasswordController = async (req, res) => {
  const { id, token } = req.params;
  var value = req.cookies.token;

  try {
      const result = await UserModel.findOne({ _id: id });

      if (result && token.length == 10 && token == value) {
          res.render('createNewPassword');
      } else {
          res.redirect('/resetPassword');
      }
  } catch (err) {
      res.redirect('/resetPassword');
  }
}





// POST CONTROLLERS
  const homePostRequestController = (req,res)=>{

    const registerVehicle = new RegisterVehicles(req.body);
    
     // saving to the database.
     registerVehicle.save()
     .then((result)=>{
      getTotalVehicles(2,res);
    
     })
     .catch((err)=>{
       console.log(err);
       res.status(500).send('Error registering vehicle.');
     })
    
    };

 const ImportExcelPostRequestController = (req,res)=>{



  const registerVehicle = new RegisterVehicles(req.body);
    
     // saving to the database.
     registerVehicle.save()
     .then((result)=>{
       res.json({redirect:'/allVehicles'});
    
     })
     .catch((err)=>{
       console.log(err);
       res.status(500).send('Error registering vehicle.');
     })



 }


    // To handle the login and signup data 
const  LoginPostRequestController = async (req,res)=>{
    

  if (req.body.pageType == 'Sign Up') {

    let values = req.body;

          const userModel = new UserModel(req.body);
          
        let signUpError =   await functions.checkPasswordAndEmail(userModel, UserModel, res, req, values);
      
        if(signUpError == false){
          res.json({});
        } else {
          res.json({signUpError});
          console.log("This is the signUpError ",signUpError);
        }
      

      
        } else {
         
        // login check.
        let loginError =   await functions.checkLoginDetails(UserModel, req.body, res, req);
 
          if(loginError == false){
            res.json({});
          } else {
            res.json({loginError});
          }
        
      }
}





const ResetPasswordPostRequestController = async(req,res)=>{

  const userEmail = req.body.email;
  const result = await UserModel.findOne({ email: userEmail });

  if (result) {
      const id = result.id;
      const token = functions.generateToken(res);
      functions.sendEmail(userEmail, id, token);
      res.redirect('/login');
  } else {
      res.redirect('/login');
  }




}


const CreatePasswordPostRequestsController = async(req,res)=>{
  const email = req.body.email;
  const newPassword = req.body.password;
  const user = await UserModel.findOne({ email });

  if (user) {

      
      const result = await UserModel.findOneAndUpdate(
          { email },
          { Password: newPassword },
          { new: true },
      );

      const result2 = await UserModel.findOneAndUpdate(
          { email },
          { confirmPassword: newPassword },
          { new: true },
      );

       console.log("These are the result",result, result2)
      if (result && result2) {

          // console.log("This is the user I'm looking for ",result);
          res.redirect('/login');
      } else {
         const currentUrl = window.location.href;
        res.redirect(`/${currentUrl}`);
      }
  }else {
    const currentUrl = window.location.href;
    res.redirect(`/${currentUrl}`);
  }

}





// DELETE CONTROLLERS
    const deleteVehicleController = (req,res)=>{
        const id = req.params.id;
         RegisterVehicles.findByIdAndDelete(id)
         .then(result=>{
          // After sending the response, we redirect to the details page.
          res.json({redirect:'/allVehicles'});
         })
         .catch(err=>console.log(err));
        
        };


// UPDATE / PUT  CONTROLLERS
const homePutRequestController = async (req,res)=> {
//  update the database with the updated values.
const id  =  req.body.id; // extracting the Id first.

const updatedData = {
  ownerName: req.body.ownerName,
  vehicleBrand: req.body.vehicleBrand,
  registrationNumber: req.body.registrationNumber,
  color: req.body.color,
  vehicleType: req.body.vehicleType,
  vehicleModel: req.body.vehicleModel,
  manufactureYear: req.body.manufactureYear,
};

  const updatedVehicle = await RegisterVehicles.findByIdAndUpdate(id, updatedData, { new: true })
 
  if (!updatedVehicle) {
  return res.status(404).json({ message: 'Vehicle not found' });
}
  // Send a success response with the updated vehicle
res.status(200).json({ redirect:'/allVehicles' });


};




module.exports = {
    homeGetRequestController,
    allVehiclesGetRequestController,
    GetRequestLoginController,
    GetRequestSignUpController,
    GetRequestResetPasswordController,
    GetRequestCreatePasswordController,
    // chartGetRequestController,
    GetRequestLogoutController,
    homePostRequestController,
    LoginPostRequestController,
    ResetPasswordPostRequestController,
    CreatePasswordPostRequestsController,
    ImportExcelPostRequestController,
    deleteVehicleController,
    ExcelGetRequestController,
    IndividualVehicleGetRequestController,
    homePutRequestController,
    PdfGetRequestController,
}
