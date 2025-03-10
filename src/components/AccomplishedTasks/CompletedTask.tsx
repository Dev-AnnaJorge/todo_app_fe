import { TaskProps } from "@/interfaces";
import { observer } from "mobx-react-lite";
import CompletedSchedule from "./CompletedSchedule";
import CompletedUnSchedule from "./CompletedUnscheduled";

interface CompletedTasksProps {
  completedTasks: TaskProps[];
}
const CompletedTasks: React.FC<CompletedTasksProps> = observer(({ completedTasks }) => {
  return (
    <div className="bg-[#F5E8E8] p-4 rounded-lg shadow-md">
      <h1 className="text-[16px] sm:text-[18px] md:text-xl text-[#4D4C4C] font-semibold"> Daily Accomplishments</h1>
      <div className="bg-transparent p-4 rounded-lg h-[502px] overflow-y-auto scrollbar-hide">
        {completedTasks.length === 0 ? (
          <p className="text-gray-500">No completed tasks available.</p>
        ) : (
          completedTasks.map((task: TaskProps) =>
            task.category === "scheduled" ? (
              <CompletedSchedule key={task.id} task={task} />
            ) : (
              <CompletedUnSchedule key={task.id} task={task} />
            )
          )
        )}
      </div>
    </div>
  );
});

export default CompletedTasks;
