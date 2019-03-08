require('dotenv').config()

var cloudinary = require('cloudinary')
cloudinary.uploader.upload("public/images/Bard_Armor.png",
function(result) { console.log(result) })
