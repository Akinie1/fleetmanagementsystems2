const RegisterVehicles = require('../models/registerVehiclesModel');
const getTotalVehicles = async (successMessageNumber,res)=>{
const totalVehicles = await RegisterVehicles.countDocuments({});


RegisterVehicles.find()
.then((vehicles)=>{

// send vehicles if they are greater than zero.
if(vehicles.length > 0 ){
 
  let brands = [];

  // Push each brand into the array
  vehicles.forEach((vehicle) => {
      brands.push(vehicle['vehicleBrand']);
  });
  
  // Count occurrences of each brand
  const brandCounts = {};
  
  brands.forEach((brand) => {
      if (brandCounts[brand]) {
          brandCounts[brand] += 1; // Increment count if brand already exists
      } else {
          brandCounts[brand] = 1; // Initialize count if brand is new
      }
  });
  
  // Convert the counts object to an array if needed for sending
  const countedBrands = Object.keys(brandCounts).map((brand) => ({
      brand: brand,
      count: brandCounts[brand],
  }));



    console.log(countedBrands);


    res.render('home', {
      title: 'Home',
      styleName: 'home.css',
      successMessage: successMessageNumber,
      totalVehicles: totalVehicles,
      countedBrands, // Passing total count to the home page
  });
}
})
.catch((err)=>{
  console.log(err);
})


}


module.exports = {
    getTotalVehicles
}