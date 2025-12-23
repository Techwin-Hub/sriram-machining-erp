import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { VendorsTable } from "@/components/vendors-table"

export default async function VendorsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: vendors } = await supabase.from("vendors").select("*").order("created_at", { ascending: false })

  return (
    <div>
      <DashboardHeader
        title="Vendors"
        description="Manage vendor accounts and suppliers"
        action={
          <Button asChild>
            <Link href="/dashboard/vendors/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Vendor
            </Link>
          </Button>
        }
      />
      <div className="p-6">
        <VendorsTable vendors={vendors || []} />
      </div>
    </div>
  )
}
