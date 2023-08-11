const vehicleModel = require('../models/vehicleModel');
const sharp = require('sharp');
const userModel = require('../models/user');

var path = require('path');


//to get the directory path
const imagePath = path.join(process.cwd(), '/public/images/')
console.log(imagePath);

//for adding a vehicle
const addVehicle = async (req, res) => {
    try {
        const numOnly = /^\d+$/;
        //cheking if vehicleCapecity is only accepts string or positive value
        if (!numOnly.test(parseInt(req.body.vehicleCapecity)) && parseInt(req.body.vehicleCapecity) < 0)
            return res.json({ success: false, message: 'Please enter vechiliecapacity in properway.' })

        //cheking if vehiclename is undefined or empty
        if (!numOnly.test(req.body.amount) || (parseInt(req.body.amount) < 0))
            return res.json({ success: false, message: 'Please enter amount in properway.' })

        //cheking user file selected or not
        if (!req.file) return res.json({ success: false, message: 'Please selet image' });

        //to check f user only enters png/jpg/jpeg
        if ((req.file.mimetype != "image/png") && (req.file.mimetype != "image/jpg") && (req.file.mimetype != 'image/jpeg'))
            return res.json({ success: false, message: 'Please enter valid file type.' });

        else {
            //uploading a file to destination in folder    
            await sharp(req.file.buffer)
                .resize({ width: 354, height: 228 }).png()
                //   To upload a file on specific folder and give path to req.originalfilename in which req.original file name comes from req.files
                .toFile(imagePath + `${req.file.originalname}`)

            //for indexing   
            var no = 0;

            //getting a length of total vehicle
            const totalVehicle = await vehicleModel.find();

            //to assigning no of showingindex
            no = totalVehicle.length + 1;
            parseInt(no);
            //creating a new model for saving a user
            let newDetails = new vehicleModel({
                vehicleName: req.body.vehicleName,
                isAc: req.body.isAc,
                vehicleCapecity: req.body.vehicleCapecity,
                vehicleType: req.body.vehicleType,
                isAvalable: req.body.isAvalable,
                vehicleImage: req.file.originalname,
                amount: req.body.amount,
                inclusion: parseInt(req.body.inclusion),
                exclusion: parseInt(req.body.exclusion),
                facilities: req.body.facilities,
                viewMore: req.body.viewMore,
                index: no,
                kmDay: req.body.kmDay
            });

            //saving a created new model
            await newDetails.save().then(() => {
                //giving a response
                res.json({ success: true, message: 'vehicle added successfully.' });

            }).catch((e) => {
                console.log(e);
                res.json({ success: false, message: e })
            });
        }
    } catch (error) {
        res.status(400).json({ sucess: false, message: error });
    }
}

//getting all vehicle
const getAllVehicle = async (req, res) => {
    //get all vecihle from vehicle model
    const resp = await vehicleModel.find();

    //checks wheather any vehicle is avilaable in db or not
    if (resp) {
        const page = parseInt(req.body.page) - 1 || 0;
        const limit = parseInt(req.body.limit) || 3;
        const search = req.body.search || "";

        // const sort=req.body.sort;
        const query = await vehicleModel.find({ vehicleName: { $regex: search, $options: "i" } })
            .sort({ vehicleCapecity: -1 })
            .skip(page * limit)
            .limit(limit);

        // to give a breafind about our search had howmany documents
        const totalDocumentIs = await vehicleModel.find({ vehicleName: { $regex: search, $options: "i" } })

        //creating our final response
        const fres = { docis: totalDocumentIs.length, page: page + 1, query }

        //sending response to the client/user side
        res.json({ success: true, data: fres });
    }
    else {
        //if admin had not any kind of vehicles
        res.json({ success: true, message: 'You have not any vehicles' });
    }
}

//updating a vehicle
const updateVehicle = async (req, res) => {

    try {
        const numOnly = /^\d+$/;
        //cheking if vehicleCapecity is only accepts string or positive value
        const id = req.params.id.slice(1);

        //checking if user enters the capecity biggerthan 0 
        if (!numOnly.test(parseInt(req.body.vehicleCapecity)) || parseInt(req.body.vehicleCapecity) < 0)
            return res.json({ success: false, message: 'Please enter vechiliecapacity in properway.' })

        //cheking if amount is valid or not
        if (!numOnly.test(req.body.amount) || (parseInt(req.body.amount) < 0)) { return res.json({ success: false, message: 'Please enter amount in properway.' }); }

        const oldNo = await vehicleModel.findById(id);

        //to get old index and give index of updating vechile(swaping of index)
        const updtNo = await vehicleModel.updateOne({ index: req.body.index }, { $set: { index: oldNo.index } }, { new: true });

        //swaping
        if (!updtNo) {
            await vehicleModel.findByIdAndUpdate(id, { $set: { index: oldNo.index } }, { new: true });
        }

        if (req.file) {
            console.log("first");
            if ((req.file.mimetype != "image/png") && (req.file.mimetype != "image/jpeg") && (req.file.mimetype != 'image/jpg'))
                return res.json({ msg: 'Please enter valid file type.' });
            else {
                //to upload a file in specific folder when user updates the vechicle with image
                await sharp(req.file.buffer).resize({ width: 354, height: 228 }).png().toFile(imagePath + `${req.file.originalname}`).then(() => {

                }).catch((e) => {
                    res.json({ success: false, message: e.message });
                })
                // Copy req.body in order not to change it
                const updateData = Object.assign({}, req.body);

                updateData.vehicleImage = req.file.originalname
                //updating the data


                await vehicleModel.updateOne({ _id: id }, { $set: updateData }, { new: true });

                res.json({ success: true, message: 'Your data has been successfully updated.' })
                return;

            }
        }

        //for assign a data object
        const updateData = Object.assign({}, req.body);

        //for deleting the object
        delete updateData.image

        console.log(updateData);
        //updating a vehicle
        await vehicleModel.updateOne({ _id: id }, { $set: updateData }, { new: true });

        res.json({ success: true, message: 'Your data hasbeen successfully updated.' });

    }
    catch (error) {
        res.status(400).json({ sucess: false, message: error });
    }
}

