/// <reference types="next" />
/// <reference types="next/image-types/global" />

// Spline custom element
declare namespace JSX {
  interface IntrinsicElements {
    'spline-viewer': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      url?: string;
      ref?: React.RefObject<HTMLElement | null>;
    };
  }
}