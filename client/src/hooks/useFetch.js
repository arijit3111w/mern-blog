import { useEffect, useState } from "react";

export const useFetch = (url, options = {}, dependencies = []) => {
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Moved inside useEffect
      try {
        const response = await fetch(url, options);
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText} ${response.status}`);
        }

        setData(responseData);
        setError();
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, dependencies); // Make sure `url` and `options` are in dependencies if dynamic

  return { data, loading, error }; // Moved return inside function
};
