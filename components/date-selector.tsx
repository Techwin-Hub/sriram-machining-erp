"use client"

import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DateSelectorProps {
  initialDate: string
}

export function DateSelector({ initialDate }: DateSelectorProps) {
  const router = useRouter()

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = e.target.value
    router.push(`/dashboard/attendance/history?date=${newDate}`)
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="date-selector">Select Date</Label>
      <Input
        id="date-selector"
        type="date"
        value={initialDate}
        onChange={handleDateChange}
        className="w-[200px]"
      />
    </div>
  )
}
