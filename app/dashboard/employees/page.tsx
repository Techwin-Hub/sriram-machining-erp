import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { EmployeesTable } from "@/components/employees-table"

export default async function EmployeesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: employees } = await supabase.from("employees").select("*").order("created_at", { ascending: false })

  return (
    <div>
      <DashboardHeader
        title="Employees"
        description="Manage employee records and information"
        action={
          <Button asChild>
            <Link href="/dashboard/employees/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Link>
          </Button>
        }
      />
      <div className="p-6">
        <EmployeesTable employees={employees || []} />
      </div>
    </div>
  )
}
