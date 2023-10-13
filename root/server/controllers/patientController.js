import Patient from "../models/Patient.js";
import Prescription from "../models/Prescription.js";
import Doctor from "../models/Doctor.js";

// create (register) a patient

const createPatient = async (req, res) => {
  try {
    const patient = await Patient.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        patient,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};


// Patient adds a family member using certain attributes req #14
const addFamMem = async (req, res) => {
  console.log("INNNNNN");
  const userId = req.params.userId;
  console.log("HERE IS THE USER ID " + userId);

  const {
    fName,
    lName,
    nationalID,
    gender,
    dateOfBirth,
    relationship,
  } = req.body;

  const validRelationships = ["wife", "husband", "son", "daughter"];

  try {
    const patient = await Patient.findById(userId);
    

    if (!patient) {
      return res.status(404).json({
        status: 'fail',
        message: 'Patient not found',
      });
    }

    //Check if the relationship is valid (wife, husband, or children)
    console.log(fName);
    
    console.log(relationship);
    if (!validRelationships.includes(relationship)) {
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid relationship. Allowed values are wife, husband, son, or daughter.',
      });
    }
  
    console.log(nationalID);
    

    console.log(fName);
    // Add the new family member to the patient's familyMembers array
    const newFamilyMember = {
      fName: fName,
      lName: lName,
      nationalID: nationalID,
      gender: gender,
      dateOfBirth: dateOfBirth,
      relationship: relationship,
    };

 

    console.log("FNAME " + fName);

    patient.familyMembers.push(newFamilyMember);
    await patient.save();
   res.json({newFamilyMember : newFamilyMember});
   
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};


// Patient can view list of all prescriptions req #54
const viewPrescription = async (req, res) => {
  const patientId = req.params.id;

  try {
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({
        status: 'fail',
        message: 'Patient not found',
      });
    }

    const prescriptions = await Prescription.find({
      patient: patientId
    });

    res.render("viewPrescriptions", {userId: patientId, prescriptions: prescriptions})
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};


// Filter Prescriptions based on date or doctor or filled or unfilled req #55
const filterthepresc = async (req, res) => {
  const patientId = req.params.id;
  try {

    const filter = {};

    if (req.query.doctor) {
      filter.doctor = req.query.doctor;
    }

    if (req.query.date) {
      var min_date = new Date(req.query.date);
      var max_date = new Date(req.query.date);
      min_date.setHours(0, 0, 0, 0);
      max_date.setHours(23, 59, 59, 999);
      filter.date = {
        $gte: min_date,
        $lt: max_date,
      };
    }
    if (req.query.isFilled) {
      filter.isFilled = req.query.isFilled;
    }

    if (req.params.id) {
      filter.patient = req.params.id;
    }

    const patient = await Patient.findById(patientId);
    console.log("IS " + req.body.date + req.body.doctor + req.body.isFilled + patientId);
    const prescriptions = await Prescription.find(filter);

    //res.json(prescriptions);
    
    res.render("viewPrescriptions", {
      userId: patientId,
      prescriptions: prescriptions
    });
   } 
  catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};
 


// Patient can select a prescription from his/her list of prescriptions req #56
const selectPres = async (req, res) => {
  //const prescriptionId = req.params.id;
  const patientID = req.params.patientid;
  const prescriptionId = req.params.id;

  try {
    const prescription = await Prescription.findById(prescriptionId).where({patient : patientID});
    

    if (!prescription) {
      return res.status(404).json({
        status: 'fail',
        message: 'Prescription not found',
      });
    }

    res.json(prescription);
    res.render("selectedPrescription", {userId: patientID, prescription: prescription})
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
};


//mariams
const filterDoctors = async (req, res) => {
  try {

    const {
      specialty,
      date,
      time
    } = req.body;

    // Construct the filter based on the provided query parameters
    const filter = {};

    if (specialty) filter.specialty = specialty;

    if (date) filter.date = date;

    if (time) filter.time = time;

    // Retrieve all doctors from the database

    const doctor = await Doctor.find(filter);
    console.log(filter.specialty + filter.date + filter.time);

    // Send the list of doctors as a JSON response
    res.status(200).json({
      status: 'success',
      data: {
        doctor: doctor,
      },
    });
  } catch (err) {
    // Handle errors, for example, database connection issues
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
}
export {
  createPatient,
  addFamMem,
  viewPrescription,
  filterthepresc,
  selectPres,
  filterDoctors,
};