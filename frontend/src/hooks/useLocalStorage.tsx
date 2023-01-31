import { useState } from "react";

export default function useLocalStorage(key : string, initialValue : any) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log(error);
      return initialValue;
    }
  });

  const setValue = (value : any) => {
    try {
      const valueToStore = value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log(error);
    }
  };

  const deleteValue = () => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.log(error);     
    }
  };

  return [storedValue, setValue, deleteValue];
}
