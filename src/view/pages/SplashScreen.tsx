import { useEffect, useState } from "react";
import { useAuth } from "../../viewmodel/contexts/AuthContext";

const MIN_DISPLAY_MS = 1200;
const FADE_DURATION_MS = 500;

export function SplashScreen() {
   const { isLoading } = useAuth();
   const [hidden, setHidden] = useState(false);
   const [fadingOut, setFadingOut] = useState(false);
   const [minTimeReached, setMinTimeReached] = useState(false);

   useEffect(() => {
      const t = setTimeout(() => setMinTimeReached(true), MIN_DISPLAY_MS);
      return () => clearTimeout(t);
   }, []);

   useEffect(() => {
      if (!isLoading && minTimeReached && !fadingOut && !hidden) {
         setFadingOut(true);
         const t = setTimeout(() => setHidden(true), FADE_DURATION_MS);
         return () => clearTimeout(t);
      }
   }, [isLoading, minTimeReached, fadingOut, hidden]);

   if (hidden) return null;

   return (
      <div
         className={`
            fixed inset-0 z-[9999] flex items-center justify-center
            bg-darkpurple
            transition-opacity ease-out
            ${fadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'}
         `}
         style={{ transitionDuration: `${FADE_DURATION_MS}ms` }}
         aria-hidden={fadingOut}
      >
         <h1 className="font-merriweather font-bold text-6xl tracking-tight select-none">
            <span className="text-offwhite">Lembra</span>
            <span className="text-lightpurple">med</span>
         </h1>
      </div>
   );
}
