let refreshPromise: Promise<Response> | null = null;

export const authFetch = async (
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> => {
  const config: RequestInit = {
    ...init,
    credentials: 'include',
  };

  const response = await fetch(input, config);

  if (response.status === 401) {
    if (!refreshPromise) {
      refreshPromise = fetch('/api/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      })
        .catch((err) => {
          throw err;
        })
        .finally(() => {
          refreshPromise = null;
        });
    }

    try {
      const refreshResponse = await refreshPromise;

      if (refreshResponse && refreshResponse.ok) {
        // Retry original request
        const retryResponse = await fetch(input, config);
        // If retry still 401, session is truly dead
        if (retryResponse.status === 401) {
          throw new Error('SESSION_EXPIRED');
        }
        return retryResponse;
      }
    } catch (error) {
      // Fall through to session expired handling
    }

    // Session expired handling
    if (typeof window !== 'undefined') {
      window.location.href = '/login?error=session_expired';
    }
    throw new Error('SESSION_EXPIRED');
  }

  return response;
};
