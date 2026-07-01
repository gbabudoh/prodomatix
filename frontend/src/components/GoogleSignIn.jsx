import { useEffect, useRef } from 'react';

// Renders Google's official "Sign in with Google" button using Google Identity
// Services. On success it calls onCredential(idToken); verify that token on the
// server. Renders nothing if VITE_GOOGLE_CLIENT_ID is not set.
const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const GIS_SRC = 'https://accounts.google.com/gsi/client';

// True when a Google OAuth client ID is configured; pages use this to decide
// whether to show the "or" divider above the button.
export const googleEnabled = !!CLIENT_ID;

let gisPromise = null;
function loadGis() {
  if (window.google?.accounts?.id) return Promise.resolve();
  if (gisPromise) return gisPromise;
  gisPromise = new Promise((resolve, reject) => {
    const s = document.createElement('script');
    s.src = GIS_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Could not load Google sign-in.'));
    document.head.appendChild(s);
  });
  return gisPromise;
}

export default function GoogleSignIn({ onCredential, onError, text = 'continue_with' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!CLIENT_ID) return;
    let cancelled = false;
    let resizeObserver = null;

    const render = () => {
      if (cancelled || !ref.current || !window.google?.accounts?.id) return;
      
      const containerWidth = ref.current.offsetWidth || 340;
      // Google button width must be between 200 and 400 pixels
      const buttonWidth = Math.min(400, Math.max(200, containerWidth));
      
      ref.current.innerHTML = '';
      window.google.accounts.id.renderButton(ref.current, {
        theme: 'outline',
        size: 'large',
        width: buttonWidth,
        text,
        shape: 'rectangular',
        logo_alignment: 'center'
      });
    };

    loadGis()
      .then(() => {
        if (cancelled || !ref.current) return;
        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (resp) => onCredential(resp.credential)
        });

        render();

        if (typeof ResizeObserver !== 'undefined') {
          let timeoutId = null;
          resizeObserver = new ResizeObserver(() => {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
              render();
            }, 100);
          });
          resizeObserver.observe(ref.current);
        }
      })
      .catch((e) => onError?.(e.message));

    return () => {
      cancelled = true;
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  if (!CLIENT_ID) return null;
  return <div className="gbtn" ref={ref} />;
}
