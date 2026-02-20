import {
  CheckCircleIcon,
  ClockIcon,
  PlayCircleIcon,
} from "@heroicons/react/24/solid";
import { Milestone } from "@/types/milestone";

type ClientMilestoneViewProps = {
  milestones: Milestone[];
};

export default function ClientMilestoneView({
  milestones,
}: ClientMilestoneViewProps) {
  const completedCount = milestones.filter(
    (m) => m.status === "completed"
  ).length;
  const progressPercent =
    milestones.length > 0
      ? Math.round((completedCount / milestones.length) * 100)
      : 0;

  const getStatusIcon = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircleIcon className="w-6 h-6 text-green-500" />;
      case "in_progress":
        return (
          <PlayCircleIcon className="w-6 h-6 text-blue-500 animate-pulse" />
        );
      default:
        return <ClockIcon className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusLabel = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return "Completed";
      case "in_progress":
        return "In Progress";
      default:
        return "Pending";
    }
  };

  const getStatusBg = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 border-green-500/30";
      case "in_progress":
        return "bg-blue-500/10 border-blue-500/30";
      default:
        return "bg-gray-500/10 border-gray-500/30";
    }
  };

  if (milestones.length === 0) {
    return (
      <div className="text-center py-12 flex flex-col justify-center items-center">
        <ClockIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 font-inter">
          No milestones have been set up yet
        </p>
        <p className="text-gray-500 text-sm font-inter mt-1">
          Check back soon for project updates
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress Overview */}
      <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-white font-inter">
            Overall Progress
          </h3>
          <span className="text-2xl font-bold text-gold font-iceland">
            {progressPercent}%
          </span>
        </div>
        <div className="h-4 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-gold to-yellow-500 transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-gray-400 text-sm mt-3 font-inter">
          {completedCount} of {milestones.length} milestones completed
        </p>
      </div>

      {/* Milestones Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gray-700" />

        <div className="space-y-4">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.id}
              className={`relative flex gap-4 p-4 rounded-xl border ${getStatusBg(milestone.status)} transition-all`}
            >
              {/* Icon with background */}
              <div className="relative z-10 flex-shrink-0 w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center border-2 border-gray-700">
                {getStatusIcon(milestone.status)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-white font-inter">
                      {milestone.title}
                    </h4>
                    {milestone.description && (
                      <p className="text-gray-400 text-sm mt-1 font-inter">
                        {milestone.description}
                      </p>
                    )}
                  </div>
                  <span
                    className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium ${
                      milestone.status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : milestone.status === "in_progress"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-500/20 text-gray-400"
                    }`}
                  >
                    {getStatusLabel(milestone.status)}
                  </span>
                </div>

                {/* Dates */}
                <div className="flex gap-4 mt-2 text-xs text-gray-500 font-inter">
                  {milestone.dueDate && (
                    <span>
                      Due: {new Date(milestone.dueDate).toLocaleDateString()}
                    </span>
                  )}
                  {milestone.completedAt && (
                    <span className="text-green-500">
                      Completed:{" "}
                      {new Date(milestone.completedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Step number */}
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-700/50 flex items-center justify-center">
                <span className="text-xs font-bold text-gray-400">
                  {index + 1}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
