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

interface Employee {
  id: string
  employee_code: string
  name: string
  designation: string
  department: string
  salary_per_day: number | null
  ot_rate_per_hour: number | null
}

interface PayrollGenerateFormProps {
  employees: Employee[]
}

export function PayrollGenerateForm({ employees }: PayrollGenerateFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  const [formData, setFormData] = useState({
    employee_id: "",
    month: currentMonth.toString(),
    year: currentYear.toString(),
    total_days_worked: "0",
    allowances: "0",
    deductions: "0",
    notes: "",
  })

  const selectedEmployee = employees.find((e) => e.id === formData.employee_id)

  // Calculate salary
  const calculateSalary = async () => {
    if (!selectedEmployee || !formData.employee_id) return { basicSalary: 0, otAmount: 0 }

    const daysWorked = Number.parseInt(formData.total_days_worked)
    const dailyRate = selectedEmployee.salary_per_day || 0
    const basicSalary = daysWorked * dailyRate

    // Fetch OT hours for this employee in this month
    const supabase = createClient()
    const firstDay = new Date(Number.parseInt(formData.year), Number.parseInt(formData.month) - 1, 1)
      .toISOString()
      .split("T")[0]
    const lastDay = new Date(Number.parseInt(formData.year), Number.parseInt(formData.month), 0)
      .toISOString()
      .split("T")[0]

    const { data: attendance } = await supabase
      .from("attendance")
      .select("ot_hours")
      .eq("employee_id", formData.employee_id)
      .gte("date", firstDay)
      .lte("date", lastDay)

    const totalOTHours = attendance?.reduce((sum, a) => sum + Number(a.ot_hours), 0) || 0
    const otRate = selectedEmployee.ot_rate_per_hour || 0
    const otAmount = totalOTHours * otRate

    return { basicSalary, otAmount }
  }

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

    const { basicSalary, otAmount } = await calculateSalary()

    const data = {
      user_id: user.id,
      employee_id: formData.employee_id,
      month: Number.parseInt(formData.month),
      year: Number.parseInt(formData.year),
      total_days_worked: Number.parseInt(formData.total_days_worked),
      basic_salary: basicSalary,
      ot_amount: otAmount,
      allowances: Number.parseFloat(formData.allowances),
      deductions: Number.parseFloat(formData.deductions),
      payment_status: "pending",
      notes: formData.notes,
    }

    const { error } = await supabase.from("payroll").insert([data])

    if (error) {
      alert("Error generating payroll: " + error.message)
      setIsLoading(false)
    } else {
      router.push("/dashboard/payroll")
      router.refresh()
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>Generate Payroll</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_id">Employee *</Label>
              <Select
                value={formData.employee_id}
                onValueChange={(value) => setFormData({ ...formData, employee_id: value })}
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
              <Label htmlFor="total_days_worked">Days Worked *</Label>
              <Input
                id="total_days_worked"
                type="number"
                required
                value={formData.total_days_worked}
                onChange={(e) => setFormData({ ...formData, total_days_worked: e.target.value })}
                placeholder="26"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="month">Month *</Label>
              <Select value={formData.month} onValueChange={(value) => setFormData({ ...formData, month: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">January</SelectItem>
                  <SelectItem value="2">February</SelectItem>
                  <SelectItem value="3">March</SelectItem>
                  <SelectItem value="4">April</SelectItem>
                  <SelectItem value="5">May</SelectItem>
                  <SelectItem value="6">June</SelectItem>
                  <SelectItem value="7">July</SelectItem>
                  <SelectItem value="8">August</SelectItem>
                  <SelectItem value="9">September</SelectItem>
                  <SelectItem value="10">October</SelectItem>
                  <SelectItem value="11">November</SelectItem>
                  <SelectItem value="12">December</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                required
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />
            </div>
          </div>

          {selectedEmployee && (
            <div className="p-4 bg-secondary rounded-md space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Daily Rate:</span>
                <span className="font-medium">₹{selectedEmployee.salary_per_day || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">OT Rate/Hour:</span>
                <span className="font-medium">₹{selectedEmployee.ot_rate_per_hour || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Estimated Basic Salary:</span>
                <span className="font-medium">
                  ₹
                  {(
                    Number.parseInt(formData.total_days_worked || "0") * (selectedEmployee.salary_per_day || 0)
                  ).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="allowances">Allowances (₹)</Label>
              <Input
                id="allowances"
                type="number"
                step="0.01"
                value={formData.allowances}
                onChange={(e) => setFormData({ ...formData, allowances: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="deductions">Deductions (₹)</Label>
              <Input
                id="deductions"
                type="number"
                step="0.01"
                value={formData.deductions}
                onChange={(e) => setFormData({ ...formData, deductions: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

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
              {isLoading ? "Generating..." : "Generate Payroll"}
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
