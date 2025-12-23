import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { PlatingJobForm } from "@/components/plating-job-form"

export default async function NewPlatingJobPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const [{ data: jobCards }, { data: parts }] = await Promise.all([
    supabase.from("job_cards").select("*").order("job_card_number", { ascending: false }),
    supabase.from("parts").select("*").eq("status", "active").order("part_name", { ascending: true }),
  ])

  return (
    <div>
      <DashboardHeader title="Create Plating Job" description="Create a new plating operation" />
      <div className="p-6">
        <PlatingJobForm jobCards={jobCards || []} parts={parts || []} />
      </div>
    </div>
  )
}
