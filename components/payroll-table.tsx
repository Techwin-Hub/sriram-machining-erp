"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, DollarSign } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface PayrollRecord {
  id: string
  month: number
  year: number
  total_days_worked: number
  basic_salary: number
  ot_amount: number
  allowances: number
  deductions: number
  gross_salary: number
  net_salary: number
  payment_status: string
  payment_date: string | null
  employees: {
    employee_code: string
    name: string
    designation: string
    department: string
  }
}

export function PayrollTable({ payroll }: { payroll: PayrollRecord[] }) {
  const router = useRouter()

  const handleMarkPaid = async (id: string) => {
    if (!confirm("Mark this payroll as paid?")) return

    const supabase = createClient()
    const { error } = await supabase
      .from("payroll")
      .update({ payment_status: "paid", payment_date: new Date().toISOString().split("T")[0] })
      .eq("id", id)

    if (error) {
      alert("Error updating payment status: " + error.message)
    } else {
      router.refresh()
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "pending":
        return "secondary"
      case "cancelled":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Employee Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Days Worked</TableHead>
            <TableHead>Basic Salary</TableHead>
            <TableHead>OT Amount</TableHead>
            <TableHead>Allowances</TableHead>
            <TableHead>Deductions</TableHead>
            <TableHead>Gross Salary</TableHead>
            <TableHead>Net Salary</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payroll.length === 0 ? (
            <TableRow>
              <TableCell colSpan={12} className="text-center text-muted-foreground">
                No payroll records for this month. Generate payroll to get started.
              </TableCell>
            </TableRow>
          ) : (
            payroll.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-mono text-sm">{record.employees.employee_code}</TableCell>
                <TableCell className="font-medium">{record.employees.name}</TableCell>
                <TableCell>{record.employees.department}</TableCell>
                <TableCell>{record.total_days_worked}</TableCell>
                <TableCell>₹{Number(record.basic_salary).toLocaleString()}</TableCell>
                <TableCell>₹{Number(record.ot_amount).toLocaleString()}</TableCell>
                <TableCell>₹{Number(record.allowances).toLocaleString()}</TableCell>
                <TableCell className="text-destructive">₹{Number(record.deductions).toLocaleString()}</TableCell>
                <TableCell className="font-semibold">₹{Number(record.gross_salary).toLocaleString()}</TableCell>
                <TableCell className="font-bold text-accent">₹{Number(record.net_salary).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(record.payment_status)}>{record.payment_status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/payroll/${record.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {record.payment_status === "pending" && (
                      <Button variant="ghost" size="icon" onClick={() => handleMarkPaid(record.id)}>
                        <DollarSign className="h-4 w-4 text-accent" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
