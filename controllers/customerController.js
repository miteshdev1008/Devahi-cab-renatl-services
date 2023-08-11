const cutomerModel = require('../models/customer')
const userModel = require('../models/user')


const PDFDocument = require("pdfkit-table");
//creating a customer enquiry
const createCustomer = async (req, res) => {
    try {
        const pickupAddress = req.body.pickupAddress;
        console.log(pickupAddress);
        //checking value of pickupaddresss for null 
        if (pickupAddress.length == 0) {
            res.json({ success: false, message: 'Enter pickup address.' });
            return;
        }
        //getting value of dropAddress
        const dropAddress = req.body.dropAddress;
        //checking value of pickupaddresss for null 
        if (dropAddress.length == 0) {
            res.json({ success: false, message: 'Enter drop address.' });
            return;
        }
        const startDate = req.body.startDate;
        //checking value of startDate for null
        if (startDate.length == 0) {
            res.json({ success: false, message: 'Enter startdate.' });
            return;
        }

        //getting value of endDate
        const endDate = req.body.endDate;
        //checking value of endDate for null
        if (endDate.length == 0) {
            res.json({ success: false, message: 'Enter enddate.' });
            return;
        }

        var date1 = new Date(startDate);
        var date2 = new Date(endDate);
        //cheking both date that which is bigger
        if (date1 > date2) {
            res.json({ success: false, message: 'Select end date bigger than start date or same as start date.' });
            return;
        }

        //getting value of passanger
        const pasangerNo = req.body.pasangerNo;
        //checking value of passanger for null
        if (pasangerNo.length == 0) {
            res.json({ success: false, message: 'Enter pasanger details.' });
            return;
        }
        console.log(isNaN(pasangerNo))
        if (isNaN(pasangerNo)) {
            res.json({ success: false, message: 'Enter pasangerNo details only in digits.' });
            return;
        }
        //checking if uer enters floating point value 

        if (pasangerNo.includes('.') || pasangerNo.includes('e')) {
            res.json({ success: false, message: 'Enter pasanger details only in digits.' });
            return;
        }

        //checking value of passanger for enter value in positive
        if (parseInt(pasangerNo) <= 0) {
            res.json({ success: false, message: 'Enter pessanger greater than 0.' })
            return;
        }

        //getting value of email
        var email = req.body.email;
        //checking value of email for null
        if (email.length == 0) {
            email = '';
        }

        //if user enters email then cheking proper email is enters
        else {
            const isemail = /^\S+@\S+\.\S+$/;
            //cheking user's email
            if (!isemail.test(email)) {
                res.json({ success: false, message: 'Enter valid email.' });
                return;
            }
        }
        console.log(email)
        //getting value of phoneno
        const phoneNo = req.body.phoneNo;
        //checking value of phoneNo for null
        if (phoneNo.length == 0) {
            res.json({ success: false, message: 'Enter phone no.' });
            return;
        }
        console.log(phoneNo)
        //regex for 10 digits only
        var phn = /^\d{10}$/
        //cheking user enter only 10 digit value
        if (!phn.test(phoneNo)) {
            res.json({ success: false, message: 'Enter phone no in 10 digits.' });
            return;
        }
        //getting value of message
        const message = req.body.message;

        //getting value of selected cars
        var selectedcar = req.body.selectedcar;
        console.log("first")
        var inp = { pickupAddress, dropAddress, startDate, endDate, pasangerNo, email, phoneNo, message, selectedcar }
        const contactInfo = await userModel.find().select({ wp_message: 0, _id: 0, password: 0, createdAt: 0, updatedAt: 0, __v: 0, _id: 0, username: 0, appEmail: 0 });

        var wp_mesage = `your enquiry created \n ${pickupAddress} \n ${dropAddress} \n ${startDate} \n ${endDate} \n ${email} \n ${phoneNo} \n ${message} \n ${selectedcar} `;
        //creating and saving new enquiry
        var wp_mobile = contactInfo[0]['mobile'];
        const enq = await new cutomerModel(inp).save();
        console.log(enq)
        //giving response
        res.status(200).json({ success: true, message: 'Enquiry created successfully', wp_mesage, wp_mobile });
    } catch (error) {
        res.status(304).json({ success: false, message: error });
    }
}

