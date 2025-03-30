"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export type CalendarProps = React.HTMLAttributes<HTMLDivElement> & {
  month?: number
  year?: number
  selected?: Date
  onSelect?: (date: Date) => void
  disabled?: (date: Date) => boolean
  disablePastDates?: boolean
  disableFutureDates?: boolean
}

export function Calendar({
  className,
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
  selected,
  onSelect,
  disabled,
  disablePastDates = false,
  disableFutureDates = false,
  ...props
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = React.useState(month)
  const [currentYear, setCurrentYear] = React.useState(year)

  // Get days in month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  // Get day of week for first day of month (0 = Sunday, 1 = Monday, etc.)
  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth)

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  const isDateDisabled = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (disablePastDates && date < today) {
      return true
    }

    if (disableFutureDates && date > today) {
      return true
    }

    if (disabled && disabled(date)) {
      return true
    }

    return false
  }

  const isSelected = (date: Date) => {
    if (!selected) return false

    const selectedDate = new Date(selected)
    selectedDate.setHours(0, 0, 0, 0)

    return date.getTime() === selectedDate.getTime()
  }

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(<div key={`empty-${i}`} className="h-9 w-9"></div>)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentYear, currentMonth, day)
    const disabled = isDateDisabled(date)

    calendarDays.push(
      <Button
        key={`day-${day}`}
        type="button"
        variant="ghost"
        className={cn(
          "h-9 w-9 p-0 font-normal",
          isSelected(date) && "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        disabled={disabled}
        onClick={() => !disabled && onSelect && onSelect(date)}
      >
        {day}
      </Button>,
    )
  }

  return (
    <div className={cn("p-3", className)} {...props}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-medium">
          {monthNames[currentMonth]} {currentYear}
        </h3>
        <div className="flex items-center space-x-1">
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous month</span>
          </Button>
          <Button variant="outline" size="icon" className="h-7 w-7" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next month</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-1">
        {dayNames.map((day) => (
          <div key={day} className="h-9 flex items-center justify-center font-medium">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">{calendarDays}</div>
    </div>
  )
}

