import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';
import { TriangleAlert, User } from 'lucide-react';

const StepFour = ({ formData, handleChange }) => {
  const relationships = [{ value: 'Parent', label: 'Parent' }, { value: 'Sibling', label: 'Sibling' }, { value: 'Spouse', label: 'Spouse' }, { value: 'Child', label: 'Child' }, { value: 'Friend', label: 'Friend' }, { value: 'Other', label: 'Other' }];
  
  // Mock list of doctors - In the future, this will be fetched from the DB
  const doctors = [
    { value: 'Dr. Olumide (General Practitioner)', label: 'Dr. Olumide (General Practitioner)' },
    { value: 'Dr. Chen (Pediatrics)', label: 'Dr. Chen (Pediatrics)' },
    { value: 'Dr. Ibrahim (Internal Medicine)', label: 'Dr. Ibrahim (Internal Medicine)' },
    { value: 'Dr. Sarah (Emergency)', label: 'Dr. Sarah (Emergency)' }
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Next of Kin Section */}
      <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100">
        <div className="flex items-center gap-2 mb-6 text-orange-700">
          <span className="text-xl"><TriangleAlert size={20} /></span>
          <h3 className="text-lg font-bold">Next of Kin (Emergency Contact)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input 
            label="Full Name" 
            name="nokName" 
            placeholder="Next of Kin's full name"
            value={formData.nokName} 
            onChange={handleChange} 
            required 
          />
          <Select 
            label="Relationship" 
            name="nokRelationship" 
            value={formData.nokRelationship} 
            onChange={handleChange} 
            options={relationships}
            required 
          />
          <Input 
            label="Phone Number" 
            name="nokPhone" 
            placeholder="e.g. 08011122233"
            value={formData.nokPhone} 
            onChange={handleChange} 
            required 
          />
          <Input 
            label="Residential Address" 
            name="nokAddress" 
            placeholder="Full address of Next of Kin"
            value={formData.nokAddress} 
            onChange={handleChange} 
            required 
          />
        </div>
      </div>

      {/* Clinical Assignment Section */}
      <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
        <div className="flex items-center gap-2 mb-6 text-blue-700">
          <span className="text-xl"><User size={20} /></span>
          <h3 className="text-lg font-bold">Clinical Assignment</h3>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <Select 
            label="Doctor in Charge" 
            name="doctorInCharge" 
            value={formData.doctorInCharge} 
            onChange={handleChange} 
            options={doctors}
            required 
          />
          <p className="text-xs text-blue-600 italic">
            * This will immediately add the patient to the selected doctor's queue.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StepFour;