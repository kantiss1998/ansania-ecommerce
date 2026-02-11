'use client';

import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface HoverScaleProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
    scale?: number;
}

/**
 * Hover scale animation
 */
export function HoverScale({ children, scale = 1.05, ...props }: HoverScaleProps) {
    return (
        <motion.div
            whileHover={{ scale }}
            whileTap={{ scale: scale * 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

interface HoverLiftProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
    lift?: number;
}

/**
 * Hover lift animation (moves up)
 */
export function HoverLift({ children, lift = -5, ...props }: HoverLiftProps) {
    return (
        <motion.div
            whileHover={{ y: lift }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

interface HoverGlowProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
    glowColor?: string;
}

/**
 * Hover glow animation
 */
export function HoverGlow({ children, glowColor = 'rgba(99, 102, 241, 0.5)', ...props }: HoverGlowProps) {
    return (
        <motion.div
            whileHover={{
                boxShadow: `0 0 20px ${glowColor}`,
            }}
            transition={{ duration: 0.3 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

interface PulseProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
    scale?: number;
    duration?: number;
}

/**
 * Pulse animation
 */
export function Pulse({ children, scale = 1.05, duration = 1, ...props }: PulseProps) {
    return (
        <motion.div
            animate={{
                scale: [1, scale, 1],
            }}
            transition={{
                duration,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

interface ShakeProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
    trigger?: boolean;
}

/**
 * Shake animation (for errors)
 */
export function Shake({ children, trigger = false, ...props }: ShakeProps) {
    return (
        <motion.div
            animate={
                trigger
                    ? {
                        x: [0, -10, 10, -10, 10, 0],
                    }
                    : {}
            }
            transition={{ duration: 0.5 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

interface BounceProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
}

/**
 * Bounce animation (for success)
 */
export function Bounce({ children, ...props }: BounceProps) {
    return (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
                type: 'spring',
                stiffness: 260,
                damping: 20,
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

interface RotateProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
    degrees?: number;
}

/**
 * Hover rotate animation
 */
export function HoverRotate({ children, degrees = 5, ...props }: RotateProps) {
    return (
        <motion.div
            whileHover={{ rotate: degrees }}
            transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

interface SlideInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
    direction?: 'left' | 'right' | 'up' | 'down';
    delay?: number;
}

/**
 * Slide in animation
 */
export function SlideIn({ children, direction = 'up', delay = 0, ...props }: SlideInProps) {
    const directions = {
        left: { x: -100 },
        right: { x: 100 },
        up: { y: 100 },
        down: { y: -100 },
    };

    return (
        <motion.div
            initial={{ opacity: 0, ...directions[direction] }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ delay, duration: 0.5, ease: 'easeOut' }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

interface FadeInProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
    delay?: number;
}

/**
 * Fade in animation
 */
export function FadeIn({ children, delay = 0, ...props }: FadeInProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay, duration: 0.5 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}

interface StaggerContainerProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
    children: ReactNode;
    staggerDelay?: number;
}

/**
 * Stagger container for animating children
 */
export function StaggerContainer({ children, staggerDelay = 0.1, ...props }: StaggerContainerProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                    },
                },
            }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
