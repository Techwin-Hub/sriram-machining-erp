import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Users, Package, TrendingUp, Clock, DollarSign, Factory, Beaker } from "lucide-react"
import Link from "next/link"

export default async function ReportsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const reports = [
    {
      title: "Attendance Report",
      description: "View employee attendance history and statistics",
      icon: Clock,
      href: "/dashboard/attendance/history",
      color: "text-primary",
    },
    {
      title: "Payroll Report",
      description: "View salary and payroll summaries",
      icon: DollarSign,
      href: "/dashboard/payroll",
      color: "text-accent",
    },
    {
      title: "Job Cards Report",
      description: "View production job card status and history",
      icon: FileText,
      href: "/dashboard/job-cards",
      color: "text-primary",
    },
    {
      title: "Plating Operations",
      description: "View plating job performance and quality metrics",
      icon: Beaker,
      href: "/dashboard/plating",
      color: "text-primary",
    },
    {
      title: "Inventory Report",
      description: "View parts inventory levels and stock alerts",
      icon: Package,
      href: "/dashboard/parts",
      color: "text-primary",
    },
    {
      title: "Sales Report",
      description: "View invoices, payments, and revenue analytics",
      icon: TrendingUp,
      href: "/dashboard/invoices",
      color: "text-accent",
    },
    {
      title: "Employee Report",
      description: "View employee details and statistics",
      icon: Users,
      href: "/dashboard/employees",
      color: "text-primary",
    },
    {
      title: "Production Report",
      description: "View manufacturing production metrics",
      icon: Factory,
      href: "/dashboard/job-cards",
      color: "text-primary",
    },
  ]

  return (
    <div>
      <DashboardHeader title="Reports & Analytics" description="Access various reports and analytics" />
      <div className="p-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => {
            const Icon = report.icon
            return (
              <Link key={report.title} href={report.href}>
                <Card className="border-border hover:bg-secondary/50 transition-colors cursor-pointer h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{report.title}</CardTitle>
                        <CardDescription className="mt-2">{report.description}</CardDescription>
                      </div>
                      <Icon className={`h-8 w-8 ${report.color}`} />
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            )
          })}
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Employees</span>
                <span className="font-semibold">Loading...</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Active Job Cards</span>
                <span className="font-semibold">Loading...</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pending Invoices</span>
                <span className="font-semibold">Loading...</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Low Stock Items</span>
                <span className="font-semibold">Loading...</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">New job card created</p>
                  <p className="text-xs text-muted-foreground">Just now</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-accent mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Payment received</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="h-2 w-2 rounded-full bg-primary mt-2" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Attendance marked</p>
                  <p className="text-xs text-muted-foreground">5 hours ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
