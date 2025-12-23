import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { OperationForm } from "@/components/operation-form"

export default async function NewOperationPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div>
      <DashboardHeader title="Add New Operation" description="Enter operation details" />
      <div className="p-6">
        <OperationForm />
      </div>
    </div>
  )
}
