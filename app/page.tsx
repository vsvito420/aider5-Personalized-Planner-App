'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModeToggle } from '@/components/mode-toggle'
import DailyView from '@/components/daily-view'
import WeeklyView from '@/components/weekly-view'
import MonthlyView from '@/components/monthly-view'
import RecurringTasks from '@/components/recurring-tasks'

export default function Home() {
  const [activeTab, setActiveTab] = useState('daily')

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Self Planner</h1>
        <ModeToggle />
      </header>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="recurring">Recurring</TabsTrigger>
        </TabsList>
        <TabsContent value="daily">
          <DailyView />
        </TabsContent>
        <TabsContent value="weekly">
          <WeeklyView />
        </TabsContent>
        <TabsContent value="monthly">
          <MonthlyView />
        </TabsContent>
        <TabsContent value="recurring">
          <RecurringTasks />
        </TabsContent>
      </Tabs>
    </div>
  )
}