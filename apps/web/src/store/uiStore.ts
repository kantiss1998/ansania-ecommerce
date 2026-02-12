import { create } from "zustand";

/**
 * Toast/notification type
 */
interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  message: string;
  duration?: number;
}

/**
 * UI store state interface
 */
interface UiState {
  // Modal state
  isModalOpen: boolean;
  modalContent: React.ReactNode | null;

  // Mobile menu state
  isMobileMenuOpen: boolean;

  // Cart drawer state
  isCartDrawerOpen: boolean;

  // Toast notifications
  toasts: Toast[];

  // Loading state
  isGlobalLoading: boolean;

  // Actions
  openModal: (content: React.ReactNode) => void;
  closeModal: () => void;
  toggleMobileMenu: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  showToast: (type: Toast["type"], message: string, duration?: number) => void;
  removeToast: (id: string) => void;
  setGlobalLoading: (isLoading: boolean) => void;
}

/**
 * UI store using Zustand
 * Manages global UI state (modals, toasts, mobile menu, etc.)
 */
export const useUiStore = create<UiState>((set) => ({
  // Initial state
  isModalOpen: false,
  modalContent: null,
  isMobileMenuOpen: false,
  isCartDrawerOpen: false,
  toasts: [],
  isGlobalLoading: false,

  // Modal actions
  openModal: (content) => {
    set({
      isModalOpen: true,
      modalContent: content,
    });
  },

  closeModal: () => {
    set({
      isModalOpen: false,
      modalContent: null,
    });
  },

  // Mobile menu actions
  toggleMobileMenu: () => {
    set((state) => ({
      isMobileMenuOpen: !state.isMobileMenuOpen,
    }));
  },

  // Cart drawer actions
  openCartDrawer: () => {
    set({ isCartDrawerOpen: true });
  },

  closeCartDrawer: () => {
    set({ isCartDrawerOpen: false });
  },

  // Toast actions
  showToast: (type, message, duration = 5000) => {
    const id = Math.random().toString(36).substring(7);
    const toast: Toast = { id, type, message, duration };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Global loading
  setGlobalLoading: (isLoading) => {
    set({ isGlobalLoading: isLoading });
  },
}));
