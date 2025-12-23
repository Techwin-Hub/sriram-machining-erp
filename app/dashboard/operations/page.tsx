import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { OperationsTable } from "@/components/operations-table"

export default async function OperationsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: operations } = await supabase.from("operations").select("*").order("created_at", { ascending: false })

  return (
    <div>
      <DashboardHeader
        title="Operations"
        description="Manage production operations and processes"
        action={
          <Button asChild>
            <Link href="/dashboard/operations/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Operation
            </Link>
          </Button>
        }
      />
      <div className="p-6">
        <OperationsTable operations={operations || []} />
      </div>
    </div>
  )
}
