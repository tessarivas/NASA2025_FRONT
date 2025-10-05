import { useState, useCallback } from 'react';

export function useInputText() {
  const [currentText, setCurrentText] = useState("");

  const setCurrentTextOptimized = useCallback((text) => {
    setCurrentText(text);
  }, []);

  const clearText = useCallback(() => {
    setCurrentText("");
  }, []);

  return {
    currentText,
    setCurrentText: setCurrentTextOptimized,
    clearText
  };
}