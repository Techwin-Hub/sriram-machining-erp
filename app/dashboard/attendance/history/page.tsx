import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { AttendanceHistoryTable } from "@/components/attendance-history-table"

export default async function AttendanceHistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  // Fetch attendance records from last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const startDate = thirtyDaysAgo.toISOString().split("T")[0]

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
    .gte("date", startDate)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false })

  return (
    <div>
      <DashboardHeader title="Attendance History" description="View attendance records from the last 30 days" />
      <div className="p-6">
        <AttendanceHistoryTable attendance={attendance || []} />
      </div>
    </div>
  )
}
