import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { MachineForm } from "@/components/machine-form"

export default async function NewMachinePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div>
      <DashboardHeader title="Add New Machine" description="Enter machine details" />
      <div className="p-6">
        <MachineForm />
      </div>
    </div>
  )
}
