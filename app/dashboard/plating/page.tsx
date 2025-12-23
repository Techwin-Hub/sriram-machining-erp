import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PlatingJobsTable } from "@/components/plating-jobs-table"

export default async function PlatingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: platingJobs } = await supabase
    .from("plating_jobs")
    .select(
      `
      *,
      job_cards:job_card_id (
        job_card_number
      ),
      parts:part_id (
        part_code,
        part_name
      )
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div>
      <DashboardHeader
        title="Plating Jobs"
        description="Manage plating operations and jobs"
        action={
          <Button asChild>
            <Link href="/dashboard/plating/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Plating Job
            </Link>
          </Button>
        }
      />
      <div className="p-6">
        <PlatingJobsTable platingJobs={platingJobs || []} />
      </div>
    </div>
  )
}
