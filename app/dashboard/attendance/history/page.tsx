import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { DailyAttendanceSheet } from "@/components/daily-attendance-sheet"
import { DateSelector } from "@/components/date-selector"
import { format } from "date-fns"

interface HistoryPageProps {
  searchParams: {
    date?: string
  }
}

export default async function AttendanceHistoryPage({ searchParams }: HistoryPageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const selectedDate = searchParams.date || format(new Date(), "yyyy-MM-dd")

  const { data: employees } = await supabase
    .from("employees")
    .select("id, employee_code, name, designation, department, ot_rate_per_hour")
    .eq("status", "active")
    .order("name", { ascending: true })

  const { data: attendance } = await supabase
    .from("attendance")
    .select("*")
    .eq("date", selectedDate)

  return (
    <div>
      <DashboardHeader title="Attendance History" description="View and edit past attendance records" />
      <div className="p-6 space-y-4">
        <DateSelector initialDate={selectedDate} />
        <DailyAttendanceSheet
          employees={employees || []}
          initialDate={selectedDate}
          initialAttendance={attendance || []}
        />
      </div>
    </div>
  )
}
