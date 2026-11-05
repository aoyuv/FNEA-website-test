import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { loadAllContent } from '../services/contentService';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    loadAllContent()
      .then((content) => { if (active) { setData(content); setError(null); } })
      .catch((err) => { if (active) setError(err); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const value = useMemo(() => ({
    data,
    loading,
    error,
    siteConfig: data?.siteConfig ?? {},
    refresh: async () => {
      setLoading(true);
      try { const content = await loadAllContent(); setData(content); setError(null); return content; }
      catch (err) { setError(err); throw err; }
      finally { setLoading(false); }
    },
  }), [data, loading, error]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContentState() {
  const context = useContext(ContentContext);
  if (!context) throw new Error('useContentState must be used inside ContentProvider');
  return context;
}

export function useContent() {
  const context = useContentState();
  return { ...context, ...(context.data ?? {}) };
}
