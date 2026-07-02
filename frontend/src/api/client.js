// Thin fetch wrapper. Uses httpOnly cookie auth (credentials: 'include').
// No token stored in localStorage — the cookie is managed by the browser.

async function request(path, { method = 'GET', body, raw = false } = {}) {
  const res = await fetch(`/api${path}`, {
    method,
    credentials: 'include',          // sends httpOnly cookie automatically
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });

  if (raw) return res;

  const data = res.status === 204 ? null : await res.json().catch(() => null);
  if (!res.ok) {
    const err = new Error(data?.error || `Request failed (${res.status})`);
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export const api = {
  get:  (p)       => request(p),
  post: (p, body) => request(p, { method: 'POST', body }),
  put:  (p, body) => request(p, { method: 'PUT',  body }),
  del:  (p)       => request(p, { method: 'DELETE' }),

  download: async (p, filename) => {
    const res = await request(p, { raw: true });
    if (!res.ok) {
      const d = await res.json().catch(() => null);
      throw new Error(d?.error || 'Download failed.');
    }
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  },
};

// Kept for any code that still imports these — both are now no-ops.
export const getToken = () => null;
export const setToken = () => {};
