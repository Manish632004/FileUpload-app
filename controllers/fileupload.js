const File = require("../models/File");

// locafileUplaod >> handler functino 

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
        return res.status(500).json({ success:false, message:"file upload failed", error: err?.message || String(err)});
    }
}