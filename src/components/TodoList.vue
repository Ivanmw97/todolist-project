<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
    <div class="max-w-xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">

      <div class="flex items-center justify-between mb-4">

        <h1 class="text-2xl font-bold text-gray-800 dark:text-gray-100 pt-3 mb-4">TODO List</h1>

        <!-- Button to toggle between modes -->
        <button
          @click="toggleDarkMode"
          class="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 p-2 rounded-full focus:outline-none items-center"
          aria-label="Toggle Dark Mode"
        >
          <template v-if="state.isDarkMode">
            <!-- Sun icon for light mode -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2"
                d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
            </svg>
          </template>
          <template v-else>
            <!-- Moon icon for dark mode -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2"
                d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
            </svg>
          </template>
        </button>
      </div>

      <!-- Form to add tasks -->
      <form @submit.prevent="addTask" class="flex items-center mb-4">
        <input
          type="text"
          v-model="state.newTask"
          placeholder="Add a new task"
          class="flex-grow border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <!-- Priority selector -->
        <select
          v-model="state.newPriority"
          class="w-full max-w-[150px] border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="High">High</option>
          <option value="Medium" selected>Medium</option>
          <option value="Low">Low</option>
        </select>
        <button
          type="submit"
          class="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
      </form>

      <!-- Task counter -->
      <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
        <span>Total Tasks: {{ state.tasks.length }}</span>
      </div>

      <div class="flex justify-between items-center mb-4">
       <!-- Filters -->
        <div class="flex space-x-2">
          <button
            @click="setFilter('all')"
            :class="state.filter === 'all' ? activeFilterClass : defaultFilterClass"
          >
            All
          </button>
          <button
            @click="setFilter('pending')"
            :class="state.filter === 'pending' ? activeFilterClass : defaultFilterClass"
          >
            Pending
          </button>
          <button
            @click="setFilter('completed')"
            :class="state.filter === 'completed' ? activeFilterClass : defaultFilterClass"
          >
            Completed
          </button>
        </div>
        <!-- Filter by priority -->
        <div class="flex items-center space-x-2">
          <label for="priority-filter" class="text-sm font-bold text-gray-700 dark:text-gray-300">Priority:</label>
          <div class="relative">
            <select
              id="priority-filter"
              v-model="state.priorityFilter"
              class="appearance-none bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-100 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M5.293 9.293L7.586 11.586C7.976 11.976 8.424 12 8.828 12s.852-.024 1.242-.414l2.293-2.293c.63-.63.184-1.707-.707-1.707H6c-.89 0-1.337 1.077-.707 1.707z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Task list -->
      <transition-group
        name="task"
        tag="ul"
        class="space-y-2"
      >
        <li
          v-for="task in filteredTasks"
          :key="task.id"
          class="flex items-center justify-between bg-gray-50 dark:bg-gray-700 px-4 py-2 rounded-lg shadow-sm"
        >
          <div>
            <span :class="{ 'line-through text-gray-400 dark:text-gray-500': task.completed }" class="block font-medium">
              {{ task.text }}
            </span>
            <span
              class="inline-block px-1 py-0.5 text-[10px] font-bold rounded mt-1"
              :class="{
                'bg-red-500 text-white': task.priority === 'High',
                'bg-yellow-500 text-white': task.priority === 'Medium',
                'bg-green-500 text-white': task.priority === 'Low',
              }"
            >
              {{ task.priority }}
            </span>
          </div>
          <div class="flex space-x-2">
            <button
              @click="toggleTask(task)"
              class="mr-2 text-sm bg-green-500 text-white px-2 py-1 rounded-lg hover:bg-green-600"
            >
              {{ task.completed ? 'Undo' : 'Complete' }}
            </button>
            <button
              @click="removeTask(task)"
              class="flex items-center justify-center w-8 h-8 rounded-full bg-red-500 hover:bg-red-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
                />
              </svg>
            </button>
          </div>
        </li>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts">
import useTodoList from './scripts/TodoListLogic';

export default {
  setup() {
    return useTodoList();
  },
};
</script>

