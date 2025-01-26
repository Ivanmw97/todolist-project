import { reactive, computed, watch, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';

export default function useTodoList() {
    const LOCAL_STORAGE_KEY = 'todoList';
    const FILTER_STORAGE_KEY = 'todoFilter';

    const state = reactive({
        newTask: '',
        newPriority: 'Medium' as 'High' | 'Medium' | 'Low',
        tasks: [] as { id: string; text: string; completed: boolean; priority: string }[],
        filter: 'all' as 'all' | 'pending' | 'completed',
        priorityFilter: 'all' as 'all' | 'High' | 'Medium' | 'Low',
        isDarkMode: localStorage.getItem('darkMode') === 'true',
    });

    // Computed Properties
    const pendingTasks = computed(() => state.tasks.filter((task) => !task.completed).length);
    const completedTasks = computed(() => state.tasks.filter((task) => task.completed).length);
    const filteredTasks = computed(() => {
        let tasks = state.tasks;

        if (state.filter === 'pending') {
        tasks = tasks.filter((task) => !task.completed);
        } else if (state.filter === 'completed') {
        tasks = tasks.filter((task) => task.completed);
        }

        if (state.priorityFilter !== 'all') {
        tasks = tasks.filter((task) => task.priority === state.priorityFilter);
        }

        return tasks;
    });

    // Dynamic Classes for Filters
    const activeFilterClass = 'text-white bg-blue-500 px-3 py-1 rounded-lg';
    const defaultFilterClass = 'text-blue-500 border border-blue-500 px-3 py-1 rounded-lg hover:bg-blue-100';
  
    // Methods
    const addTask = () => {
        if (state.newTask.trim()) {
        const newTask = {
            id: uuidv4(),
            text: state.newTask.trim(),
            completed: false,
            priority: state.newPriority,
        };
        state.tasks.push(newTask);
        state.newTask = '';
        state.newPriority = 'Medium';
        }
    };

    const toggleTask = (task: { id: string; completed: boolean }) => {
        const index = state.tasks.findIndex((t) => t.id === task.id);
        if (index > -1) {
        state.tasks[index].completed = !state.tasks[index].completed;
        }
    };

    const removeTask = (task: { id: string }) => {
        state.tasks = state.tasks.filter((t) => t.id !== task.id);
    };

    const setFilter = (filter: 'all' | 'pending' | 'completed') => {
        state.filter = filter;
    };

    const toggleDarkMode = () => {
        state.isDarkMode = !state.isDarkMode;
        if (state.isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('darkMode', 'true');
        } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('darkMode', 'false');
        }
    };

    // Sync Dark Mode on Mount
    onMounted(() => {
        if (state.isDarkMode) {
        document.documentElement.classList.add('dark');
        }

        // Load tasks from LocalStorage
        const savedTasks = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedTasks) {
        state.tasks = JSON.parse(savedTasks);
        }

        // Load filter from LocalStorage
        const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
        if (savedFilter) {
        state.filter = savedFilter as 'all' | 'pending' | 'completed';
        }
    });

    // Watchers for Persistence
    watch(
        () => state.tasks,
        (tasks) => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(tasks));
        },
        { deep: true } // Necessary to observe changes within an array/object
    );

    watch(
        () => state.filter,
        (filter) => {
        localStorage.setItem(FILTER_STORAGE_KEY, filter);
        }
    );

    return {
        state,
        pendingTasks,
        completedTasks,
        filteredTasks,
        addTask,
        toggleTask,
        removeTask,
        setFilter,
        toggleDarkMode,
        activeFilterClass,
        defaultFilterClass,
    };
}
