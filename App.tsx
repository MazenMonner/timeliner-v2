
import React, { useState } from 'react';
import { HomeScreen } from './components/HomeScreen';
import { TimelineScreen } from './components/TimelineScreen';
import { useTimelines } from './hooks/useTimelines';

const App: React.FC = () => {
  const [activeTimelineId, setActiveTimelineId] = useState<string | null>(null);
  const { 
    timelines, 
    createTimeline, 
    deleteTimeline,
    updateTimeline,
    addEvent,
    updateEvent,
    deleteEvent
  } = useTimelines();

  const handleSelectTimeline = (id: string) => {
    setActiveTimelineId(id);
  };

  const handleCreateTimeline = () => {
    const newId = createTimeline();
    setActiveTimelineId(newId);
  };

  const handleBackToHome = () => {
    setActiveTimelineId(null);
  };

  const handleDeleteTimeline = () => {
      if(activeTimelineId) {
          deleteTimeline(activeTimelineId);
          setActiveTimelineId(null);
      }
  };

  const activeTimeline = timelines.find(t => t.id === activeTimelineId);

  return (
    <div className="h-screen w-screen flex items-center justify-center p-4 bg-slate-950 font-sans">
      <div className="w-full max-w-md h-full max-h-[850px] bg-slate-900 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden border-4 border-slate-700">
        {activeTimeline ? (
          <TimelineScreen
            timeline={activeTimeline}
            onBack={handleBackToHome}
            onUpdateTimeline={(updates) => updateTimeline(activeTimeline.id, updates)}
            onDeleteTimeline={handleDeleteTimeline}
            onAddEvent={() => addEvent(activeTimeline.id)}
            onUpdateEvent={(eventId, updates) => updateEvent(activeTimeline.id, eventId, updates)}
            onDeleteEvent={(eventId) => deleteEvent(activeTimeline.id, eventId)}
          />
        ) : (
          <HomeScreen
            timelines={timelines}
            onSelectTimeline={handleSelectTimeline}
            onCreateTimeline={handleCreateTimeline}
          />
        )}
      </div>
    </div>
  );
};

export default App;
