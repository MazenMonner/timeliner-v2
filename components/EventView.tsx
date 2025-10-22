import React, { useState, useEffect, useId } from 'react';
import type { TEvent } from '../types';
import { TrashIcon, PhotoIcon, XMarkIcon } from './icons';
import { MediaGalleryModal } from './MediaGalleryModal';

interface EventViewProps {
  event: TEvent;
  isEditing: boolean;
  onUpdate: (updates: Partial<TEvent>) => void;
  onDelete: () => void;
  timelineAccent: string;
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

export const EventView: React.FC<EventViewProps> = ({ event, isEditing, onUpdate, onDelete, timelineAccent }) => {
  const [formData, setFormData] = useState(event);
  const [tagsString, setTagsString] = useState('');
  const [peopleString, setPeopleString] = useState('');
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const fileInputId = useId();
  const mediaFileInputId = useId();

  useEffect(() => {
    setFormData(event);
    setTagsString(event.tags.join(', '));
    setPeopleString(event.people.join(', '));
  }, [event]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name in event && event[name as keyof TEvent] !== value) {
        onUpdate({ [name]: value });
    }
  };

  const handleArrayBlur = (field: 'tags' | 'people', value: string) => {
    const newArray = value.split(',').map(item => item.trim()).filter(Boolean);
    const hasChanged = JSON.stringify(newArray) !== JSON.stringify(event[field]);
    if (hasChanged) {
        onUpdate({ [field]: newArray });
    }
  };

  const handlePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setFormData(prev => ({ ...prev, pictureUrl: base64 }));
      onUpdate({ pictureUrl: base64 });
    }
  };

  const handleAddMedia = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const base64Promises = files.map(fileToBase64);
      const base64Strings = await Promise.all(base64Promises);
      const newMedia = [...formData.media, ...base64Strings];
      setFormData(prev => ({ ...prev, media: newMedia }));
      onUpdate({ media: newMedia });
    }
  };

  const handleRemoveMedia = (index: number) => {
    const newMedia = formData.media.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, media: newMedia }));
    onUpdate({ media: newMedia });
  };


  const inputClasses = "w-full bg-slate-700 text-slate-200 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors";
  const labelClasses = "text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 block";
  const buttonClasses = "w-full text-center bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md transition-colors text-sm cursor-pointer";

  if (isEditing) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 w-full shadow-lg relative flex flex-col gap-4">
        <button onClick={onDelete} className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 transition-colors z-10">
          <TrashIcon className="w-5 h-5" />
        </button>
        <div>
          <label className={labelClasses}>Event Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleInputChange} onBlur={handleBlur} className={`${inputClasses} text-lg font-bold`} />
        </div>
        <div>
            <label className={labelClasses}>Event Picture</label>
            <img src={formData.pictureUrl} alt="Event" className="w-full h-32 object-cover rounded-md mb-2 border-2 border-slate-700"/>
            <input type="file" accept="image/*" id={fileInputId} onChange={handlePictureChange} className="hidden"/>
            <label htmlFor={fileInputId} className={buttonClasses}>Upload Image</label>
        </div>
        <div>
          <label className={labelClasses}>Date</label>
          <input type="date" name="date" value={formData.date} onChange={handleInputChange} onBlur={handleBlur} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Description</label>
          <textarea name="description" value={formData.description} onChange={handleInputChange} onBlur={handleBlur} className={`${inputClasses} min-h-[80px]`} />
        </div>
        <div>
          <label className={labelClasses}>People (comma-separated)</label>
          <input type="text" name="people" value={peopleString} onChange={(e) => setPeopleString(e.target.value)} onBlur={(e) => handleArrayBlur('people', e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Tags (comma-separated)</label>
          <input type="text" name="tags" value={tagsString} onChange={(e) => setTagsString(e.target.value)} onBlur={(e) => handleArrayBlur('tags', e.target.value)} className={inputClasses} />
        </div>
        <div>
          <label className={labelClasses}>Media Gallery</label>
          <div className="grid grid-cols-3 gap-2 mb-2">
            {formData.media.map((img, index) => (
              <div key={index} className="relative group">
                <img src={img} className="w-full h-20 object-cover rounded-md"/>
                <button onClick={() => handleRemoveMedia(index)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <XMarkIcon className="w-4 h-4"/>
                </button>
              </div>
            ))}
          </div>
          <input type="file" multiple accept="image/*" id={mediaFileInputId} onChange={handleAddMedia} className="hidden"/>
          <label htmlFor={mediaFileInputId} className={buttonClasses}>Add Media Images</label>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg overflow-hidden w-full shadow-lg group">
        <img src={event.pictureUrl} alt={event.name} className="w-full h-40 object-cover" />
        <div className="p-4">
          <p className={`text-sm font-semibold ${timelineAccent}`}>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })}</p>
          <h3 className="text-xl font-bold text-white mt-1">{event.name}</h3>
          <p className="text-slate-300 mt-2 text-sm">{event.description}</p>
          
          <div className="mt-4 flex flex-col gap-3">
            {event.people.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-400 text-xs">People:</span>
                  {event.people.map(person => <span key={person} className="text-xs bg-slate-700 text-slate-200 px-2 py-1 rounded-full">{person}</span>)}
              </div>
            )}
            {event.tags.length > 0 && (
               <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-400 text-xs">Tags:</span>
                  {event.tags.map(tag => <span key={tag} className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded-full">{`#${tag}`}</span>)}
              </div>
            )}
            {event.media.length > 0 && (
                <button 
                  onClick={() => setIsGalleryOpen(true)}
                  className="mt-2 w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold py-2 px-4 rounded-md transition-colors text-sm"
                >
                    <PhotoIcon className="w-4 h-4"/> View Media ({event.media.length})
                </button>
            )}
          </div>
        </div>
      </div>
      {isGalleryOpen && <MediaGalleryModal images={event.media} onClose={() => setIsGalleryOpen(false)} />}
    </>
  );
};