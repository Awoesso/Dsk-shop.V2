import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

// Easing standard: ease-out ([0.16, 1, 0.3, 1] ou "easeOut")
const easeOut = [0.16, 1, 0.3, 1] as const;

/**
 * 1. Apparition des sections
 * Opacity 0 -> 1, translateY(20px) -> 0
 * Durée: 500ms (ou 600ms pour les grandes sections)
 */
interface ScrollSectionProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
  isLarge?: boolean;
}

export const ScrollSection: React.FC<ScrollSectionProps> = ({
  children,
  className = '',
  isLarge = false,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        duration: isLarge ? 0.6 : 0.5,
        ease: 'easeOut',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * 2. Titres
 * Fade + montée légère (15px) en 450ms
 */
interface ScrollTitleProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

export const ScrollTitle: React.FC<ScrollTitleProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * 3. Paragraphes
 * Fade + montée avec décalage de ~80ms en 500ms
 */
interface ScrollParagraphProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

export const ScrollParagraph: React.FC<ScrollParagraphProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.5, delay: 0.08, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * 4. Cartes produits & items décalés
 * Fade + montée (16px) en 450ms avec décalage de ~60ms entre cartes (plafonné à 240ms)
 */
interface StaggerItemProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  index?: number;
  className?: string;
}

export const StaggerItem: React.FC<StaggerItemProps> = ({
  children,
  index = 0,
  className = '',
  ...props
}) => {
  const delay = Math.min(index * 0.06, 0.24);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.45, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * 5. Catégories
 * Fade + montée en 400ms avec décalage léger (50ms)
 */
export const CategoryStaggerItem: React.FC<StaggerItemProps> = ({
  children,
  index = 0,
  className = '',
  ...props
}) => {
  const delay = Math.min(index * 0.05, 0.2);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15px' }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

/**
 * 6. Images principales
 * Fade + scale léger (0.97 -> 1) en 600ms
 */
interface ScrollImageProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  className?: string;
}

export const ScrollImage: React.FC<ScrollImageProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};
