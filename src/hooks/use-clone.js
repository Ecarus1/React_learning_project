import { useEffect } from "react";
import useStore from "./use-store";

export default function useClone(nameModules, identifier = 'A') {
  const store = useStore();
  const newNameModules = store.copyingStateModal(nameModules, identifier);

  useEffect(() => {
    return () => {
      store.deleteStateModal(nameModules, identifier);
    }
  }, [])

  return newNameModules;
}