//getallEnquiries
const getAllEnquiries = async (req, res) => {
    try {
        //fetching all data if queries
        const allEnquiries = await cutomerModel.find().sort({ createdAt: -1 });
        res.json({ success: true, data: allEnquiries });
    } catch (error) {
        res.status(304).json({ success: false, message: error });
    }

}

//to delete a inquiries
const deleteEnquiries = async (req, res) => {
    //deleting the particular inquiry by its ID
    const id = req.params.id.slice(1);

    //deleting the particular inquiry by its ID
    const deleteEnq = await cutomerModel.findByIdAndDelete(id).then(() => {
        res.json({ success: true, message: 'User Enquirey deleted successfully.' });
    }).catch((e) => {
        res.json({ success: false, message: e })
    });
}

//updating paymnt status
const updatePaymentStatus = async (req, res) => {
    try {
        const id = req.params.id.slice(1);
        console.log(req.body);
        await cutomerModel.findByIdAndUpdate(id, { $set: { paymentDone: req.body.status } }, { new: true });
        res.json({ success: true, message: 'payment status-updated successfully' });
    }
    catch (e) {
        res.json({ success: false, message: e });
    }
}

//gettingall paid enquiry of last 30 days
const paidEnquiry = async (req, res) => {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const alldata = await cutomerModel.find({
        $and: [
            { paymentDone: { $gt: 0 } }, // Payment done greater than 0
            { createdAt: { $gte: thirtyDaysAgo } }, // Created within the last 30 days
        ],
    });
    res.json({ success: true, data: alldata });
}

//for downloading a pdf
const downloadPdf = async (req, res) => {
    console.log("first")
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const documents = await cutomerModel.find({
        $and: [
            { paymentDone: { $gt: 0 } }, // Payment done greater than 0
            { createdAt: { $gte: thirtyDaysAgo } }, // Created within the last 30 days
        ],
    }).lean();

    // Generate the PDF
    const pdfBuffer = await generatePDF(documents);

    res.setHeader('Content-Type', 'application/pdf');

    res.setHeader('Content-Disposition', 'attachment; filename=Last 30 days paid enquiry details-.pdf');

    // Send the PDF as a response
    res.send(pdfBuffer);
    console.log("first")
}

// for generating a pdf
function generatePDF(documents) {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const chunks = [];

        console.log("first")

        // Push chunks to the array
        doc.on('data', (chunk) => {
            chunks.push(chunk);
        });

        // Resolve the promise when PDF generation is complete
        doc.on('end', () => {
            const pdfBuffer = Buffer.concat(chunks);
            resolve(pdfBuffer);
        });

        // Handle errors during PDF generation
        doc.on('error', (err) => {
            reject(err);
        });

        const tableJson = {
            "headers": [

                { "label": "Pickup", "property": "pickupAddress", "width": 50 },
                { "label": "Drop", "property": "dropAddress", "width": 50 },
                { "label": "startDate", "property": "startDate", "width": 50 },
                { "label": "endDate", "property": "endDate", "width": 50 },
                { "label": "email", "property": "email", "width": 50 },
                { "label": "phoneNo", "property": "phoneNo", "width": 50 },
                { "label": "message", "property": "message", "width": 50 },
                { "label": "selectedcar", "property": "selectedcar", "width": 50 },
                { "label": "Amount", "property": "paymentDone", "width": 50 },
            ],
            "datas": documents,
            // "rows": [
            //   [ "Name 4", "Age 4", "Year 4" ]
            // ],
            "options": {
                "width": 0
            }
        };

        doc.table(tableJson);

        // Finalize the PDF and close the stream
        doc.end();

    });
}




module.exports = { paidEnquiry, updatePaymentStatus, createCustomer, getAllEnquiries, deleteEnquiries, downloadPdf }