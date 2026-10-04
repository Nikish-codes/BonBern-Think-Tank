"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type FontStyle = React.CSSProperties;

type TransitionValue = {
    type?: string;
    duration?: number;
    delay?: number;
    ease?: string | number[];
    staggerChildren?: number;
};

type StaggerFrom = "start" | "center" | "end" | "random";
type TextTag = "p" | "span" | "div" | "section";

type Props = {
    text?: string;
    font?: FontStyle;
    color?: string;

    staggerFrom?: StaggerFrom;
    tag?: TextTag;

    transition?: TransitionValue;
};

const mapEase = (ease: TransitionValue["ease"]): string => {
    if (typeof ease !== "string") return "power2.out";

    const easeMap: Record<string, string> = {
        linear: "none",
        easeIn: "power2.in",
        easeOut: "power2.out",
        easeInOut: "power2.inOut",
        circIn: "circ.in",
        circOut: "circ.out",
        circInOut: "circ.inOut",
        backIn: "back.in",
        backOut: "back.out(1.7)",
        backInOut: "back.inOut",
        anticipate: "back.out(1.7)",
    };

    return easeMap[ease] ?? ease;
};

function __OriginkitBase_InkdropSpread({
    text = "Text bleeds outward from the center, spreading like ink on paper. Each word radiates from the middle.",
    font = {
        fontFamily: "Inter, system-ui, sans-serif",
        fontSize: "70px",
        fontWeight: 600,
        letterSpacing: "-0.025em",
        lineHeight: "1.1em",
        textAlign: "left",
    },
    color = "#ffffff",

    staggerFrom = "center",
    tag = "p",

    transition = {
        type: "tween",
        duration: 1.2,
        delay: 0,
        ease: "easeOut",
        staggerChildren: 0.05,
    },
}: Props) {
    const containerRef = useRef<HTMLElement>(null);
    const words = text.trim().split(/\s+/).filter(Boolean);
    const textAlign =
        (font.textAlign as React.CSSProperties["textAlign"]) ?? "left";

    useEffect(() => {
        if (!containerRef.current) return;

        const wordEls = containerRef.current.querySelectorAll(".word");

        gsap.killTweensOf(wordEls);

        gsap.set(wordEls, {
            clearProps: "transform,opacity,filter",
        });

        const anim = gsap.from(wordEls, {
            opacity: 0,
            scale: 0.6,
            filter: "blur(20px)",

            duration: 0.6,
            delay: 0,
            stagger: {
                each: 0.02,
                from: staggerFrom,
            },
            ease: mapEase(transition.ease),
            paused: true
        });

        // Use IntersectionObserver which ignores pin spacing issues and purely checks viewport visibility
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                anim.play();
                observer.disconnect();
            }
        }, { threshold: 0.3 });

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [text, staggerFrom, transition]);

    return React.createElement(
        tag,
        {
            ref: containerRef,
            style: {
                margin: 0,
                display: "block",
                width: "100%",
                whiteSpace: "pre-wrap",
                color,
                ...font,
                textAlign,
            },
        },
        words.map((word, index) => (
            <React.Fragment key={`${word}-${index}`}>
                <span
                    className="word"
                    style={{
                        display: "inline-block",
                    }}
                >
                    {word}
                </span>
                {index < words.length - 1 ? " " : null}
            </React.Fragment>
        ))
    );
}

const __originkitPresetProps = {
  "text": "We believe exceptional experiences begin with clarity, evolve through creativity, and are perfected through relentless attention to detail.",
  "staggerFrom": "center",
  "tag": "div"
};

export default function InkdropSpread(props: Record<string, unknown>) {
  return <__OriginkitBase_InkdropSpread {...(__originkitPresetProps as Record<string, unknown>)} {...props} />;
}
