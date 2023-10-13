import express from "express";
import { createPatient,viewPrescription,addFamMem ,selectPres,filterDoctors,filterthepresc} from "../controllers/patientController.js";
import { body, validationResult } from "express-validator";

const router = express.Router();

// post request to create a patient
router.post("/registeration", createPatient);
router.post("/addFamMem/:userId",addFamMem);
router.get("/viewPrescriptions/:id",viewPrescription);
router.get("/bobota5ta5/:id",filterthepresc);
router.get("/selectedPrescription/:patientid/:id",selectPres);
router.get("/filterDoctors",filterDoctors);





export default router;
