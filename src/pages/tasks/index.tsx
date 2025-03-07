import React, { useEffect, useState } from "react";
import TaskContainer from "@/components/TaskContainer";
import { TaskProps } from "@/interfaces";
import { initialCompletedTasks, initialTasks } from "../../datasamples/dataExample";
import { observer } from "mobx-react-lite";
import fetchStore from "@/stores/fetchStore";
import { format } from "date-fns"; // Import format from date-fns
import TaskTrackerLogin from "../login/TaskTrackerLogin";
import NavBar from "@/components/Navbar/navBar";

const TaskPage: React.FC = observer(() => {
  const [tasks, setTasks] = useState<TaskProps[]>(initialTasks);
  const [isClient, setIsClient] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduled, setScheduled] = useState(true);
  const category = scheduled ? "scheduled" : "unscheduled";
  const userId = fetchStore.user ? fetchStore.user.userId : undefined; 



  useEffect(() => {
    setIsClient(true);
    if (userId !== undefined) {
      fetchStore.fetchTodos(userId);
    }
  }, [selectedDate,scheduled]);

  const handleAddTask = (newTask: TaskProps) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };
  return (
    <div className="">
      <TaskTrackerLogin/>
    </div>
  );
});

export default TaskPage;
