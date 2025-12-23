import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { InvoicesTable } from "@/components/invoices-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function InvoicesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: invoices } = await supabase
    .from("invoices")
    .select(
      `
      *,
      customers:customer_id (
        customer_code,
        company_name
      )
    `,
    )
    .order("created_at", { ascending: false })

  const totalAmount = invoices?.reduce((sum, inv) => sum + Number(inv.total_amount), 0) || 0
  const paidAmount = invoices?.reduce((sum, inv) => sum + Number(inv.amount_paid), 0) || 0
  const balanceAmount = invoices?.reduce((sum, inv) => sum + Number(inv.balance), 0) || 0
  const overdueCount =
    invoices?.filter((inv) => inv.payment_status === "overdue" || inv.payment_status === "unpaid").length || 0

  return (
    <div>
      <DashboardHeader
        title="Invoices"
        description="Manage invoices and billing"
        action={
          <Button asChild>
            <Link href="/dashboard/invoices/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Invoice
            </Link>
          </Button>
        }
      />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoiced</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">₹{totalAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">₹{paidAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">₹{balanceAmount.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Overdue Invoices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{overdueCount}</div>
            </CardContent>
          </Card>
        </div>

        <InvoicesTable invoices={invoices || []} />
      </div>
    </div>
  )
}
