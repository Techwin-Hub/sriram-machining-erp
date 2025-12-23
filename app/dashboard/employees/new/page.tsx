import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { EmployeeForm } from "@/components/employee-form"

export default async function NewEmployeePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div>
      <DashboardHeader title="Add New Employee" description="Enter employee details" />
      <div className="p-6">
        <EmployeeForm />
      </div>
    </div>
  )
}
