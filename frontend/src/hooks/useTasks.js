import { useState, useEffect } from 'react';
import { fetchTasks } from '../api';

export function useTasks(query, status, page, pageSize) {
  const [tasks, setTasks] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchTasks({ query, status, page, pageSize }, controller.signal)
      .then((data) => {
        setTasks(data.items);
        setTotal(data.total);
        setLoading(false);
      })
      .catch((err) => {
        // AbortError is intentional (params changed before response arrived) — not a user error
        if (err.name === 'AbortError') return;
        setError(err.message);
        setLoading(false);
      });

    // Cancel the in-flight request if the effect re-runs before it completes
    return () => controller.abort();
  }, [query, status, page, pageSize]);

  return { tasks, total, loading, error };
}
