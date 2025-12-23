import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { AttendanceMarkForm } from "@/components/attendance-mark-form"

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
    .select("*")
    .eq("status", "active")
    .order("name", { ascending: true })

  return (
    <div>
      <DashboardHeader title="Mark Attendance" description="Record employee attendance for today" />
      <div className="p-6">
        <AttendanceMarkForm employees={employees || []} />
      </div>
    </div>
  )
}
