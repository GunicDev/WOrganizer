import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { addTaskToDay, filteredDay, getAllDays } from "../../store/days";
import { fbDays } from "../../API/api";
import Button from "../UI/Button/Button";

import Input from "../UI/Input/Input";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { addNewTask } from "../../store/tasks";

export default function DayDetail() {
  const { dayId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const filteredDayDetail = useSelector((state) => state.days.filteredDay);
  const days = useSelector((state) => state.days.days);
  const isLoading = useSelector((state) => state.days.isLoading);
  const [showAddTasks, setShowAddTasks] = useState(false);

  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (days.length === 0) {
        await dispatch(getAllDays(fbDays));
      }
      dispatch(filteredDay(dayId));
    };

    fetchData();
  }, [dayId, dispatch, days.length]);

  if (isLoading || filteredDayDetail === null) {
    return <p>Loading...</p>;
  }
  const backHandler = () => {
    navigate(-1);
  };

  const showAddTaskHandler = () => {
    setShowAddTasks(!showAddTasks);
  };

  const sendUndoneTasksHandler = () => {
    console.log("clicked send button");
  };

  const taskHandler = (event) => {
    setInputValue(event);
  };

  const sendHandler = async () => {
    if (inputValue.trim() !== "") {
      await dispatch(addNewTask(fbDays, dayId, inputValue));
      dispatch(
        addTaskToDay({
          dayId,
          task: { task: inputValue, done: false },
        })
      );
      dispatch(filteredDay(dayId));
      setInputValue("");
    }
  };

  console.log(filteredDayDetail);

  return (
    <>
      <div className="text-center flex justify-between">
        <h1>{filteredDayDetail.name}</h1>

        <Button
          type="button"
          onClick={showAddTaskHandler}
          bgColor={showAddTasks ? "bg-blue-500" : "bg-blue-700"}
        >
          {showAddTasks ? "Dont show add tasks" : "Show Add tasks"}
        </Button>
      </div>

      {/* Add new Task */}
      {showAddTasks && (
        <div className="flex justify-center mt-11">
          <div className="w-2/3">
            <h4 className=" text-left">Add New Task:</h4>
            <div className="flex flex-row mt-3">
              <div className="w-full">
                <Input onChange={(event) => taskHandler(event.target.value)} />
              </div>
              <div className="mt-2 ml-3">
                <PlusCircleIcon className=" w-7 h-7" onClick={sendHandler} />
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="mt-7 text-center">
        <h1 className="text-xl">{filteredDayDetail.name} tasks:</h1>
        <ul className="mt-7">
          {filteredDayDetail.tasks.map((task, index) => (
            <li key={index}>
              <label htmlFor={index} className="text-3xl">
                {task.task}
              </label>
              <input
                className="ml-3 w-3 h-3"
                type="checkbox"
                id={index}
                name="task"
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-11 flex justify-between">
        <Button
          type="button"
          bgColor={""}
          textColor={"text-white"}
          onClick={backHandler}
        >
          Back
        </Button>
        <Button
          type="button"
          textHover={"hover:text-white"}
          onClick={sendUndoneTasksHandler}
          bgColor={"bg-green-800"}
          textColor={"text-black"}
        >
          Transfer undone tasks to next day
        </Button>
      </div>
    </>
  );
}
