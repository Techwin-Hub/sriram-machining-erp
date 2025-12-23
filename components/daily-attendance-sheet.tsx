"use client"

import type { Tables } from "@/types_db"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { attendanceStatusCodes } from "@/lib/constants"
import { format } from "date-fns"

type Employee = Pick<
  Tables<"employees">,
  "id" | "employee_code" | "name" | "designation" | "department" | "ot_rate_per_hour"
>
type Attendance = Tables<"attendance">

interface DailyAttendanceSheetProps {
  employees: Employee[]
  initialDate?: string
  initialAttendance?: Attendance[]
}

export function DailyAttendanceSheet({
  employees,
  initialDate,
  initialAttendance = [],
}: DailyAttendanceSheetProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [attendance, setAttendance] = useState<Record<string, Partial<Attendance>>>({})

  useEffect(() => {
    const newAttendance: Record<string, Partial<Attendance>> = {}
    employees.forEach((employee) => {
      const existingRecord = initialAttendance.find((att) => att.employee_id === employee.id)
      newAttendance[employee.id] = {
        status_code: existingRecord?.status_code || "S",
        ot_hours: existingRecord?.ot_hours || 0,
      }
    })
    setAttendance(newAttendance)
  }, [employees, initialAttendance])

  const handleAttendanceChange = (employeeId: string, field: keyof Attendance, value: any) => {
    const newAttendance = {
      ...attendance,
      [employeeId]: {
        ...attendance[employeeId],
        [field]: value,
      },
    }
    if (field === "status_code" && value !== "S") {
      newAttendance[employeeId].ot_hours = 0
    }
    setAttendance(newAttendance)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      toast.error("You must be logged in to save attendance.")
      setIsLoading(false)
      return
    }

    const submissionDate = initialDate || format(new Date(), "yyyy-MM-dd")

    const attendanceData = Object.entries(attendance)
      .map(([employee_id, att]) => ({
        employee_id,
        date: submissionDate,
        status_code: att.status_code || "S",
        ot_hours: Number(att.ot_hours || 0),
        user_id: user.id,
      }))
      .filter((att) => att.status_code) // Ensure we only save records with a status

    const { error } = await supabase.from("attendance").upsert(attendanceData, { onConflict: "employee_id,date" })

    if (error) {
      toast.error("Error saving attendance: " + error.message)
    } else {
      toast.success("Attendance saved successfully!")
      router.refresh()
    }
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Attendance</CardTitle>
        {initialDate && (
          <p className="text-muted-foreground">{format(new Date(`${initialDate}T00:00:00`), "PPP")}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Saving..." : "Save Attendance"}
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>OT Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="font-medium">{employee.name}</div>
                  <div className="text-sm text-muted-foreground">{employee.employee_code}</div>
                </TableCell>
                <TableCell>
                  <Select
                    value={attendance[employee.id]?.status_code || "S"}
                    onValueChange={(value) => handleAttendanceChange(employee.id, "status_code", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(attendanceStatusCodes).map(([code, description]) => (
                        <SelectItem key={code} value={code}>
                          {code} - {description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>
                  <Input
                    type="number"
                    step="0.5"
                    value={attendance[employee.id]?.ot_hours || 0}
                    onChange={(e) => handleAttendanceChange(employee.id, "ot_hours", e.target.value)}
                    disabled={attendance[employee.id]?.status_code !== "S"}
                    className="w-[100px]"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
