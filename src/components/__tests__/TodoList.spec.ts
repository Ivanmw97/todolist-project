import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TodoList from '../TodoList.vue'

describe('TodoList', () => {
  let wrapper: any

  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    wrapper = mount(TodoList)
  })

  it('renders properly', () => {
    expect(wrapper.find('h1').text()).toBe('TODO List')
  })

  it('adds a new task', async () => {
    const input = wrapper.find('input[type="text"]')
    const form = wrapper.find('form')
    
    await input.setValue('New test task')
    await form.trigger('submit')

    expect(wrapper.text()).toContain('New test task')
  })

  it('toggles task completion', async () => {
    // Add a task first
    const input = wrapper.find('input[type="text"]')
    const form = wrapper.find('form')
    await input.setValue('Toggle test task')
    await form.trigger('submit')
    await wrapper.vm.$nextTick()

    // Find the complete button by finding all buttons and filtering
    const completeButton = wrapper.findAll('button').find(b => b.text() === 'Complete')
    await completeButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Debug the component state and DOM
    console.log('Component HTML:', wrapper.html())
    console.log('Task state:', wrapper.vm.state.tasks[0])

    // Check if the task is marked as completed by checking the task state
    expect(wrapper.vm.state.tasks[0].completed).toBe(true)

    // Check if the task text has the completed styling
    const taskText = wrapper.find('.block.font-medium')
    expect(taskText.classes('line-through')).toBe(true)
  })

  it('filters tasks correctly', async () => {
    // Add two tasks
    const input = wrapper.find('input[type="text"]')
    const form = wrapper.find('form')
    
    await input.setValue('Task 1')
    await form.trigger('submit')
    await wrapper.vm.$nextTick()
    
    await input.setValue('Task 2')
    await form.trigger('submit')
    await wrapper.vm.$nextTick()

    // Find and click the Complete button for the first task
    const completeButton = wrapper.findAll('button').find(b => b.text() === 'Complete')
    await completeButton.trigger('click')
    await wrapper.vm.$nextTick()

    // Find and click the Completed filter button
    const completedFilter = wrapper.findAll('button').find(b => b.text() === 'Completed')
    await completedFilter.trigger('click')
    await wrapper.vm.$nextTick()

    // Debug log
    console.log('Filtered tasks HTML:', wrapper.html())

    // Check completed tasks by checking class attribute
    const completedTasks = wrapper.findAll('span').filter(span => 
      span.attributes('class')?.includes('line-through')
    )
    expect(completedTasks.length).toBe(1)
  })

  it('toggles dark mode', async () => {
    const darkModeButton = wrapper.find('[aria-label="Toggle Dark Mode"]')
    await darkModeButton.trigger('click')
    
    expect(document.documentElement.classList.contains('dark')).toBe(true)
  })
})