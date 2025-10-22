export interface TEvent {
  id: string;
  name: string;
  date: string; // Using string for simplicity, can be parsed to Date
  description: string;
  pictureUrl: string;
  people: string[];
  tags: string[];
  media: string[];
}

export interface TTimeline {
  id: string;
  name:string;
  description: string;
  pictureUrl: string;
  events: TEvent[];
}