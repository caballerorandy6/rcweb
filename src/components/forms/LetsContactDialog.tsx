import { useRCWebStore } from "@/store/rcweb-store";
import dynamic from "next/dynamic";

//Components
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";

// Dynamic import - reCAPTCHA solo carga cuando el dialog se abre
const DialogForm = dynamic(() => import("./DialogForm"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const LetsContactDialog = () => {
  const { isOpenLetsContactDialog, setOpenLetsContactDialog } = useRCWebStore();

  return (
    <Dialog
      open={isOpenLetsContactDialog}
      onClose={() => setOpenLetsContactDialog(false)}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-950/80 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg border-2 border-gold/50 bg-black/90 px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95 sm:w-10/12 md:w-8/12 lg:w-6/12 mx-auto"
          >
            <div className="mx-auto">
              <DialogForm closeModal={() => setOpenLetsContactDialog(false)} />
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default LetsContactDialog;
