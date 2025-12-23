import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus, Calendar } from "lucide-react"
import Link from "next/link"
import { AttendanceTable } from "@/components/attendance-table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function AttendancePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Get today's date
  const today = new Date().toISOString().split("T")[0]

  // Fetch today's attendance with employee details
  const { data: attendance } = await supabase
    .from("attendance")
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
    .eq("date", today)
    .order("created_at", { ascending: false })

  // Fetch all active employees
  const { data: employees } = await supabase.from("employees").select("*").eq("status", "active")

  const totalEmployees = employees?.length || 0
  const presentCount = attendance?.filter((a) => a.status === "present").length || 0
  const absentCount = attendance?.filter((a) => a.status === "absent").length || 0
  const notMarkedCount = totalEmployees - (attendance?.length || 0)

  return (
    <div>
      <DashboardHeader
        title="Attendance Management"
        description={`Today's attendance - ${today}`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/attendance/history">
                <Calendar className="mr-2 h-4 w-4" />
                View History
              </Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/attendance/mark">
                <Plus className="mr-2 h-4 w-4" />
                Mark Attendance
              </Link>
            </Button>
          </div>
        }
      />
      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Employees</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{totalEmployees}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Present</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{presentCount}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Absent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{absentCount}</div>
            </CardContent>
          </Card>
          <Card className="border-border">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Not Marked</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-muted-foreground">{notMarkedCount}</div>
            </CardContent>
          </Card>
        </div>

        <AttendanceTable attendance={attendance || []} />
      </div>
    </div>
  )
}
