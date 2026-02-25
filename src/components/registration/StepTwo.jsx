import React from 'react';
import Input from '../ui/Input';
import Select from '../ui/Select';

const StepTwo = ({ formData, handleChange }) => {
  // simulated states
  const states = [{
    value: 'Lagos',
    label: 'Lagos'
  }, {  
    value: 'Abuja',
    label: 'Abuja'
  }, {  
    value: 'Kano',
    label: 'Kano'
  }, {  
    value: 'Rivers',
    label: 'Rivers'
  }, {  
    value: 'Oyo',
    label: 'Oyo'
  }];
  
  // simulated states and lgas
  const lgaMap = {
    'Lagos': ['Ikeja', 'Alimosho', 'Lekki', 'Badagry'],
    'Abuja': ['Garki', 'Wuse', 'Maitama', 'Asokoro'],
    'Oyo': ['Ibadan North', 'Ibadan South', 'Ogbomosho'],
  };

  const availableLgas = (lgaMap[formData.state] || []).map((item) => ({ value: item, label: item }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="border-b pb-2">
        <h3 className="text-lg font-semibold text-gray-700">Contact Information</h3>
        <p className="text-sm text-gray-500">How can we reach the patient?</p>
      </div>

      {/* Phone Numbers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input 
          label="Primary Phone Number" 
          name="phone" 
          type="tel"
          placeholder="e.g. 08012345678"
          value={formData.phone} 
          onChange={handleChange} 
          required 
        />
        <Input 
          label="Alternative Phone Number" 
          name="altPhone" 
          type="tel"
          placeholder="e.g. 09012345678"
          value={formData.altPhone} 
          onChange={handleChange} 
        />
      </div>

      {/* Email */}
      <div className="grid grid-cols-1 gap-6">
        <Input 
          label="Email Address" 
          name="email" 
          type="email"
          placeholder="patient@example.com"
          value={formData.email} 
          onChange={handleChange} 
        />
      </div>

      <div className="border-b pb-2 pt-4">
        <h3 className="text-lg font-semibold text-gray-700">Location Details</h3>
      </div>

      {/* Address - Full Width */}
      <div className="grid grid-cols-1 gap-6">
        <Input 
          label="Residential Address" 
          name="address" 
          placeholder="Street name, House number, Landmark"
          value={formData.address} 
          onChange={handleChange} 
          required 
        />
      </div>

      {/* State and LGA */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Select 
          label="State of Residence" 
          name="state" 
          value={formData.state} 
          onChange={handleChange} 
          options={states}
          required 
        />
        <Select 
          label="Local Government Area (LGA)" 
          name="lga" 
          value={formData.lga} 
          onChange={handleChange} 
          options={availableLgas}
          required 
          disabled={!formData.state} // Disable if no state is selected
        />
      </div>
    </div>
  );
};

export default StepTwo;