import { useEffect, useState } from 'react'

export const useAnimations = () => {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const parallax = (speed: number = 0.5) => {
        return {
            transform: `translateY(${scrollY * speed}px)`
        }
    }

    return { scrollY, parallax }
}