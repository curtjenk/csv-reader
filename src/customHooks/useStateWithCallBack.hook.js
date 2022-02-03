import { useEffect, useRef, useState } from "react";
import { Delay } from "../Delay";

export const useStateWithCallback = (initialState, delayMs) => {
  const [state, setState] = useState(initialState);
  const callbackRef = useRef();

  const handleSetState = async (updatedState, callback) => {
    console.log("handleStateUpdate");
    callbackRef.current = callback;
    setState(updatedState);
  };

  useEffect(() => {
    async function doit() {
      if (typeof delayMs === "number") {
        console.log(`delaying ${delayMs} milliseconds`);
        await Delay(delayMs);
      }
      callbackRef.current(state);
      callbackRef.current = undefined;
    }
    if (typeof callbackRef.current === "function") {
      console.log("calling the callback function");
      doit();
    }
  }, [state, delayMs]);

  return [state, handleSetState];
};

/* Typescript version

https://stackoverflow.com/questions/56247433/how-to-use-setstate-callback-on-react-hooks

export const useStateWithCallback = <T>(initialState: T): [state: T, setState: (updatedState: React.SetStateAction<T>, callback?: (updatedState: T) => void) => void] => {
    const [state, setState] = useState<T>(initialState);
    const callbackRef = useRef<(updated: T) => void>();

    const handleSetState = (updatedState: React.SetStateAction<T>, callback?: (updatedState: T) => void) => {
        callbackRef.current = callback;
        setState(updatedState);
    };

    useEffect(() => {
        if (typeof callbackRef.current === "function") {
            callbackRef.current(state);
            callbackRef.current = undefined;
        }
    }, [state]);

    return [state, handleSetState];
}


*/
