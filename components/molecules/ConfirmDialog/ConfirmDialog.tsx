"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/atoms/Button"

export interface ConfirmDialogProps {
  /** Controlled open state. */
  open?: boolean
  /** Fires when the dialog requests open/close. */
  onOpenChange?: (open: boolean) => void
  /** Dialog headline. */
  title: string
  /** Explains the consequence of confirming. */
  description?: React.ReactNode
  /** Confirm button label. */
  confirmLabel?: string
  /** Cancel button label. */
  cancelLabel?: string
  /** Destructive variant: confirm renders the danger button. */
  destructive?: boolean
  /** Shows a spinner in the confirm button (async actions). */
  confirmLoading?: boolean
  /** Fires when confirm is pressed. Close the dialog yourself. */
  onConfirm?: () => void
  /** Optional trigger element (e.g. a "Delete" button). */
  children?: React.ReactElement
}

/**
 * Eque confirmation dialog molecule (2.15) — title, description,
 * cancel/confirm actions. The destructive variant uses the danger
 * button for confirm. Uncontrolled-friendly: pass `children` as the
 * trigger and skip `open` entirely, or control it yourself.
 */
function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  confirmLoading = false,
  onConfirm,
  children,
}: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children ? (
        <DialogTrigger render={children} />
      ) : null}
      <DialogContent data-variant={destructive ? "destructive" : "default"}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? (
            <DialogDescription>{description}</DialogDescription>
          ) : null}
        </DialogHeader>
        <DialogFooter>
          <DialogTrigger
            render={<Button variant="secondary" disabled={confirmLoading} />}
          >
            {cancelLabel}
          </DialogTrigger>
          <Button
            variant={destructive ? "danger" : "primary"}
            loading={confirmLoading}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export { ConfirmDialog }
