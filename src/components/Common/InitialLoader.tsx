import React from 'react';
import { SpinnerDotted } from 'spinners-react';

export const InitialLoader: React.FC = () => {
  return (
    <div
      id="initial-loader"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F3FAF4] text-[#172017] select-none"
      role="status"
      aria-live="polite"
      aria-label="Chargement initial du site"
    >
      <div className="flex flex-col items-center justify-center">
        <SpinnerDotted size={50} thickness={100} speed={100} color="#36ad47" />
        <span className="sr-only">Chargement de la boutique...</span>
      </div>
    </div>
  );
};

export default InitialLoader;
