import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export default async function PayrollDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: payroll } = await supabase
    .from("payroll")
    .select(
      `
      *,
      employees:employee_id (
        employee_code,
        name,
        designation,
        department,
        phone,
        address
      )
    `,
    )
    .eq("id", id)
    .single()

  if (!payroll) {
    redirect("/dashboard/payroll")
  }

  const monthName = new Date(payroll.year, payroll.month - 1).toLocaleString("default", { month: "long" })

  return (
    <div>
      <DashboardHeader
        title="Payslip Details"
        description={`${monthName} ${payroll.year} - ${payroll.employees.employee_code}`}
        action={
          <Button onClick={() => window.print()}>
            <Printer className="mr-2 h-4 w-4" />
            Print Payslip
          </Button>
        }
      />
      <div className="p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">Payslip</CardTitle>
                <p className="text-muted-foreground">
                  {monthName} {payroll.year}
                </p>
              </div>
              <Badge variant={payroll.payment_status === "paid" ? "default" : "secondary"}>
                {payroll.payment_status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3">Employee Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Employee Code:</span>
                    <span className="font-medium">{payroll.employees.employee_code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{payroll.employees.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Designation:</span>
                    <span className="font-medium">{payroll.employees.designation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Department:</span>
                    <span className="font-medium">{payroll.employees.department}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-3">Payment Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Days Worked:</span>
                    <span className="font-medium">{payroll.total_days_worked}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment Status:</span>
                    <span className="font-medium capitalize">{payroll.payment_status}</span>
                  </div>
                  {payroll.payment_date && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Date:</span>
                      <span className="font-medium">{new Date(payroll.payment_date).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-3">Earnings</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Basic Salary:</span>
                  <span className="font-medium">₹{Number(payroll.basic_salary).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">OT Amount:</span>
                  <span className="font-medium">₹{Number(payroll.ot_amount).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Allowances:</span>
                  <span className="font-medium">₹{Number(payroll.allowances).toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-semibold">Gross Salary:</span>
                  <span className="font-semibold">₹{Number(payroll.gross_salary).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold mb-3">Deductions</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Deductions:</span>
                  <span className="font-medium text-destructive">₹{Number(payroll.deductions).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <div className="flex justify-between items-center p-4 bg-primary/10 rounded-md">
                <span className="font-bold text-lg">Net Salary:</span>
                <span className="font-bold text-2xl text-accent">₹{Number(payroll.net_salary).toLocaleString()}</span>
              </div>
            </div>

            {payroll.notes && (
              <div className="border-t border-border pt-6">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-sm text-muted-foreground">{payroll.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
