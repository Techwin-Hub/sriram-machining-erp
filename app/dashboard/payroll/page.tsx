import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PayrollTable } from "@/components/payroll-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PayrollPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get current month and year
  const now = new Date()
  const currentMonth = now.getMonth() + 1
  const currentYear = now.getFullYear()

  // Fetch payroll records for current month
  const { data: payroll } = await supabase
    .from("payroll")
    .select(
      `
      *,
      employees:employee_id (
        employee_code,
        name,
        designation,
        department
      )
    `,
    )
    .eq("month", currentMonth)
    .eq("year", currentYear)
    .order("created_at", { ascending: false })

  const totalGross = payroll?.reduce((sum, p) => sum + Number(p.gross_salary), 0) || 0
  const totalNet = payroll?.reduce((sum, p) => sum + Number(p.net_salary), 0) || 0
  const paidCount = payroll?.filter((p) => p.payment_status === "paid").length || 0
  const pendingCount = payroll?.filter((p) => p.payment_status === "pending").length || 0

  return (
    <div>
      <DashboardHeader
        title="Payroll Management"
        description={`${new Date(currentYear, currentMonth - 1).toLocaleString("default", { month: "long" })} ${currentYear}`}
        action={
          <Button asChild>
            <Link href="/dashboard/payroll/generate">
              <Plus className="mr-2 h-4 w-4" />
              Generate Payroll
            </Link>
          </Button>
        }
      />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Gross Salary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹{totalGross.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Net Salary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">₹{totalNet.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{paidCount}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{pendingCount}</div>
            </CardContent>
          </Card>
        </div>

        <PayrollTable payroll={payroll || []} />
      </div>
    </div>
  )
}
