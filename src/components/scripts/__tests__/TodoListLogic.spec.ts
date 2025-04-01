import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import useTodoList from '../TodoListLogic'

describe('TodoListLogic', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('initializes with empty task list', () => {
    const { state } = useTodoList()
    expect(state.tasks).toHaveLength(0)
  })

  it('adds new task correctly', () => {
    const { state, addTask } = useTodoList()
    
    state.newTask = 'Test Task'
    state.newPriority = 'High'
    addTask()

    expect(state.tasks).toHaveLength(1)
    expect(state.tasks[0].text).toBe('Test Task')
    expect(state.tasks[0].priority).toBe('High')
  })

  it('toggles task completion', () => {
    const { state, addTask, toggleTask } = useTodoList()
    
    state.newTask = 'Toggle Task'
    addTask()
    
    const task = state.tasks[0]
    toggleTask(task)
    expect(task.completed).toBe(true)
    
    toggleTask(task)
    expect(task.completed).toBe(false)
  })

  it('filters tasks correctly', () => {
    const { state, addTask, filteredTasks } = useTodoList()
    
    // Add tasks with different priorities
    state.newTask = 'High Priority Task'
    state.newPriority = 'High'
    addTask()
    
    state.newTask = 'Low Priority Task'
    state.newPriority = 'Low'
    addTask()

    state.priorityFilter = 'High'
    expect(filteredTasks.value).toHaveLength(1)
    expect(filteredTasks.value[0].priority).toBe('High')
  })
})