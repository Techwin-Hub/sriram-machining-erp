"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { attendanceStatusCodes } from "@/lib/constants"

interface Employee {
  id: string
  employee_code: string
  name: string
  designation: string
  department: string
  ot_rate_per_hour: number | null
}

interface AttendanceMarkFormProps {
  employees: Employee[]
}

export function AttendanceMarkForm({ employees }: AttendanceMarkFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const today = new Date().toISOString().split("T")[0]
  const [formData, setFormData] = useState({
    employee_id: "",
    date: today,
    check_in: "",
    check_out: "",
    status_code: "S",
    ot_hours: "0",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("You must be logged in")
      setIsLoading(false)
      return
    }

    const data = {
      employee_id: formData.employee_id,
      date: formData.date,
      check_in: formData.check_in || null,
      check_out: formData.check_out || null,
      status_code: formData.status_code,
      ot_hours: Number.parseFloat(formData.ot_hours || "0"),
      notes: formData.notes,
      user_id: user.id,
    }

    const { error } = await supabase.from("attendance").insert([data])

    if (error) {
      alert("Error marking attendance: " + error.message)
      setIsLoading(false)
    } else {
      router.push("/dashboard/attendance")
      router.refresh()
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Mark Attendance</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_id">Employee *</Label>
              <Select
                value={formData.employee_id}
                onValueChange={(value) => {
                  setFormData({ ...formData, employee_id: value })
                  setSelectedEmployee(employees.find((emp) => emp.id === value) || null)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.employee_code} - {emp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="check_in">Check In Time</Label>
              <Input
                id="check_in"
                type="time"
                value={formData.check_in}
                onChange={(e) => setFormData({ ...formData, check_in: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="check_out">Check Out Time</Label>
              <Input
                id="check_out"
                type="time"
                value={formData.check_out}
                onChange={(e) => setFormData({ ...formData, check_out: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status_code">Status *</Label>
              <Select
                value={formData.status_code}
                onValueChange={(value) => {
                  const newFormData = { ...formData, status_code: value }
                  if (value !== "S") {
                    newFormData.ot_hours = "0"
                  }
                  setFormData(newFormData)
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status">
                    {formData.status_code
                      ? `${formData.status_code} - ${
                          attendanceStatusCodes[
                            formData.status_code as keyof typeof attendanceStatusCodes
                          ]
                        }`
                      : "Select status"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(attendanceStatusCodes).map(([code, description]) => (
                    <SelectItem key={code} value={code}>
                      {code} - {description}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ot_hours">OT Hours</Label>
              <Input
                id="ot_hours"
                type="number"
                step="0.5"
                value={formData.ot_hours}
                onChange={(e) => setFormData({ ...formData, ot_hours: e.target.value })}
                placeholder="0.0"
                disabled={formData.status_code !== "S"}
              />
              {formData.status_code !== "S" && (
                <p className="text-xs text-muted-foreground">OT is only applicable for 'S' status.</p>
              )}
            </div>
          </div>

          {selectedEmployee && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>OT Rate per Hour</Label>
                <Input
                  type="text"
                  value={selectedEmployee.ot_rate_per_hour?.toFixed(2) || "N/A"}
                  readOnly
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Calculated OT Amount</Label>
                <Input
                  type="text"
                  value={
                    formData.status_code === "S" && selectedEmployee.ot_rate_per_hour
                      ? (
                          Number.parseFloat(formData.ot_hours || "0") *
                          selectedEmployee.ot_rate_per_hour
                        ).toFixed(2)
                      : "0.00"
                  }
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading || !formData.employee_id}>
              {isLoading ? "Saving..." : "Mark Attendance"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
