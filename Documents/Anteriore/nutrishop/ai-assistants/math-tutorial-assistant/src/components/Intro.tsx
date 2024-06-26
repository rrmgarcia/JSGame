'use client';

import React from 'react';

interface IntroProps {
  userName: string;
}

const Intro: React.FC<IntroProps> = ({ userName }) => {
  const nameParts = userName?.split(' ') || [];
  let firstName = userName;
  if (nameParts.length === 1) {
    firstName = nameParts[0].replace(/([A-Z])/g, ' $1').trim();
  } else if (nameParts.length === 2) {
    firstName = nameParts[0];
  } else if (nameParts.length >= 3) {
    firstName = `${nameParts[0]} ${nameParts[1]}`;
  }

  return (
    <div className='absolute top-[18vh] left-[40vh] max-sm:top-[15vh] max-sm:left-[5vh]'>
      <div className='flex flex-col gap-1'>
        <p className='font-semibold text-4xl'>Hello, {firstName}!</p>
        <p>Ready to tackle some numbers?</p>
      </div>
    </div>
  );
};

export default Intro;
