import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, FileText, DollarSign, TrendingUp, TrendingDown, Activity } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch dashboard stats
  const [employeesCount, customersCount, jobCardsCount, partsCount] = await Promise.all([
    supabase.from("employees").select("*", { count: "exact", head: true }),
    supabase.from("customers").select("*", { count: "exact", head: true }),
    supabase.from("job_cards").select("*", { count: "exact", head: true }),
    supabase.from("parts").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    {
      title: "Total Employees",
      value: employeesCount.count || 0,
      icon: Users,
      trend: "+12%",
      trendUp: true,
    },
    {
      title: "Active Customers",
      value: customersCount.count || 0,
      icon: Package,
      trend: "+8%",
      trendUp: true,
    },
    {
      title: "Active Job Cards",
      value: jobCardsCount.count || 0,
      icon: FileText,
      trend: "-3%",
      trendUp: false,
    },
    {
      title: "Parts in Inventory",
      value: partsCount.count || 0,
      icon: Activity,
      trend: "+5%",
      trendUp: true,
    },
  ]

  return (
    <div>
      <DashboardHeader title="Dashboard" description="Overview of your manufacturing operations" />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title} className="border-border">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <p className="text-xs flex items-center gap-1 mt-1">
                    {stat.trendUp ? (
                      <TrendingUp className="h-3 w-3 text-accent" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-destructive" />
                    )}
                    <span className={stat.trendUp ? "text-accent" : "text-destructive"}>{stat.trend}</span>
                    <span className="text-muted-foreground">from last month</span>
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">New job card created</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-accent" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Delivery challan dispatched</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Invoice payment received</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <a
                href="/dashboard/job-cards"
                className="p-3 border border-border rounded-md hover:bg-secondary transition-colors"
              >
                <FileText className="h-5 w-5 mb-2 text-primary" />
                <p className="text-sm font-medium">Create Job Card</p>
              </a>
              <a
                href="/dashboard/attendance"
                className="p-3 border border-border rounded-md hover:bg-secondary transition-colors"
              >
                <Users className="h-5 w-5 mb-2 text-primary" />
                <p className="text-sm font-medium">Mark Attendance</p>
              </a>
              <a
                href="/dashboard/delivery-challans"
                className="p-3 border border-border rounded-md hover:bg-secondary transition-colors"
              >
                <Package className="h-5 w-5 mb-2 text-primary" />
                <p className="text-sm font-medium">New Challan</p>
              </a>
              <a
                href="/dashboard/invoices"
                className="p-3 border border-border rounded-md hover:bg-secondary transition-colors"
              >
                <DollarSign className="h-5 w-5 mb-2 text-primary" />
                <p className="text-sm font-medium">Generate Invoice</p>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
