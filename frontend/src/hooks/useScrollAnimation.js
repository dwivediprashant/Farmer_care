import { useEffect } from 'react';

const useScrollAnimation = () => {
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, observerOptions);

    const observeElements = () => {
      const animatedElements = document.querySelectorAll(
        '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .bounce-in'
      );
      animatedElements.forEach(el => {
        if (!el.classList.contains('observed')) {
          el.classList.add('observed');
          observer.observe(el);
        }
      });
    };

    // Initial observation
    observeElements();

    // Re-observe when DOM changes (for dynamic content)
    const mutationObserver = new MutationObserver(observeElements);
    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, []);
};

export default useScrollAnimation;