const base = {
  width: 22,
  height: 22,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
};

export const CartIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M6 7h12l-1 13H7L6 7z" />
    <path d="M9 7a3 3 0 0 1 6 0" />
  </svg>
);

export const UserIcon = (props) => (
  <svg {...base} {...props}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21a8 8 0 0 1 16 0" />
  </svg>
);

export const MenuIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M4 8h16M4 16h16" />
  </svg>
);

export const CloseIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const ArrowRightIcon = (props) => (
  <svg {...base} width={18} height={18} {...props}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

export const MinusIcon = (props) => (
  <svg {...base} width={16} height={16} {...props}>
    <path d="M5 12h14" />
  </svg>
);

export const PlusIcon = (props) => (
  <svg {...base} width={16} height={16} {...props}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const TruckIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M3 6h11v10H3zM14 10h4l3 3v3h-7" />
    <circle cx="7" cy="18" r="2" />
    <circle cx="17.5" cy="18" r="2" />
  </svg>
);

export const ShieldIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
);

export const ReturnIcon = (props) => (
  <svg {...base} {...props}>
    <path d="M9 14l-5-5 5-5" />
    <path d="M4 9h10a6 6 0 0 1 0 12h-3" />
  </svg>
);

export const CheckIcon = (props) => (
  <svg {...base} width={18} height={18} {...props}>
    <path d="M5 12.5l4.5 4.5L19 7" />
  </svg>
);
