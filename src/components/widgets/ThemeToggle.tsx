import { useCallback, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

interface ThemeToggleProps {
    duration?: number
}

export function ThemeToggle({ duration = 400 }: ThemeToggleProps = {}) {
    const [isDark, setIsDark] = useState(true)
    const buttonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        const updateTheme = () => {
            const hasDarkClass = document.documentElement.classList.contains('dark')
            setIsDark(hasDarkClass)
        }

        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('theme')
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

        if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
            document.documentElement.classList.remove('dark')
            setIsDark(false)
        } else {
            document.documentElement.classList.add('dark')
            setIsDark(true)
        }

        // Watch for external theme changes
        const observer = new MutationObserver(updateTheme)
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['class'],
        })

        return () => observer.disconnect()
    }, [])

    const toggleTheme = useCallback(async () => {
        if (!buttonRef.current) return

        // Check if browser supports View Transition API
        if (!document.startViewTransition) {
            // Fallback for browsers without support
            flushSync(() => {
                const newTheme = !isDark
                setIsDark(newTheme)
                document.documentElement.classList.toggle('dark')
                localStorage.setItem('theme', newTheme ? 'dark' : 'light')
            })
            return
        }

        await document.startViewTransition(() => {
            flushSync(() => {
                const newTheme = !isDark
                setIsDark(newTheme)
                document.documentElement.classList.toggle('dark')
                localStorage.setItem('theme', newTheme ? 'dark' : 'light')
            })
        }).ready

        const { top, left, width, height } = buttonRef.current.getBoundingClientRect()
        const x = left + width / 2
        const y = top + height / 2
        const maxRadius = Math.hypot(
            Math.max(left, window.innerWidth - left),
            Math.max(top, window.innerHeight - top)
        )

        // First circle animation
        document.documentElement.animate(
            {
                clipPath: [
                    `circle(0px at ${x}px ${y}px)`,
                    `circle(${maxRadius}px at ${x}px ${y}px)`,
                ],
            },
            {
                duration,
                easing: 'ease-in-out',
                pseudoElement: '::view-transition-new(root)',
            }
        )

        // Second circle animation with delay and darker/lighter overlay
        const overlay = document.createElement('div')
        overlay.style.position = 'fixed'
        overlay.style.inset = '0'
        overlay.style.zIndex = '9999'
        overlay.style.pointerEvents = 'none'
        overlay.style.background = isDark ? 'rgba(241, 245, 249, 0.1)' : 'rgba(15, 23, 42, 0.1)'
        document.body.appendChild(overlay)

        setTimeout(() => {
            overlay.animate(
                {
                    clipPath: [
                        `circle(0px at ${x}px ${y}px)`,
                        `circle(${maxRadius}px at ${x}px ${y}px)`,
                    ],
                    opacity: [1, 0],
                },
                {
                    duration: duration * 0.8,
                    easing: 'ease-out',
                }
            ).onfinish = () => {
                overlay.remove()
            }
        }, duration * 0.15)
    }, [isDark, duration])

    return (
        <button
            ref={buttonRef}
            onClick={toggleTheme}
            className="cursor-target fixed top-6 right-6 z-[9998] flex h-10 w-10 items-center justify-center cursor-pointer"
            aria-label="Toggle theme"
        >
            {/* sun icon */}
            <svg
                className={`absolute h-10 w-10 fill-current text-gray-900 dark:text-white transition-all duration-300 ${isDark ? 'rotate-180 opacity-0 scale-0' : 'rotate-0 opacity-100 scale-100'
                    }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
                className={`absolute h-10 w-10 fill-current text-gray-900 dark:text-white transition-all duration-300 ${isDark ? 'rotate-0 opacity-100 scale-100' : '-rotate-180 opacity-0 scale-0'
                    }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
        </button>
    )
}
