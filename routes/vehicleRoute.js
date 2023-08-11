const { getAllVehicle, deleteVehicle, updateVehicle, addVehicle, getVehicleInfo, getVehicleInfoById, vehicleList } = require('../controllers/vehicleController');

const vehicleRouter = require('express').Router();

const multer = require('multer');
const { isLogin } = require('../middlewares/authandtoken');

//uploading a files
const upload = multer({
    limits: {
        fileSize: 1000000000
    },
    fileFilter(req, file, cb) {
        cb(undefined, true)
    }
});

//adding a vehicle
vehicleRouter.post('/addvehicle', isLogin, upload.single('image'), addVehicle);

//updating a vehicle
vehicleRouter.patch('/updatevehicle/:id', isLogin, upload.single('image'), updateVehicle);

//delete a vehicle
vehicleRouter.delete('/deletevehicle/:id', isLogin, deleteVehicle);

//getting all the vehicles
vehicleRouter.post('/getallvehicle', isLogin, getAllVehicle);

//vehicle API
vehicleRouter.get('/getvehicleinfo', getVehicleInfo);

//vehicle by id API
vehicleRouter.post('/getvehicleinfo', getVehicleInfoById);

//vehicle List
vehicleRouter.get('/getvehiclelist', vehicleList);

//vehicle router to be exported
module.exports = vehicleRouter;