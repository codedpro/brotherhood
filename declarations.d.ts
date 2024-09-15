
declare module "react-archer";
declare module "gsap";
declare module 'tailwindcss';
declare namespace JSX {
    interface IntrinsicElements {
      'lottie-player': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
        autoplay?: boolean;
        loop?: boolean;
        mode?: string;
        src?: string;
        style?: React.CSSProperties;
      };
    }
  }
  