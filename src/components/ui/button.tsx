import * as React from "react"

interface ButtonProps extends React.ComponentProps<"button"> {
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  children: React.ReactNode
}

function Button({
  className,
  iconLeft,
  iconRight,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${className || ''}`}
      {...props}
    >
      {iconLeft && <div className={styles.icon}>{iconLeft}</div>}
      {children}
      {iconRight && <div className={styles.icon}>{iconRight}</div>}
    </button>
  )
}

const styles = {
  button: `
    inline-flex items-center justify-center gap-2 
    whitespace-nowrap rounded-md text-sm font-medium 
    transition-all disabled:pointer-events-none 
    disabled:opacity-50 outline-none
    h-10 px-4 py-2 w-full
    bg-primary font-bold shadow-xs hover:bg-primary/90 text-white
    focus-visible:border-ring focus-visible:ring-ring/50 
    focus-visible:ring-[3px]
  `,
  icon: `
    flex items-center justify-center pointer-events-none
    [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 
    shrink-0 [&_svg]:shrink-0
  `
}

export { Button }
