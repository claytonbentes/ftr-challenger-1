import { tv } from "tailwind-variants";

const button = tv({
  base: "flex items-center justify-center rounded-lg disabled:opacity-50 disabled:cursor-not-allowed h-12",
  variants: {
    default: {
      true: "bg-blue hover:bg-blue-dark text-white py-5 gap-3 typography-md",
    },
    secondary: {
      true: "bg-gray-200 hover:bg-gray-200 hover:border hover:border-blue text-gray-500 p-2 gap-1.5 typography-sm-semibold",
    },
  },
  defaultVariants: {
    default: true,
    secondary: false,
  }
});

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  secondary?: boolean,
  icon?: React.ReactNode,
  children?: React.ReactNode | null,
}

export default function Button({ className, secondary = false, children = null, icon, ...props }: Props) {
  return (
    <button className={button({ className, secondary })} {...props}>
      {icon}
      {children}
    </button>
  )
}