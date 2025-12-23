import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PartsTable } from "@/components/parts-table"

export default async function PartsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: parts } = await supabase.from("parts").select("*").order("created_at", { ascending: false })

  return (
    <div>
      <DashboardHeader
        title="Parts Inventory"
        description="Manage parts and inventory levels"
        action={
          <Button asChild>
            <Link href="/dashboard/parts/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Part
            </Link>
          </Button>
        }
      />
      <div className="p-6">
        <PartsTable parts={parts || []} />
      </div>
    </div>
  )
}
