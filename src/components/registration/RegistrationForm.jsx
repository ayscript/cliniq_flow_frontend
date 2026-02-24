import React, { useState, useEffect } from "react";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";

const RegistrationForm = () => {
  const [step, setStep] = useState(1);
  // required field in the form
  const [formData, setFormData] = useState({
    // Step 1: Bio Data
    lastName: "",
    firstName: "",
    otherNames: "",
    pid: `PID-${Math.floor(1000 + Math.random() * 9000)}`, // Auto-generated for now
    passport: null,
    tribe: "",
    religion: "",
    gender: "",
    dob: "",
    age: "",
    nationality: "Nigerian",
    civilStatus: "",
    // Step 2 Contact & Location
    phone: "",
    altPhone: "",
    email: "",
    address: "",
    state: "",
    lga: "",
    // Step 3: Statutory & Socio-Economic
    nin: "",
    nhisNumber: "",
    militaryNumber: "",
    education: "",
    regDate: new Date().toISOString().split("T")[0], // Auto-filled with current date
    regBy: "Faith Peace", // This would ideally come from the logged-in user context

    // Step 4:
    nokName: "",
    nokPhone: "",
    nokRelationship: "",
    nokAddress: "",
    doctorInCharge: "",
  });

  // Handle input changes for all steps
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // To calculate age from DOB
  useEffect(() => {
    if (formData.dob) {
      const birthDate = new Date(formData.dob);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      setFormData((prev) => ({ ...prev, age: age > 0 ? age : 0 }));
    }
  }, [formData.dob]);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Final Form Data:", formData);

    alert(
      `patient ${formData.firstName} ${formData.lastName} registered successfully!`,
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Progress Bar */}
      <div className="bg-gray-50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Step {step} of 4</h2>
          <p className="text-sm text-gray-500">
            {step === 1 && "Primary identity and Bio-data"}
            {step === 2 && "Contact & Location"}
            {step === 3 && "Statutory & Socio-Economic"}
            {step === 4 && "Next of Kin & Doctor In-Charge"}
          </p>
        </div>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((num) => (
            <div
              key={num}
              className={`h-2 w-12 rounded-full transition-all ${step >= num ? "bg-blue-600" : "bg-gray-200"}`}
            ></div>
          ))}
        </div>
      </div>

      <div className="p-8">
        {/* Render Steps */}
        {step === 1 && (
          <StepOne formData={formData} handleChange={handleChange} />
        )}
        {step === 2 && (
          <StepTwo formData={formData} handleChange={handleChange} />
        )}
        {step === 3 && (
          <StepThree formData={formData} handleChange={handleChange} />
        )}
        {step === 4 && (
          <StepFour formData={formData} handleChange={handleChange} />
        )}

        {/* Navigation */}
        <div className="mt-10 flex justify-between items-center border-t border-gray-300 pt-6">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className={`px-6 py-2 bg-gray-200 rounded-lg font-medium transition-all ${step === 1 ? "text-gray-300 cursor-not-allowed" : "text-gray-600 hover:bg-gray-300"}`}
          >
            Previous
          </button>

          {step === 4 ? (
            <button
              onClick={handleSubmit}
              className="bg-green-600 text-white px-10 py-2 rounded-lg font-bold hover:bg-green-700 shadow-lg shadow-green-200 transition-all flex items-center gap-2"
            >
              Finish and Register
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="bg-blue-600 text-white px-10 py-2 rounded-lg font-bold hover:bg-blue-700 shadow-blue-200 transition-all"
            >
              Next Step
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;
