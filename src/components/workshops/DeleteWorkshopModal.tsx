import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import type { Workshop } from "@/context/WorkshopsContext";

type Props = {
  workshop: Workshop | null;
  onCancel: () => void;
  onConfirm: () => void;
};

export function DeleteWorkshopModal({ workshop, onCancel, onConfirm }: Props) {
  return (
    <AnimatePresence>
      {workshop && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 z-50 bg-background/60 backdrop-blur-md"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 12 }}
              transition={{ duration: 0.2 }}
              className="pointer-events-auto w-full max-w-md rounded-2xl bg-card border border-border shadow-elegant p-6"
            >
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">Deletar Oficina</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Tem certeza que deseja deletar a oficina{" "}
                    <span className="font-medium text-foreground">"{workshop.title}"</span>?
                    Esta ação não pode ser desfeita.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
                <button
                  onClick={onCancel}
                  className="h-10 px-4 rounded-lg border border-input bg-background text-sm font-medium hover:bg-accent transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={onConfirm}
                  className="h-10 px-4 rounded-lg bg-destructive text-destructive-foreground text-sm font-semibold hover:opacity-90 shadow-elegant transition-opacity"
                >
                  Deletar Oficina
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
