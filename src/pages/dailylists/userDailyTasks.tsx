import React, { useEffect, useState } from "react";
import { TaskProps } from "@/interfaces";
import { initialCompletedTasks, initialTasks } from "../../datasamples/dataExample";
import { observer } from "mobx-react-lite";
import fetchStore from "@/stores/fetchStore";
import NavBar from "@/components/Navbar/navBar";
import DailyLists from "../tasks/DailyLists";
import CollapsibleTasks from "@/components/AllTasks/CollapsibleTasks";

const TaskPage: React.FC = observer(() => {
  const [tasks, setTasks] = useState<TaskProps[]>(initialTasks);
  const [isClient, setIsClient] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>("dailyList");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [scheduled, setScheduled] = useState(true);
  const category = scheduled ? "scheduled" : "unscheduled";

  useEffect(() => {
    setIsClient(true);
    if (fetchStore.user) {
      fetchStore.fetchTodosToday(fetchStore.user.userId);
    }
  }, [selectedDate,scheduled]);


    const handleMenuSelect = (menu: string) => {
        setActiveMenu(menu);
      };

    return (
      <div className="m-0 md:m-0 lg:m-0">
          <NavBar onSelectMenu={handleMenuSelect} activeMenu={activeMenu} />
    
          {/* Conditional rendering based on active menu */}
          <div className="m-0 sm:m-0">
            {activeMenu === "dailyList" && (
              <DailyLists selectedDate={selectedDate} tasks={fetchStore.tasksToday} />
            )}
            {activeMenu === "tasksOverview" && (
          <CollapsibleTasks tasks={fetchStore.tasks} />
            )}
          </div>
        </div>
      );
});

export default TaskPage;
