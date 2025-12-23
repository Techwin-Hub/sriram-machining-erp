import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { JobCardForm } from "@/components/job-card-form"

export default async function NewJobCardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const [{ data: customers }, { data: parts }] = await Promise.all([
    supabase.from("customers").select("*").eq("status", "active").order("company_name", { ascending: true }),
    supabase.from("parts").select("*").eq("status", "active").order("part_name", { ascending: true }),
  ])

  return (
    <div>
      <DashboardHeader title="Create Job Card" description="Create a new production job card" />
      <div className="p-6">
        <JobCardForm customers={customers || []} parts={parts || []} />
      </div>
    </div>
  )
}
