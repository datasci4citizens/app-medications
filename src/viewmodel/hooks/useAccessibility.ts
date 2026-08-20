import { useCallback, useEffect, useState } from 'react';
import { storage } from '../../model/repositories/storage';
import { STORAGE_KEYS } from '../../constants';

export type TextSize = 'normal' | 'grande' | 'enorme';

/** Quanto cada opção aumenta o tamanho de tudo na tela. */
export const TEXT_SCALE: Record<TextSize, number> = {
   normal: 1,
   grande: 1.16,
   enorme: 1.34,
};

/**
 * Aplica o tamanho escolhido no app inteiro.
 *
 * O app dimensiona tudo em pixel (text-[22px], h-[60px]), e pixel não acompanha
 * mudança na fonte raiz. O zoom no body é o que multiplica qualquer unidade.
 */
function applyTextSize(size: TextSize) {
   document.body.style.zoom = String(TEXT_SCALE[size]);
}

function readTextSize(): TextSize {
   return storage.get<TextSize>(STORAGE_KEYS.ACCESSIBILITY) ?? 'normal';
}

/** Aplica a preferência salva na abertura do app, antes de qualquer tela montar. */
export function initAccessibility() {
   applyTextSize(readTextSize());
}

/** Preferência de tamanho de texto, guardada no aparelho. */
export function useAccessibility() {
   const [textSize, setTextSizeState] = useState<TextSize>(readTextSize);

   useEffect(() => { applyTextSize(textSize); }, [textSize]);

   const setTextSize = useCallback((size: TextSize) => {
      storage.set(STORAGE_KEYS.ACCESSIBILITY, size);
      setTextSizeState(size);
   }, []);

   return { textSize, setTextSize };
}
