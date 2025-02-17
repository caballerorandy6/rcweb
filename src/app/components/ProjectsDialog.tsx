//Zustand Store
import { useRCWebStore } from "@/store/rcweb-store";

//Components
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import ProjectsGridDialog from "@/app/components/ProjectsGridDialog";
import Heading from "@/app/components/Heading";
import { CodeBracketIcon } from "@heroicons/react/24/outline";

const ProjectsDialog = () => {
  const { isOpenProjetsDialog, setIsOpenProjetsDialog } = useRCWebStore();

  return (
    <Dialog
      open={isOpenProjetsDialog}
      onClose={() => setIsOpenProjetsDialog(false)}
      className="relative z-10"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-950/80 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto mt-20">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg border-2 border-gold/50 bg-black/90 px-10 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95  w-[80vw] max-w-none max-h-[80vh] overflow-y-auto"
          >
            <Heading icon={<CodeBracketIcon className="w-8 text-gold" />}>
              Projects
            </Heading>
            <ProjectsGridDialog />
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ProjectsDialog;
