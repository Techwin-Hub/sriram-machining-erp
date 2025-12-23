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

interface EmployeeFormProps {
  employee?: {
    id: string
    employee_code: string
    name: string
    designation: string
    department: string
    date_of_joining: string
    phone: string | null
    address: string | null
    salary_per_day: number | null
    ot_rate_per_hour: number | null
    status: string
  }
}

export function EmployeeForm({ employee }: EmployeeFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    employee_code: employee?.employee_code || "",
    name: employee?.name || "",
    designation: employee?.designation || "",
    department: employee?.department || "",
    date_of_joining: employee?.date_of_joining || "",
    phone: employee?.phone || "",
    address: employee?.address || "",
    salary_per_day: employee?.salary_per_day?.toString() || "",
    ot_rate_per_hour: employee?.ot_rate_per_hour?.toString() || "",
    status: employee?.status || "active",
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
      return
    }

    const data = {
      ...formData,
      user_id: user.id,
      salary_per_day: formData.salary_per_day ? Number.parseFloat(formData.salary_per_day) : null,
      ot_rate_per_hour: formData.ot_rate_per_hour ? Number.parseFloat(formData.ot_rate_per_hour) : null,
    }

    let error
    if (employee) {
      const result = await supabase.from("employees").update(data).eq("id", employee.id)
      error = result.error
    } else {
      const result = await supabase.from("employees").insert([data])
      error = result.error
    }

    if (error) {
      alert("Error saving employee: " + error.message)
      setIsLoading(false)
    } else {
      router.push("/dashboard/employees")
      router.refresh()
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{employee ? "Edit Employee" : "New Employee"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_code">Employee Code *</Label>
              <Input
                id="employee_code"
                required
                value={formData.employee_code}
                onChange={(e) => setFormData({ ...formData, employee_code: e.target.value })}
                placeholder="EMP-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="designation">Designation *</Label>
              <Input
                id="designation"
                required
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                placeholder="Machine Operator"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                required
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="Production"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date_of_joining">Date of Joining *</Label>
              <Input
                id="date_of_joining"
                type="date"
                required
                value={formData.date_of_joining}
                onChange={(e) => setFormData({ ...formData, date_of_joining: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+91 9876543210"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter full address"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salary_per_day">Salary Per Day (₹)</Label>
              <Input
                id="salary_per_day"
                type="number"
                step="0.01"
                value={formData.salary_per_day}
                onChange={(e) => setFormData({ ...formData, salary_per_day: e.target.value })}
                placeholder="500.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ot_rate_per_hour">OT Rate Per Hour (₹)</Label>
              <Input
                id="ot_rate_per_hour"
                type="number"
                step="0.01"
                value={formData.ot_rate_per_hour}
                onChange={(e) => setFormData({ ...formData, ot_rate_per_hour: e.target.value })}
                placeholder="75.00"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : employee ? "Update Employee" : "Create Employee"}
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
