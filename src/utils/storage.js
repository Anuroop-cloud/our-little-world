const PREFIX = 'our_little_world_';

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data));
  } catch (e) {
    console.error('Error saving to local storage', e);
  }
};

export const loadFromStorage = (key, defaultData = null) => {
  try {
    const item = localStorage.getItem(PREFIX + key);
    return item ? JSON.parse(item) : defaultData;
  } catch (e) {
    console.error('Error loading from local storage', e);
    return defaultData;
  }
};
