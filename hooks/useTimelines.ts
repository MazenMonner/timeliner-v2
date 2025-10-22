import { useState, useCallback, useEffect } from 'react';
import type { TTimeline, TEvent } from '../types';

const STORAGE_KEY = 'timeline-app-data';

const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNDc1NTY5IiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiNjN2QyZTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5VcGxvYWQgYW4gaW1hZ2U8L3RleHQ+PC9zdmc+';

export const useTimelines = () => {
  const [timelines, setTimelines] = useState<TTimeline[]>(() => {
    try {
      const savedTimelines = window.localStorage.getItem(STORAGE_KEY);
      if (savedTimelines) {
        return JSON.parse(savedTimelines);
      }
    } catch (error) {
      console.error("Error reading timelines from local storage", error);
    }
    return []; // Return empty array if nothing saved or on error
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(timelines));
    } catch (error) {
      console.error("Error saving timelines to local storage", error);
    }
  }, [timelines]);

  const createTimeline = useCallback(() => {
    const newId = `proj-${Date.now()}`;
    const newTimeline: TTimeline = {
      id: newId,
      name: 'New Timeline',
      description: 'A brief description of your new timeline.',
      pictureUrl: placeholderImage,
      events: []
    };
    setTimelines(prev => [...prev, newTimeline]);
    return newId;
  }, []);

  const deleteTimeline = useCallback((timelineId: string) => {
    setTimelines(prev => prev.filter(t => t.id !== timelineId));
  }, []);

  const updateTimeline = useCallback((timelineId: string, updates: Partial<Omit<TTimeline, 'id' | 'events'>>) => {
    setTimelines(prev => prev.map(t => t.id === timelineId ? { ...t, ...updates } : t));
  }, []);

  const addEvent = useCallback((timelineId: string) => {
    setTimelines(prev => prev.map(t => {
      if (t.id === timelineId) {
        const newEvent: TEvent = {
          id: `ev-${t.id}-${Date.now()}`,
          name: 'New Event',
          date: new Date().toISOString().split('T')[0],
          description: '',
          pictureUrl: placeholderImage,
          people: [],
          tags: [],
          media: [],
        };
        return { ...t, events: [...t.events, newEvent] };
      }
      return t;
    }));
  }, []);

  const updateEvent = useCallback((timelineId: string, eventId: string, updates: Partial<TEvent>) => {
    setTimelines(prev => prev.map(t => {
      if (t.id === timelineId) {
        return {
          ...t,
          events: t.events.map(e => e.id === eventId ? { ...e, ...updates } : e)
        };
      }
      return t;
    }));
  }, []);

  const deleteEvent = useCallback((timelineId: string, eventId: string) => {
    setTimelines(prev => prev.map(t => {
      if (t.id === timelineId) {
        return { ...t, events: t.events.filter(e => e.id !== eventId) };
      }
      return t;
    }));
  }, []);

  return { timelines, createTimeline, deleteTimeline, updateTimeline, addEvent, updateEvent, deleteEvent };
};