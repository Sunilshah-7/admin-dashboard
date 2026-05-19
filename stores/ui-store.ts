import { create } from "zustand";

type ModalId = "invite-member" | "deploy-model" | "deployment-logs" | "api-key" | "confirm-action";

type ToastIntent = "info" | "success" | "warning" | "error";

type QueuedToast = {
  id: string;
  title: string;
  description?: string;
  intent: ToastIntent;
};

type ToastPayload = Omit<QueuedToast, "id"> & {
  id?: string;
};

type UiState = {
  isSidebarCollapsed: boolean;
  isMobileSidebarOpen: boolean;
  activeModal: ModalId | null;
  toastQueue: QueuedToast[];
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebarCollapsed: () => void;
  setMobileSidebarOpen: (open: boolean) => void;
  openModal: (modal: ModalId) => void;
  closeModal: () => void;
  enqueueToast: (toast: ToastPayload) => string;
  dismissToast: (id: string) => void;
  clearToasts: () => void;
};

function createToastId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

const useUiStore = create<UiState>((set) => ({
  isSidebarCollapsed: false,
  isMobileSidebarOpen: false,
  activeModal: null,
  toastQueue: [],
  setSidebarCollapsed: (collapsed) => set({ isSidebarCollapsed: collapsed }),
  toggleSidebarCollapsed: () =>
    set((state) => ({
      isSidebarCollapsed: !state.isSidebarCollapsed,
    })),
  setMobileSidebarOpen: (open) => set({ isMobileSidebarOpen: open }),
  openModal: (modal) => set({ activeModal: modal }),
  closeModal: () => set({ activeModal: null }),
  enqueueToast: (toast) => {
    const id = toast.id ?? createToastId();

    set((state) => ({
      toastQueue: [
        ...state.toastQueue,
        {
          ...toast,
          id,
        },
      ],
    }));

    return id;
  },
  dismissToast: (id) =>
    set((state) => ({
      toastQueue: state.toastQueue.filter((toast) => toast.id !== id),
    })),
  clearToasts: () => set({ toastQueue: [] }),
}));

export { useUiStore };
export type { ModalId, QueuedToast, ToastIntent, ToastPayload };
