// src/hooks/use-mobile.js
import { useState, useEffect } from "react";

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      // You can adjust the breakpoint (e.g., 768px for tablets)
      setIsMobile(window.innerWidth < 768);
    };

    // Run on mount
    checkIfMobile();

    // Add event listener for resize
    window.addEventListener("resize", checkIfMobile);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return isMobile;
}

export default useIsMobile;
