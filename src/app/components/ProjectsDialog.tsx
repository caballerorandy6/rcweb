//Zustand Store
import { useRCWebStore } from "@/store/rcweb-store";

//Components
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import ProjectsGridDialog from "@/app/components/ProjectsGridDialog";
import { CodeBracketIcon } from "@heroicons/react/24/outline";

const ProjectsDialog = () => {
  const { isOpenProjetsDialog, setIsOpenProjetsDialog } = useRCWebStore();

  return (
    <Dialog
      open={isOpenProjetsDialog}
      onClose={() => setIsOpenProjetsDialog(false)}
      className="fixed inset-0 z-50"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-950/80 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          transition
          className="relative transform overflow-hidden rounded-lg border-2 border-gold/50 bg-black/90 px-10 pt-16 pb-4 text-left shadow-xl transition-all data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:p-6 w-[80vw] max-w-none max-h-[80vh] overflow-y-auto flex flex-col items-center"
        >
          {/* Encabezado centrado y fijo */}
          <h3 className="sticky top-0 z-10 w-fit flex items-center gap-x-2 text-gold font-mono font-bold text-3xl bg-black/80 px-6 py-4 animateHeadingDialog rounded-full left-1/2 -translate-x-1/2">
            <CodeBracketIcon className="w-8 text-gold" />
            <span>Projects</span>
          </h3>

          {/* Contenido desplazable */}
          <div className="mt-16 w-full flex justify-center">
            <ProjectsGridDialog />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default ProjectsDialog;
