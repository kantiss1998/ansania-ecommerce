'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, ReactNode } from 'react';

interface ScrollAnimationProps {
    children: ReactNode;
    variant?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'parallax';
    delay?: number;
    duration?: number;
    className?: string;
}

/**
 * Scroll animation component
 * Animates children when they come into view
 */
export function ScrollAnimation({
    children,
    variant = 'fadeIn',
    delay = 0,
    duration = 0.5,
    className = '',
}: ScrollAnimationProps) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: '-100px' });

    const variants = {
        fadeIn: {
            hidden: { opacity: 0 },
            visible: { opacity: 1 },
        },
        slideUp: {
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0 },
        },
        slideLeft: {
            hidden: { opacity: 0, x: 50 },
            visible: { opacity: 1, x: 0 },
        },
        slideRight: {
            hidden: { opacity: 0, x: -50 },
            visible: { opacity: 1, x: 0 },
        },
        scale: {
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
        },
        parallax: {
            hidden: { opacity: 0, y: 100 },
            visible: { opacity: 1, y: 0 },
        },
    };

    return (
        <motion.div
            ref={ref}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={variants[variant]}
            transition={{
                duration,
                delay,
                ease: 'easeOut',
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

interface ScrollStaggerProps {
    children: ReactNode[];
    staggerDelay?: number;
    variant?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale';
    className?: string;
}

/**
 * Scroll stagger component
 * Animates multiple children with staggered delays
 */
export function ScrollStagger({
    children,
    staggerDelay = 0.1,
    variant = 'slideUp',
    className = '',
}: ScrollStaggerProps) {
    return (
        <div className={className}>
            {children.map((child, index) => (
                <ScrollAnimation
                    key={index}
                    variant={variant}
                    delay={index * staggerDelay}
                >
                    {child}
                </ScrollAnimation>
            ))}
        </div>
    );
}

interface ParallaxProps {
    children: ReactNode;
    speed?: number;
    className?: string;
}

/**
 * Parallax scroll component
 * Creates parallax effect on scroll
 */
export function Parallax({ children, speed = 0.5, className = '' }: ParallaxProps) {
    const ref = useRef(null);

    return (
        <motion.div
            ref={ref}
            className={className}
            style={{
                y: useInView(ref) ? 0 : -50 * speed,
            }}
            transition={{
                duration: 0.5,
                ease: 'easeOut',
            }}
        >
            {children}
        </motion.div>
    );
}
