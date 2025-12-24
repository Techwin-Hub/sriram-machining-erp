import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { AttendanceHistory } from "@/components/attendance-history"

export default async function AttendanceHistoryPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

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
    .order("date", { ascending: false })

  return (
    <div>
      <DashboardHeader title="Attendance History" description="View and edit past attendance records" />
      <div className="p-6">
        <AttendanceHistory attendance={attendance || []} />
      </div>
    </div>
  )
}
