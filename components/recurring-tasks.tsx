'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

type RecurringTask = {
  id: string
  description: string
  frequency: number
  unit: 'days' | 'weeks' | 'months'
  lastCompleted: string
}

export default function RecurringTasks() {
  const [tasks, setTasks] = useState<RecurringTask[]>([])
  const [newTask, setNewTask] = useState({ description: '', frequency: 1, unit: 'days' as const, lastCompleted: '' })

  useEffect(() => {
    const storedTasks = localStorage.getItem('recurringTasks')
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('recurringTasks', JSON.stringify(tasks))
  }, [tasks])

  const addTask = () => {
    if (newTask.description && newTask.frequency > 0) {
      setTasks([...tasks, { ...newTask, id: Date.now().toString(), lastCompleted: new Date().toISOString() }])
      setNewTask({ description: '', frequency: 1, unit: 'days', lastCompleted: '' })
    }
  }

  const removeTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id))
  }

  const completeTask = (id: string) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, lastCompleted: new Date().toISOString() } : task
    ))
  }

  const getNextDueDate = (task: RecurringTask) => {
    const lastCompleted = new Date(task.lastCompleted)
    const nextDue = new Date(lastCompleted)
    if (task.unit === 'days') {
      nextDue.setDate(nextDue.getDate() + task.frequency)
    } else if (task.unit === 'weeks') {
      nextDue.setDate(nextDue.getDate() + task.frequency * 7)
    } else if (task.unit === 'months') {
      nextDue.setMonth(nextDue.getMonth() + task.frequency)
    }
    return nextDue
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recurring Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-4">
          <div className="grid gap-2">
            <Label htmlFor="description">Task Description</Label>
            <Input
              id="description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="frequency">Frequency</Label>
            <div className="flex gap-2">
              <Input
                id="frequency"
                type="number"
                min="1"
                value={newTask.frequency}
                onChange={(e) => setNewTask({ ...newTask, frequency: parseInt(e.target.value) })}
              />
              <select
                value={newTask.unit}
                onChange={(e) => setNewTask({ ...newTask, unit: e.target.value as 'days' | 'weeks' | 'months' })}
                className="w-full p-2 border rounded"
              >
                <option value="days">Days</option>
                <option value="weeks">Weeks</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
          <Button onClick={addTask}>Add Recurring Task</Button>
        </div>
        <ScrollArea className="h-[300px]">
          {tasks.map((task) => (
            <div key={task.id} className="flex justify-between items-center p-2 border-b">
              <div>
                <div>{task.description}</div>
                <div className="text-sm text-gray-500">
                  Every {task.frequency} {task.unit} | Next due: {getNextDueDate(task).toLocaleDateString()}
                </div>
              </div>
              <div>
                <Button variant="outline" size="sm" onClick={() => completeTask(task.id)} className="mr-2">Complete</Button>
                <Button variant="destructive" size="sm" onClick={() => removeTask(task.id)}>Remove</Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}