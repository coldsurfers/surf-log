import { useEffect, useState } from 'react'

function useNetworkStatus() {
    const [isOnline, setIsOnline] = useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            return window.navigator.onLine
        } else {
            return true
        }
    })
    useEffect(() => {
        if (!window.navigator.onLine) {
            setIsOnline(false)
        }

        const onOnline = () => {
            setIsOnline(true)
        }

        const onOffline = () => {
            setIsOnline(false)
        }

        window.addEventListener('online', onOnline)
        window.addEventListener('offline', onOffline)

        return () => {
            window.removeEventListener('online', onOnline)
            window.removeEventListener('offline', onOffline)
        }
    }, [])

    return {
        isOnline,
    }
}

export default useNetworkStatus
