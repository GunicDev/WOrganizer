import { createSlice } from "@reduxjs/toolkit";
import { allDays, postDay } from "../helper/fetch";

const initialState = {
  days: [],
  filteredDay: null,
  uploadMessage: false,
  isLoading: true,
  setError: false,
};

const days = createSlice({
  name: "days",
  initialState,
  reducers: {
    setDay(state, action) {
      // Ensure each day has a tasks array
      state.days = action.payload.map((day) => ({
        ...day,
        tasks: Object.values(day.tasks),
      }));
    },
    setError(state, action) {
      state.setError = action.payload;
    },
    setIsLoading(state, action) {
      state.isLoading = action.payload;
    },
    setUploadMessage(state, action) {
      state.uploadMessage = action.payload;
    },
    addDaySuccess(state, action) {
      state.days.push(action.payload);
    },
    setFilteredDay(state, action) {
      state.filteredDay = state.days.find((day) => day.id === action.payload);
    },
    addTaskToDay(state, action) {
      const { dayId, task } = action.payload;
      console.log(task, "task inside addtasToDay");
      return {
        ...state,
        days: state.days.map((day) =>
          day.id === dayId ? { ...day, tasks: [...day.tasks, task] } : day
        ),
      };
    },
    updateDay(state, action) {
      const { id, done } = action.payload;

      console.log(done);
      return {
        ...state,
        tasks: state.filteredDay.tasks.map((task) =>
          task.id === id ? { ...task, done: done } : task
        ),
      };
    },
    updateFilteredDayTask(state, action) {
      const { taskId, done } = action.payload;
      const task = state.filteredDay.tasks.find((task) => task.id === taskId);
      if (task) {
        task.done = done;
      }
    },
  },
});

export const {
  setDay,
  setError,
  setIsLoading,
  setUploadMessage,
  addDaySuccess,
  setFilteredDay,
  addTaskToDay,
  updateDay,
  updateFilteredDayTask,
} = days.actions;

export const getAllDays = (url) => async (dispatch) => {
  try {
    dispatch(setIsLoading(true));
    const data = await allDays(url);

    data[0].tasks = Object.values(data[0].tasks);

    dispatch(setDay(data));
    dispatch(setIsLoading(false));
  } catch (error) {
    console.error(error);
    dispatch(setError(true));
    dispatch(setIsLoading(false));
  }
};

export const newDay = (url, data) => async (dispatch) => {
  try {
    dispatch(setIsLoading(true));

    const newKeyRef = await fetch(`${url}.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    });

    if (!newKeyRef.ok) {
      throw new Error("Failed to generate key from Firebase");
    }

    const keyData = await newKeyRef.json();
    const key = keyData.name;

    const newEntry = { id: key, name: data, tasks: "" };

    await postDay(url, key, newEntry);

    dispatch(addDaySuccess(newEntry));
    dispatch(setUploadMessage(true));
  } catch (error) {
    console.error("Error:", error);
    dispatch(setError(true));
  } finally {
    dispatch(setIsLoading(false));
  }
};

export const filteredDay = (id) => async (dispatch) => {
  try {
    dispatch(setIsLoading(true));
    dispatch(setFilteredDay(id));
    dispatch(setIsLoading(false));
  } catch (error) {
    console.error("Error:", error);
    dispatch(setError(true));
  }
};

export default days;
