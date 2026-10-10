import { useState, useEffect } from 'react';

/**
 * Hook para detecção em tempo real do estado de Caps Lock
 */
export function useCapsLock() {
  const [capsLockActive, setCapsLockActive] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyChange = (e: KeyboardEvent) => {
      if (typeof e.getModifierState === 'function') {
        const isCapsLock = e.getModifierState('CapsLock');
        setCapsLockActive(isCapsLock);
      }
    };

    window.addEventListener('keydown', handleKeyChange);
    window.addEventListener('keyup', handleKeyChange);

    return () => {
      window.removeEventListener('keydown', handleKeyChange);
      window.removeEventListener('keyup', handleKeyChange);
    };
  }, []);

  return capsLockActive;
}
