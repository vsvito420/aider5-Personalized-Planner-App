'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"
import { format } from 'date-fns'

type Appointment = {
  id: string
  time: string
  description: string
}

export default function DailyView() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [newAppointment, setNewAppointment] = useState({ time: '', description: '' })

  useEffect(() => {
    const storedAppointments = localStorage.getItem('dailyAppointments')
    if (storedAppointments) {
      setAppointments(JSON.parse(storedAppointments))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('dailyAppointments', JSON.stringify(appointments))
  }, [appointments])

  const addAppointment = () => {
    if (newAppointment.time && newAppointment.description) {
      setAppointments([...appointments, { ...newAppointment, id: Date.now().toString() }])
      setNewAppointment({ time: '', description: '' })
    }
  }

  const removeAppointment = (id: string) => {
    setAppointments(appointments.filter(app => app.id !== id))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{format(new Date(), 'MMMM d, yyyy')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={newAppointment.time}
              onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
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
        <ScrollArea className="h-[300px] mt-4">
          {appointments.sort((a, b) => a.time.localeCompare(b.time)).map((app) => (
            <div key={app.id} className="flex justify-between items-center p-2 border-b">
              <div>
                <span className="font-bold">{app.time}</span> - {app.description}
              </div>
              <Button variant="destructive" size="sm" onClick={() => removeAppointment(app.id)}>Remove</Button>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}