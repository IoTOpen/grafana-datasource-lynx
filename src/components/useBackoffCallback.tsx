import {useCallback, useRef} from "react";
export const useBackoffCallback = (fn: () => void, delay: number) => {
    const ticker = useRef<number>();
    return useCallback(() => {
        if (ticker.current !== undefined) {
            window.clearTimeout(ticker.current);
        }
        ticker.current = window.setTimeout(fn, delay);
    }, [fn, delay]);
}
