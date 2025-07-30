"use client";

import { useRCWebStore } from "@/store/rcweb-store";
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import ProjectsGridDialog from "@/app/components/ProjectsGridDialog";

const ProjectsDialog = () => {
  const { isOpenProjectsDialog, setIsOpenProjectsDialog } = useRCWebStore();

  return (
    <Dialog
      transition
      open={isOpenProjectsDialog}
      onClose={() => setIsOpenProjectsDialog(false)}
      className="fixed inset-0 z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-950/80 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative transform overflow-hidden rounded-lg border-2 border-gold/50 bg-black/90 px-10 pt-16 pb-4 text-left shadow-xl transition-all data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in w-11/12 max-w-none max-h-[80vh] overflow-y-auto flex flex-col items-center"
        >
          <div className="mt-16 w-full flex justify-center">
            <ProjectsGridDialog />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ProjectsDialog;