//for deleting the vechilie
const deleteVehicle = async (req, res) => {
    try {
        //removing collon from query parms
        const id = req.params.id.slice(1);

        if (id) {
            //cheks that vehicle is deleted find by id
            await vehicleModel.findByIdAndDelete(id);

            reOrder();//for calling a function to reordering all occurrenc of showing index 

            //afterwords of successfully reordering giving response
            res.json({ success: true, message: 'Your vehicle is deleted successfully.' });
        }
        //if given id is not found
        else {
            res.json({ success: false, message: 'Vehicle not found to be deleted!' })
        }
    }
    catch (error) {
        res.status(404).json({ success: false, message: 'error' })
    }
}

//for getting the data of all vehicle 
const getData = async (req, res) => {
    try {
        const data = await vehicleModel.find().sort({ index: -1 });
        res.json({ successs: true, data });
    }
    catch (error) {
        res.json({ success: false, message: error })
    }
}

//for reordering al documents showing index
async function reOrder() {

    //geting all documents after delteting the current document
    const remainingDocuments = await vehicleModel.find({}).sort({ index: 1 }).exec();
    console.log(remainingDocuments);
    // Update the "index" field for the remaining documents
    for (let i = 0; i < remainingDocuments.length; i++) {
        remainingDocuments[i].index = i + 1; // Set the new sequential index (i + 1)
        await remainingDocuments[i].save();
    }
}

//for api geting vehicle list
const getVehicleInfo = async (req, res) => {
    try {

        //getting all vehicle
        const allVehicle = await vehicleModel.find({}, { vehicleType: 0, isAvalable: 0, inclusion: 0, exclusion: 0, facilities: 0, viewMore: 0, createdAt: 0, updatedAt: 0, __v: 0 }).sort({ index: 1 });
        //getting info of user

        allVehicle.map(item => {
            item['vehicleImage'] = `${imagePath}${item.vehicleImage}`
        });

        console.log(allVehicle)
            const contactInfo = await userModel.find().select({ _id: 0, password: 0, createdAt: 0, updatedAt: 0, __v: 0, _id: 0, appEmail: 0 });
            const phoneinfo = contactInfo[0];

            const policy = 'http://192.168.0.128:6500/PrivacyPolicy';

            const terms = 'http://192.168.0.128:6500/termsAndConditions';
            res.json({ success: true, message: 'info', data: { allVehicle, phoneinfo, policy, terms } });
        }
    catch (e) {
            res.json({ success: false, message: e.message })
        }
    }


//for API vehicle list by id
const getVehicleInfoById = async (req, res) => {
        const id = req.body.id;
        const vehicleInfo = await vehicleModel.findById(id, { vehicleName: 1, isAc: 1, vehicleCapecity: 1, vehicleImage: 1, amount: 1, inclusion: 1, exclusion: 1, facilities: 1, viewMore: 1 });
      
        console.log(vehicleInfo);
      
            vehicleInfo['vehicleImage'] = `${imagePath}${vehicleInfo.vehicleImage}` 
      
        const contactInfo = await userModel.find().select({ _id: 0, password: 0, createdAt: 0, updatedAt: 0, __v: 0, _id: 0, appEmail: 0 });
        const phoneInfo = contactInfo[0];
        res.json({ success: true, message: 'vehicle info', data: { vehicleInfo, phoneInfo } });
    }

    //vehicle list by name
    const vehicleList = async (req, res) => {
        const vehicleNameList = await vehicleModel.find({}, { vehicleName: 1, _id: 0 });
        res.json({ success: true, message: 'vehicle List', vehicleNameList });
    }
    //exporting the modules
    module.exports = { vehicleList, addVehicle, getAllVehicle, updateVehicle, deleteVehicle, getData, getVehicleInfo, getVehicleInfoById }