'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
function cn(...inputs: any[]) { return twMerge(clsx(inputs)) }

const SCATTER_TRANSFORMS: Record<
  number,
  { x: string; y: string; rotate: number }
> = {
  1: { x: '-15%', y: '60%', rotate: 8 },
  2: { x: '-30%', y: '30%', rotate: 4 },
  3: { x: '-20%', y: '40%', rotate: -6 },
  4: { x: '0%', y: '8%', rotate: -8 },
  5: { x: '0%', y: '-20%', rotate: 5 },
  6: { x: '0%', y: '20%', rotate: -3 },
  7: { x: '0%', y: '-40%', rotate: -5 },
  8: { x: '0%', y: '15%', rotate: 10 },
}

interface FancyLinkItem {
  label: string
  href: string
}

const DefaultLinks: FancyLinkItem[] = [
  { label: 'Linkedin', href: 'https://linkedin.com/in/kareemsafwat' },
  { label: 'Email', href: 'mailto:kareemsf1995@gmail.com' },
]

interface FancyTextHoverProps {
  links?: FancyLinkItem[]
  className?: string
}

export default function FancyTextHover({
  links = DefaultLinks,
  className,
}: FancyTextHoverProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      const fancyEls =
        containerRef.current.querySelectorAll<HTMLAnchorElement>('.fancy-word')

      fancyEls.forEach((anchor) => {
        const text = anchor.textContent ?? ''
        anchor.textContent = ''

        text.split('').forEach((char, i) => {
          const outer = document.createElement('span')
          outer.className = 'inline-block'
          gsap.set(outer, {
            transition: 'transform 0.3s cubic-bezier(0.76, 0, 0.24, 1)',
          })

          const inner = document.createElement('span')
          inner.className = 'inline-block'

          const letter = document.createElement('span')
          letter.className = 'inline-block'
          letter.textContent = char

          inner.appendChild(letter)
          outer.appendChild(inner)
          anchor.appendChild(outer)

          const randomDelay = Math.floor(Math.random() * 5)

          const onEnter = () => {
            const childIndex = i + 1
            const transform = SCATTER_TRANSFORMS[childIndex]
            if (transform) {
              gsap.to(outer, {
                xPercent: parseFloat(transform.x),
                yPercent: parseFloat(transform.y),
                rotation: transform.rotate,
                duration: 0.2,
                ease: 'power3.inOut',
              })
            }

            gsap.to(inner, {
              keyframes: [
                { yPercent: 0, duration: 0 },
                { yPercent: -3, duration: 2.5, ease: 'power3.inOut' },
                { yPercent: 0, duration: 2.5, ease: 'power3.inOut' },
              ],
              repeat: -1,
              delay: randomDelay,
            })
          }

          const onLeave = () => {
            gsap.killTweensOf(inner)
            gsap.to(outer, {
              xPercent: 0,
              yPercent: 0,
              rotation: 0,
              duration: 0.35,
              ease: 'power3.inOut',
            })
            gsap.to(inner, {
              yPercent: 0,
              duration: 0.35,
              ease: 'power3.inOut',
            })
          }

          anchor.addEventListener('mouseenter', onEnter)
          anchor.addEventListener('mouseleave', onLeave)
        })
      })
    },
    { scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex w-full flex-col items-center justify-between gap-10 p-10',
        className
      )}
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target='_blank'
          rel='noopener noreferrer'
          className='fancy-word hover:text-primary text-4xl md:text-5xl font-medium uppercase no-underline transition duration-250 ease-[cubic-bezier(0.76,0,0.24,1)]'
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
