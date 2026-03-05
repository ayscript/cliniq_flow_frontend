import React from 'react';

const Input = ({ label, type, name, value, onChange, placeholder, required }) => {
    return (
        <div className='flex flex-col gap-2 w-full'>
            <label className='text-sm font-semibold text-gray-700'>
                {label} {required && <span className='text-red-500'>*</span>}
            </label>
            <input 
                type={type} 
                name={name} 
                value={value} 
                onChange={onChange}
                placeholder={placeholder}
                className='px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-gray-800'
            />
        </div>
    )
}

export default Input