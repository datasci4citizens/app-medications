import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

interface FormData {
  name: string;
  email: string;
  birth_date: string;
  phone_number: string;
  scholarship: string;
  accept_tcle: boolean;
  gender: string;
  sex: string;
  is_caretaker: boolean;
  emergency_contact_name: string;
  emergency_contact_number: string;
}

const FormContext = createContext<{
  formData: Partial<FormData>;
  setFormData: React.Dispatch<React.SetStateAction<Partial<FormData>>>;
}>({
  formData: {},
  setFormData: () => {},
});

export const FormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<Partial<FormData>>({});

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

export const fillForm = () => useContext(FormContext);
