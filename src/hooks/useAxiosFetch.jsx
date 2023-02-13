import { useState, useEffect } from "react";
import axios from "axios";

const useAxiosFetch = (dataUrl) => {
  const [data, setData] = useState([]);

  const [fetchError, setFetchError] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const source = axios.CancelToken.source();

    const fetchData = async (url) => {
      setIsLoading(true);
      try {
        const response = await axios.get(url, {
          cancelToken: source.token,
        });
        //CancelToken allows us to cancel the request if we unmount the component
        if (isMounted) {
          setData(response.data);
          setFetchError(null);
        }
        //We check to see if component is mounted
      } catch (err) {
        if (isMounted) {
          setFetchError(err.message);
          setData([]);
        }
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    fetchData(dataUrl);
    //We call this function into action with dataUrl received by the hook

    const cleanUp = () => {
      isMounted = false;
      source.cancel();
    };
    //cleanUp function will cancel a request if the component is unloaded during
    //the request, and it will also set isMounted to false

    return cleanUp;
  }, [dataUrl]);

  return { data, fetchError, isLoading };
};

/*
DEFINITION OF CUSTOM HOOKS:
  They are like recipes, utility functions that you can pull in to different 
  projects to use them again and again (remember the rules of hooks)
  Also you might find different versions of these hooks
*/

export default useAxiosFetch;
