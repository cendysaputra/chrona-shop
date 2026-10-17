import { useEffect, useRef, useState } from "react";

export default function useAsync(fn, key) {
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const [state, setState] = useState({ data: null, loading: true, error: null });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));

    fnRef
      .current()
      .then((data) => alive && setState({ data, loading: false, error: null }))
      .catch((error) => alive && setState({ data: null, loading: false, error }));

    return () => {
      alive = false;
    };
  }, [key]);

  return state;
}
