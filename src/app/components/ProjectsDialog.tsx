import Image from "next/image";
import Link from "next/link";
import { useRCWeb } from "@/hooks/useRCWeb";
import clsx from "clsx";

//Components
import { Dialog, DialogBackdrop, DialogPanel } from "@headlessui/react";
import GithubIcon from "@/app/components/icons/Github";
import Website from "@/app/components/icons/Website";

import { projects } from "@/app/components/Projects";

const ProjectsDialog = () => {
  const { isOpenProjetsDialog, setIsOpenProjetsDialog } = useRCWeb();

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

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg border-2 border-gold/50 bg-black/90 px-10 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95  w-[80vw] max-w-none max-h-[80vh] overflow-y-auto"
          >
            {
              <ul
                role="list"
                className="grid grid-cols-1 gap-20 p-10 sm:grid-cols-2 md:grid-cols-3 z w-full mx-auto"
              >
                {projects.map((item) => (
                  <li
                    key={item.name}
                    className="col-span-1 flex flex-col h-full bg-gray-900 text-center border border-gold/50 rounded-lg shadow-md hover:shadow-lg transition-shadow animateProjectCard"
                  >
                    <div className="overflow-hidden rounded-t-lg">
                      <Image
                        alt={item.name}
                        src={item.image}
                        width={1000}
                        height={1000}
                        className="w-full h-36 object-cover rounded-t-lg transition-transform duration-300 hover:scale-110"
                      />
                    </div>

                    {/* Technologies */}
                    <div className="p-5 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold text-gold">
                        {item.name}
                      </h3>
                      <p className="mt-2 text-sm text-gray-400">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap justify-center gap-1 mt-4">
                        {item.tecnologies.map((item, index) => (
                          <span
                            key={index}
                            className={clsx(
                              "inline-flex gap-2 items-center rounded-full px-2 py-0.5 text-xs font-medium",
                              {
                                "bg-black/50 text-white": item === "NextJS",
                                "bg-blue-500 text-white": item === "TypeScript",
                                "bg-indigo-500 text-white":
                                  item === "TailwindCSS",
                                "bg-gray-500 text-white": item === "ShadcnUi",
                                "bg-yellow-500 text-black":
                                  item === "JavaScript",
                                "bg-cyan-500 text-white": item === "React",
                                "bg-violet-500 text-white": item === "Vite",
                                "bg-fuchsia-500 text-white": item === "Zod",
                                "bg-white/90 text-blue-700": item === "Zustand",
                                "bg-red-500 text-white": item === "html",
                                "bg-pink-500 text-white": item === "css",
                                "bg-purple-500 text-white": item === "sass",
                              }
                            )}
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex divide-gray-700 border-t border-gold/50 mt-auto">
                      <Link
                        href={item.github}
                        target="_blank"
                        className="flex-1 py-3 text-sm font-semibold text-gold hover:bg-gray-800 transition rounded-bl-lg border-r border-gold/50"
                      >
                        <GithubIcon className="inline-block w-5 h-5 mr-2" />
                        GitHub
                      </Link>
                      <Link
                        href={item.url}
                        target="_blank"
                        className="flex-1 py-3 text-sm font-semibold text-gold hover:bg-gray-800 transition rounded-br-lg"
                      >
                        <Website className="inline-block w-5 h-5 mr-2" />
                        Preview
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            }
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ProjectsDialog;
