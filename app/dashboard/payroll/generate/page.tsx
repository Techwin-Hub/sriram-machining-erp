import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { PayrollGenerateForm } from "@/components/payroll-generate-form"

export default async function GeneratePayrollPage() {
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
      <DashboardHeader title="Generate Payroll" description="Calculate and generate payroll for employees" />
      <div className="p-6">
        <PayrollGenerateForm employees={employees || []} />
      </div>
    </div>
  )
}
