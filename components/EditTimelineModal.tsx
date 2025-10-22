import React, { useState, useId } from 'react';
import type { TTimeline } from '../types';
import { XMarkIcon } from './icons';

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

interface EditTimelineModalProps {
  timeline: TTimeline;
  onClose: () => void;
  onSave: (updates: Partial<Omit<TTimeline, 'id' | 'events'>>) => void;
}

export const EditTimelineModal: React.FC<EditTimelineModalProps> = ({ timeline, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: timeline.name,
    description: timeline.description,
    pictureUrl: timeline.pictureUrl,
  });
  const fileInputId = useId();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setFormData(prev => ({ ...prev, pictureUrl: base64 }));
    }
  };

  const handleSave = () => {
    onSave(formData);
  };
  
  const inputClasses = "w-full bg-slate-700 text-slate-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors";
  const labelClasses = "text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block";

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-6 flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">Edit Timeline Info</h2>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white transition-colors">
                <XMarkIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div>
          <label className={labelClasses}>Cover Image</label>
          <img src={formData.pictureUrl} alt="Timeline cover" className="w-full h-40 object-cover rounded-md mb-2 border-2 border-slate-700"/>
          <input type="file" accept="image/*" id={fileInputId} onChange={handlePictureChange} className="hidden"/>
          <label htmlFor={fileInputId} className="w-full text-center bg-slate-600 hover:bg-slate-500 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm cursor-pointer block">
            Upload New Image
          </label>
        </div>
        
        <div>
          <label htmlFor="name" className={labelClasses}>Timeline Name</label>
          <input id="name" type="text" name="name" value={formData.name} onChange={handleInputChange} className={inputClasses} />
        </div>

        <div>
          <label htmlFor="description" className={labelClasses}>Description</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className={`${inputClasses} min-h-[100px]`} />
        </div>
        
        <div className="flex gap-4 mt-2">
            <button onClick={onClose} className="w-full bg-slate-600 hover:bg-slate-500 text-white font-bold py-3 rounded-md transition-colors">
                Cancel
            </button>
            <button onClick={handleSave} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-md transition-colors">
                Save Changes
            </button>
        </div>
      </div>
    </div>
  );
};