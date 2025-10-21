import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface AnimatedCaptionProps {
  text: string;
  isVisible: boolean;
  duration?: number;
  style?: "reel" | "classic" | "bounce" | "slide";
  position?: "bottom" | "center" | "top";
  theme?: {
    fontSize: number;
    fontFamily: string;
    color: string;
    backgroundColor: string;
    padding: number;
    borderRadius: number;
  };
}

const AnimatedCaption: React.FC<AnimatedCaptionProps> = ({
  text,
  isVisible,
  style = "reel",
  position = "bottom",
  theme,
}) => {
  const getAnimationVariants = () => {
    switch (style) {
      case "reel":
        return {
          initial: {
            opacity: 0,
            y: 50,
            scale: 0.8,
            filter: "blur(10px)",
          },
          animate: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          },
          exit: {
            opacity: 0,
            y: -30,
            scale: 0.9,
            filter: "blur(5px)",
          },
        };
      case "bounce":
        return {
          initial: {
            opacity: 0,
            y: 100,
            scale: 0.3,
          },
          animate: {
            opacity: 1,
            y: 0,
            scale: 1,
          },
          exit: {
            opacity: 0,
            y: -50,
            scale: 0.5,
          },
        };
      case "slide":
        return {
          initial: {
            opacity: 0,
            x: -100,
          },
          animate: {
            opacity: 1,
            x: 0,
          },
          exit: {
            opacity: 0,
            x: 100,
          },
        };
      default:
        return {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -20 },
        };
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case "top":
        return { top: "20px" };
      case "center":
        return { top: "50%", transform: "translateY(-50%)" };
      case "bottom":
      default:
        return { bottom: "80px" }; // Moved up to avoid overlapping with controls
    }
  };

  const variants = getAnimationVariants();

  return (
    <div
      className="caption-container"
      style={{
        position: "absolute",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 10,
        width: "90%",
        maxWidth: "800px",
        ...getPositionStyles(),
      }}
    >
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={text}
            initial={variants.initial}
            animate={variants.animate}
            exit={variants.exit}
            transition={{
              duration: 0.5,
              ease: style === "reel" ? [0.25, 0.46, 0.45, 0.94] : "easeOut",
            }}
            className={`caption-text caption-${style}`}
            style={{
              background: theme?.backgroundColor ?? "rgba(0, 0, 0, 0.8)",
              color: theme?.color ?? "white",
              padding: theme
                ? `${theme.padding}px ${theme.padding * 2}px`
                : "12px 24px",
              borderRadius: theme ? `${theme.borderRadius}px` : "25px",
              fontSize: theme ? `${theme.fontSize / 16}rem` : "1.2rem",
              fontFamily: theme?.fontFamily ?? undefined,
              fontWeight: "600",
              textAlign: "center",
              lineHeight: "1.4",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
              wordBreak: "break-word",
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AnimatedCaption;
