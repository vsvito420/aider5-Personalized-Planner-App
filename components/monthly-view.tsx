'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth } from 'date-fns'

type MonthlyAppointment = {
  id: string
  date: string
  description: string
}

export default function MonthlyView() {
  const [appointments, setAppointments] = useState<MonthlyAppointment[]>([])
  const [newAppointment, setNewAppointment] = useState({ date: '', description: '' })
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    const storedAppointments = localStorage.getItem('monthlyAppointments')
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('monthlyAppointments', JSON.stringify(appointments))
  }, [appointments])

  const addAppointment = () => {
    if (newAppointment.date && newAppointment.description) {
      setAppointments([...appointments, { ...newAppointment, id: Date.now().toString() }])
      setNewAppointment({ date: '', description: '' })
    }
  }

  const removeAppointment = (id: string) => {
    setAppointments(appointments.filter(app => app.id !== id))
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{format(currentMonth, 'MMMM yyyy')}</span>
          <div>
            <Button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))}>Previous</Button>
            <Button onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} className="ml-2">Next</Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 mb-4">
          <div className="grid gap-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={newAppointment.date}
              onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={newAppointment.description}
              onChange={(e) => setNewAppointment({ ...newAppointment, description: e.target.value })}
            />
          </div>
          <Button onClick={addAppointment}>Add Appointment</Button>
        </div>
        <ScrollArea className="h-[400px]">
          <div className="grid grid-cols-7 gap-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="text-center font-bold">{day}</div>
            ))}
            {monthDays.map((day, index) => (
              <div key={index} className={`p-2 border ${isSameMonth(day, currentMonth) ? '' : 'opacity-50'}`}>
                <div className="font-bold">{format(day, 'd')}</div>
                {appointments
                  .filter((app) => app.date === format(day, 'yyyy-MM-dd'))
                  .map((app) => (
                    <div key={app.id} className="text-sm">
                      {app.description}
                      <Button variant="destructive" size="sm" onClick={() => removeAppointment(app.id)} className="ml-2">X</Button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}