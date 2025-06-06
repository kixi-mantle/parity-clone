"use client"

import { useTheme } from "next-themes"
import React from "react"
import { Toaster as Sonner, ToasterProps } from "sonner"
import { toast as sonnerToast} from "sonner"


type CustomToastProps = {
  title?: string , 
  description?: string , 
  variant? : "default" | "destructive" | "success",
  action? : {
    label : string,
    onClick: () => void
  }
} & ToasterProps



export const customToast = ({
  title,
  description,
  variant = "default",
  ...props
}: CustomToastProps) => {
  switch (variant) {
    case "destructive":
      return sonnerToast.error(title, {
        description,
        ...props,
      })
    case "success":
      return sonnerToast.success(title, {
        description,
        ...props,
      })
    default:
      return sonnerToast(title, {
        description,
        ...props,
      })
  }
}

const Toaster = ({  ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
         
        } as React.CSSProperties
      }
      {...props}
    />
  )
}

export { Toaster  }
