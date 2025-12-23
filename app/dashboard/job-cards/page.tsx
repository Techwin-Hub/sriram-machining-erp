import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { JobCardsTable } from "@/components/job-cards-table"

export default async function JobCardsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: jobCards } = await supabase
    .from("job_cards")
    .select(
      `
      *,
      customers:customer_id (
        customer_code,
        company_name
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
        title="Job Cards"
        description="Manage production job cards and orders"
        action={
          <Button asChild>
            <Link href="/dashboard/job-cards/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Job Card
            </Link>
          </Button>
        }
      />
      <div className="p-6">
        <JobCardsTable jobCards={jobCards || []} />
      </div>
    </div>
  )
}
