const File = require("../models/File");
const cloudinary = require("cloudinary").v2;

// locafileUplaod >> handler function

exports.localFileUpload = async (req,res)=>{
    try{
        // fetch file  from request

        const file = req.files.file;
        console.log("file aagyi jee",file);

        // create path where file need  to be stored on server
        let path = __dirname +"/files/" + Date.now() + +`.${file.name.split(".")[1]}` ;
        console.log("PATH ->",path)

        // add path to move function 
        file.mv(path ,(err)=>{
            console.log(err);
        });
        // create successful response
        res.json({
            success:true,
            message:"local file uploaded successfully",
            // path: uploadPath
        });
    }
    catch(err){
        return res.status(500).json({ 
            success:false, 
            message:"file upload failed", 
            // error: err?.message || String(err)
        }
        );
    }
}


function isFileTypeSupported(type,supportedTypes){
    return supportedTypes.includes(type)
}

// upload to cloudinary

async function uploadFileToCloudinary(file,folder,quality){
    const options = {folder};
    console.log("temp file path :",file.tempFilePath)
    options.resource_type="auto";
    if(quality){
        options.quality = quality;
    }

    return await cloudinary.uploader.upload(file.tempFilePath,options);
}

// image upload ka handler

exports.imageUpload =async(req,res)=>{
    try{
        // data fetch
        
        const {name,tags,email} = req.body;
        const file = req.files.imageFile;
        console.log(file);

        //validation
        
        const supportedTypes = ["jpg","jpeg","png"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log(fileType)
    

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"Unsupported file type"})
        }
        // upper limit of 5mb 
        const limit = 5*1024*1024;
        if(limit<file.size){
            return res.status(400).json({
                success:false,
                message:"image size is larger than 5mb"

            })
        }

        // file format supported
        console.log("uploading to cloudinary")

        const response = await uploadFileToCloudinary(file,"codehelp");
    
        console.log(response);


        //db me entry save karni hai 

        const  fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        })
        res.json({
            success:true,
            message:"Image uploaded successfully",
            imageUrl:response.secure_url
            // data:response
        })


        } 
    
    catch(err){
        console.error(err);
        return res.status(500).json({ 
            success:false, 
            message:"file upload failed", 
            // error: err?.message || String(err)
        });
    }
}

// video upload ka handler

exports.videoUpload = async (req,res)=>{
    try{
        
        //fetch data 
        const {name,tags,email} = req.body;
        console.log(name,tags,email);

        const file= req.files.videoFile ;
        console.log(file)

        //validation
        
        const supportedTypes = ["mp4","mov"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log("fileType",fileType)

        // todo : add a upper limit  of 5 mb for video 

        const limit = 5*1024*1024;
        if(limit<file.size){
            return res.status(400).json({
                success:false,
                message:"file size is larger than 5mb"
            })
        }
        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"Unsupported file type"})
        }

         // file format supported
        console.log("uploading to cloudinary")

        const response = await uploadFileToCloudinary(file,"codehelp");
        console.log(response);

        //db me entry save karni hai 

        const fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        })
        res.json({
            success:true,
            message:"video uploaded successfully",
            imageUrl:response.secure_url
            // data:response
        })


    }
    catch(error){
        console.log(error);
        res.status(400).json({
            success:false,
            message:"something went wrong while uploading video"
        })
    }
}

//image size reducer

exports.imageSizeReducer = async (req,res)=>{
    try{
        //fetch data 
        const {name,tags,email} =req.body;
        const file = req.files.imageFile;
        console.log(file);

        //validation
        
        const supportedTypes = ["jpg","jpeg","png","webp"];
        const fileType = file.name.split(".")[1].toLowerCase();
        console.log(fileType)

        if(!isFileTypeSupported(fileType,supportedTypes)){
            return res.status(400).json({
                success:false,
                message:"Unsupported file type"})
        }

        // file format supported
        console.log("uploading to cloudinary")

        const response = await uploadFileToCloudinary(file,"codehelp",90);
        console.log(response);

        //db me entry save karni hai 

        const  fileData = await File.create({
            name,
            tags,
            email,
            imageUrl:response.secure_url,
        })
        res.json({
            success:true,
            message:"Image resized uploaded successfully",
            imageUrl:response.secure_url
            // data:response
        })

    }
    catch(err){
        console.error(err);
        return res.status(500).json({ 
            success:false, 
            message:"file upload failed", 
            // error: err?.message || String(err)
        });
    }
}
