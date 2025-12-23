import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { PartForm } from "@/components/part-form"

export default async function NewPartPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div>
      <DashboardHeader title="Add New Part" description="Enter part details" />
      <div className="p-6">
        <PartForm />
      </div>
    </div>
  )
}
