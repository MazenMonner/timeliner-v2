import React, { useState, useMemo } from 'react';
import type { TTimeline } from '../types';
import { EventView } from './EventView';
import { EditTimelineModal } from './EditTimelineModal';
import { ConfirmationModal } from './ConfirmationModal';
import { ChevronLeftIcon, EditIcon, CheckIcon, PlusIcon, TrashIcon, InformationCircleIcon } from './icons';

interface TimelineScreenProps {
  timeline: TTimeline;
  onBack: () => void;
  onUpdateTimeline: (updates: Partial<Omit<TTimeline, 'id' | 'events'>>) => void;
  onDeleteTimeline: () => void;
  onAddEvent: () => void;
  onUpdateEvent: (eventId: string, updates: Partial<TTimeline['events'][0]>) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const TimelineScreen: React.FC<TimelineScreenProps> = ({ timeline, onBack, onUpdateTimeline, onDeleteTimeline, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [filterPerson, setFilterPerson] = useState('');
  const [filterTag, setFilterTag] = useState('');

  const { uniquePeople, uniqueTags } = useMemo(() => {
    const people = new Set<string>();
    const tags = new Set<string>();
    timeline.events.forEach(event => {
      event.people.forEach(p => people.add(p));
      event.tags.forEach(t => tags.add(t));
    });
    return { uniquePeople: Array.from(people), uniqueTags: Array.from(tags) };
  }, [timeline.events]);

  const filteredAndSortedEvents = useMemo(() => {
    return timeline.events
      .filter(event => {
        const personMatch = filterPerson ? event.people.includes(filterPerson) : true;
        const tagMatch = filterTag ? event.tags.includes(filterTag) : true;
        return personMatch && tagMatch;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [timeline.events, filterPerson, filterTag]);

  return (
    <>
      <div className="grid grid-rows-[auto_1fr_auto] h-full bg-slate-900 text-white">
        <header className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 z-10 overflow-hidden">
            <div className="relative p-4">
                 <div 
                    className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
                    style={{ backgroundImage: `url(${timeline.pictureUrl})` }}
                ></div>
                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <button onClick={onBack} className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors">
                            <ChevronLeftIcon className="w-5 h-5"/>
                            <span>Home</span>
                        </button>
                        <div className="flex items-center gap-2 mx-4 min-w-0">
                            <h1 className="text-xl font-bold truncate">{timeline.name}</h1>
                            {isEditing && (
                                <button onClick={() => setIsDeleteConfirmOpen(true)} className="flex-shrink-0 p-1 text-red-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors" title="Delete Timeline">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            )}
                        </div>
                        <button onClick={() => setIsEditing(!isEditing)} className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>
                            {isEditing ? <CheckIcon className="w-5 h-5" /> : <EditIcon className="w-5 h-5" />}
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <select value={filterPerson} onChange={e => setFilterPerson(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none">
                            <option value="">Filter by Person...</option>
                            {uniquePeople.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        <select value={filterTag} onChange={e => setFilterTag(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none">
                            <option value="">Filter by Tag...</option>
                            {uniqueTags.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
            </div>
        </header>

        <main className="overflow-y-auto relative px-4 pt-4">
          <div className="absolute top-0 left-8 w-0.5 h-full bg-slate-700"></div>
          
          <div className="pl-10">
            {filteredAndSortedEvents.length === 0 ? (
                <div className="text-center text-slate-400 mt-20">
                    <p>No events to display.</p>
                    {isEditing ? <p>Click "Add Event" to get started.</p> : <p>Try clearing filters or adding events in edit mode.</p>}
                </div>
            ) : (
                <div className="space-y-8 pb-4">
                    {filteredAndSortedEvents.map((event) => (
                        <div key={event.id} className="flex items-start relative">
                            <div className="absolute -left-5 top-5 w-4 h-4 rounded-full bg-slate-800 border-2 border-indigo-500 z-10"></div>
                            <EventView 
                                  event={event} 
                                  isEditing={isEditing}
                                  onUpdate={(updates) => onUpdateEvent(event.id, updates)}
                                  onDelete={() => onDeleteEvent(event.id)}
                                  timelineAccent="text-indigo-400"
                              />
                        </div>
                    ))}
                </div>
            )}
          </div>
        </main>
        
        {isEditing && (
            <footer className="bg-slate-900/80 backdrop-blur-lg border-t border-slate-800 p-4 z-10">
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => setIsEditModalOpen(true)} className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-3 rounded-md transition-colors text-sm">
                        <InformationCircleIcon className="w-4 h-4"/> Edit Info
                    </button>
                    <button onClick={onAddEvent} className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-3 rounded-md transition-colors text-sm">
                        <PlusIcon className="w-4 h-4"/> Add Event
                    </button>
                </div>
            </footer>
        )}

      </div>
      {isEditModalOpen && (
        <EditTimelineModal
          timeline={timeline}
          onClose={() => setIsEditModalOpen(false)}
          onSave={(updates) => {
            onUpdateTimeline(updates);
            setIsEditModalOpen(false);
          }}
        />
      )}
      {isDeleteConfirmOpen && (
        <ConfirmationModal
          onClose={() => setIsDeleteConfirmOpen(false)}
          onConfirm={onDeleteTimeline}
          title="Delete Timeline"
          message={`Are you sure you want to permanently delete the timeline "${timeline.name}"? This action cannot be undone.`}
        />
      )}
    </>
  );
};
