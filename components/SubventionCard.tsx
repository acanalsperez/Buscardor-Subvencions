
import React from 'react';
import { Subvention } from '../types';

interface SubventionCardProps {
  subvention: Subvention;
}

const SubventionCard: React.FC<SubventionCardProps> = ({ subvention }) => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transform hover:scale-105 transition-transform duration-300">
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{subvention.concepto}</h3>
        <p className="text-slate-600 mb-4">{subvention.explicacion}</p>
        
        <div className="mb-4">
          <h4 className="font-semibold text-slate-700 mb-2">Requisitos Clave</h4>
          <ul className="list-disc list-inside space-y-1 text-slate-600">
            {subvention.requisitos.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="font-semibold text-slate-700">Plazos</h4>
          <p className="text-blue-600 font-medium">{subvention.plazos}</p>
        </div>
      </div>
    </div>
  );
};

export default SubventionCard;
