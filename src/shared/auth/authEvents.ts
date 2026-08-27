type Listener = () => void;

const listeners = new Set<Listener>();

export const authEvents = {
  subscribeUnauthorized(listener: Listener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },

  emitUnauthorized() {
    listeners.forEach((listener) => {
      listener();
    });
  },
};
