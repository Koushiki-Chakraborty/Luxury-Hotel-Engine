import { useEffect } from 'react';

/**
 * Custom hook to scroll to top of page on component mount
 * Use this on pages to ensure they start at the top when navigated to
 */
const useScrollToTop = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
};

export default useScrollToTop;
