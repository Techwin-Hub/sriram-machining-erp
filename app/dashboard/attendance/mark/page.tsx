import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DailyAttendanceSheet } from "@/components/daily-attendance-sheet"

export default async function MarkAttendancePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch all active employees
  const { data: employees } = await supabase
    .from("employees")
    .select("id, employee_code, name, designation, department, ot_rate_per_hour")
    .eq("status", "active")
    .order("name", { ascending: true })

  return (
    <div>
      <DashboardHeader title="Mark Attendance" description="Record employee attendance for today" />
      <div className="p-6">
        <DailyAttendanceSheet employees={employees || []} />
      </div>
    </div>
  )
}
