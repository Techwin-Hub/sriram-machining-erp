import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { EmployeeForm } from "@/components/employee-form"

export default async function EditEmployeePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: employee } = await supabase.from("employees").select("*").eq("id", id).single()

  if (!employee) {
    redirect("/dashboard/employees")
  }

  return (
    <div>
      <DashboardHeader title="Edit Employee" description="Update employee details" />
      <div className="p-6">
        <EmployeeForm employee={employee} />
      </div>
    </div>
  )
}
