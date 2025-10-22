import React from 'react';
import type { TTimeline } from '../types';
import { PlusIcon } from './icons';

interface HomeScreenProps {
  timelines: TTimeline[];
  onSelectTimeline: (id: string) => void;
  onCreateTimeline: () => void;
}

const TimelineCard: React.FC<{ timeline: TTimeline; onClick: () => void }> = ({ timeline, onClick }) => (
  <button
    onClick={onClick}
    className="w-full text-left bg-slate-800 rounded-lg border border-slate-700 hover:border-indigo-500 hover:bg-slate-700/50 transition-all duration-300 ease-in-out shadow-lg overflow-hidden"
  >
    <img src={timeline.pictureUrl} alt={timeline.name} className="w-full h-32 object-cover" />
    <div className="p-6">
      <h2 className="text-xl font-bold text-white">{timeline.name}</h2>
      <p className="text-slate-400 mt-2 text-sm line-clamp-2">{timeline.description}</p>
      <p className="text-xs text-indigo-400 mt-4 font-semibold">{timeline.events.length} Event(s)</p>
    </div>
  </button>
);

export const HomeScreen: React.FC<HomeScreenProps> = ({ timelines, onSelectTimeline, onCreateTimeline }) => {
  return (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      <header className="p-6 border-b border-slate-800">
        <h1 className="text-3xl font-bold tracking-tight">Timeline Projects</h1>
        <p className="text-slate-400 mt-1">Select a project to view or create a new one.</p>
      </header>
      <main className="flex-grow overflow-y-auto p-6">
        <div className="space-y-4">
          {timelines.map(timeline => (
            <TimelineCard key={timeline.id} timeline={timeline} onClick={() => onSelectTimeline(timeline.id)} />
          ))}
        </div>
      </main>
      <footer className="p-6">
        <button
          onClick={onCreateTimeline}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-4 rounded-lg transition-colors shadow-indigo-900/50 shadow-lg"
        >
          <PlusIcon className="w-6 h-6" />
          Create New Timeline
        </button>
      </footer>
    </div>
  );
};