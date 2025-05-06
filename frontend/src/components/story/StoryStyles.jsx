const StoryStyles = () => {
  return (
    <style>{`
      .paper-texture {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E"),
          url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23000000' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
        background-color: rgba(255, 255, 255, 0.4);
        backdrop-filter: brightness(1.02);
      }
      /* New styles for handwritten text effect */
      .paper-background {
        min-height: 300px;
        transform: rotate(-1deg);
      }
      .notebook-lines {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: repeating-linear-gradient(
          0deg,
          transparent,
          transparent 27px,
          #e0e0e0 27px,
          #e0e0e0 28px
        );
        opacity: 0.6;
      }
      /* Base handwritten text styles for light mode */
      .handwritten-text-custom {
        font-family: 'Caveat', 'Shadows Into Light', 'Architects Daughter', 'Kalam', 'Dancing Script', cursive;
        line-height: 1.8;
        letter-spacing: 0.04em;
        word-spacing: 0.5em;
        transform: rotate(0.5deg);
        color: #555555; /* Lighter gray color for better readability */
        text-shadow: 2px 2px 4px rgba(125,83,220,0.2), 
                     0 0 3px rgba(66,153,225,0.2),
                     1px 1px 2px rgba(249,115,22,0.15);
        font-weight: 500; /* Reduced from 700 to be less bold */
      }
      
      /* Theme-specific color variations */
      .handwritten-text-custom.fantasy-theme {
        color: #7c5ac2; /* Lighter purple */
        text-shadow: 2px 2px 4px rgba(147,112,219,0.3),
                     0 0 8px rgba(128,90,213,0.2),
                     1px 1px 2px rgba(186,156,240,0.25);
      }
      .handwritten-text-custom.adventure-theme {
        color: #d97706; /* Lighter amber */
        text-shadow: 2px 2px 4px rgba(245,158,11,0.3),
                     0 0 8px rgba(217,119,6,0.2),
                     1px 1px 2px rgba(251,191,36,0.25);
      }
      .handwritten-text-custom.default-theme {
        color: #3b82f6; /* Lighter blue */
        text-shadow: 2px 2px 4px rgba(59,130,246,0.3),
                     0 0 8px rgba(37,99,235,0.2),
                     1px 1px 2px rgba(147,197,253,0.25);
      }
      
      /* Dark mode specific styles that override the light mode */
      .dark .handwritten-text-custom {
        color: #ffffff !important; /* Force white text in dark mode */
        text-shadow: 2px 2px 5px rgba(0,0,0,0.5), 
                     0 0 10px rgba(100,100,255,0.3), 
                     1px 1px 3px rgba(0,0,0,0.4);
      }
      
      /* Existing styles */
      .section {
        position: relative;
        z-index: 1;
      }
      .section::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: linear-gradient(
          rgba(255, 255, 255, 0.05) 1px,
          transparent 16%
        ),
        linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
        background-size: 100px 100px, 100px 100px, 20px 20px, 20px 20px;
        background-position: -1px -1px, -1px -1px;
        z-index: -1;
        opacity: 0.15;
        pointer-events: none;
      }
      
      .paper-fold-right {
        box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1) inset;
        background: linear-gradient(
          to right,
          transparent,
          rgba(0, 0, 0, 0.08)
        );
      }

      .paper-fold-left {
        box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1) inset;
        background: linear-gradient(
          to left,
          transparent,
          rgba(0, 0, 0, 0.08)
        );
      }

      .paper-fold-bottom {
        box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1) inset;
        background: linear-gradient(
          to bottom,
          transparent,
          rgba(0, 0, 0, 0.08)
        );
      }

      /* Kapak sayfası için ek doku efekti */
      .section:first-child::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.03' fill-rule='evenodd'%3E%3Cpath d='M0 38.59l2.83-2.83 1.41 1.41L1.41 40H0v-1.41zM0 1.4l2.83 2.83 1.41-1.41L1.41 0H0v1.41zM38.59 40l-2.83-2.83 1.41-1.41L40 38.59V40h-1.41zM40 1.41l-2.83 2.83-1.41-1.41L38.59 0H40v1.41zM20 18.6l2.83-2.83 1.41 1.41L21.41 20l2.83 2.83-1.41 1.41L20 21.41l-2.83 2.83-1.41-1.41L18.59 20l-2.83-2.83 1.41-1.41L20 18.59z'/%3E%3C/g%3E%3C/svg%3E");
        opacity: 0.15;
        z-index: -1;
        pointer-events: none;
      }

      .book-content {
        filter: drop-shadow(0 8px 10px rgba(0, 0, 0, 0.15));
      }

      /* Sayfalara eski kitap görünümü için sarımsı/eskimiş renk tonu */
      .bg-\[\#fffef8\\],
      .bg-\[\#fff9e6\],
      .bg-\[\#f5f5f0\],
      .bg-\[\#fafaf2\] {
        background-attachment: fixed;
        background-image: radial-gradient(rgba(165, 140, 80, 0.03) 15%, transparent 20%),
          radial-gradient(rgba(165, 140, 80, 0.06) 15%, transparent 16%);
      }

      @media (prefers-color-scheme: dark) {
        .paper-texture {
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.04' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E"),
            url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23FFFFFF' fill-opacity='0.05' fill-rule='evenodd'/%3E%3C/svg%3E");
        }

        .section::before {
          background-image: linear-gradient(
            rgba(255, 255, 255, 0.05) 1px,
            transparent 16%
          ),
          linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
        }
      }
    `}</style>
  );
};

export default StoryStyles;
