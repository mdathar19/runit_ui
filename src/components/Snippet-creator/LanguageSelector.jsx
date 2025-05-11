'use client';

import React from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedLanguage } from '@/redux/slices/compilerSlice';
import ReusableSelector from '../global/ReusableSelector';
import { languages } from '@/Utils';


const LanguageSelector = ({ selectedLanguage }) => {
  const dispatch = useDispatch();

  // Handle language selection
  const selectLanguage = (language) => {
    dispatch(setSelectedLanguage(language.id));
  };

  return (
     <ReusableSelector
      options={languages}
      selectedId={selectedLanguage}
      onSelect={selectLanguage}
      label="Programming Language"
      placeholder="Search languages..."
    />
  );
};

export default LanguageSelector;