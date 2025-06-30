
import { useEffect } from 'react';
import { eventBus } from '@/services/EventBus';
import type { AppEvents } from '@/types/events';

export const useEventBus = () => {
  const subscribe = <K extends keyof AppEvents>(
    eventName: K,
    callback: (data: AppEvents[K]) => void
  ) => {
    return eventBus.subscribe(eventName, callback);
  };

  const emit = <K extends keyof AppEvents>(
    eventName: K,
    data: AppEvents[K]
  ) => {
    eventBus.emit(eventName, data);
  };

  return { subscribe, emit };
};

export const useEventSubscription = <K extends keyof AppEvents>(
  eventName: K,
  callback: (data: AppEvents[K]) => void,
  deps: React.DependencyList = []
) => {
  useEffect(() => {
    const unsubscribe = eventBus.subscribe(eventName, callback);
    return unsubscribe;
  }, deps);
};
