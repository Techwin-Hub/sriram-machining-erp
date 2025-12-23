import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { MachinesTable } from "@/components/machines-table"

export default async function MachinesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: machines } = await supabase.from("machines").select("*").order("created_at", { ascending: false })

  return (
    <div>
      <DashboardHeader
        title="Machines"
        description="Manage production machines and equipment"
        action={
          <Button asChild>
            <Link href="/dashboard/machines/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Machine
            </Link>
          </Button>
        }
      />
      <div className="p-6">
        <MachinesTable machines={machines || []} />
      </div>
    </div>
  )
}
