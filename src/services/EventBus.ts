
type EventCallback<T = any> = (data: T) => void;

export class EventBus {
  private events: Map<string, EventCallback[]> = new Map();

  subscribe<T = any>(eventName: string, callback: EventCallback<T>): () => void {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }
    
    const callbacks = this.events.get(eventName)!;
    callbacks.push(callback);

    // Return unsubscribe function
    return () => {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  emit<T = any>(eventName: string, data?: T): void {
    const callbacks = this.events.get(eventName);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  unsubscribe(eventName: string): void {
    this.events.delete(eventName);
  }

  clear(): void {
    this.events.clear();
  }
}

export const eventBus = new EventBus();
