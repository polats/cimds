require('dotenv').config()

var cloudinary = require('cloudinary')
cloudinary.uploader.upload("public/images/test.glb",
 {resource_type: "raw"},
function(result) { console.log(result) })
