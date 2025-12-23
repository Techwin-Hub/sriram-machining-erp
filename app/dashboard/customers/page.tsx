import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { CustomersTable } from "@/components/customers-table"

export default async function CustomersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: customers } = await supabase.from("customers").select("*").order("created_at", { ascending: false })

  return (
    <div>
      <DashboardHeader
        title="Customers"
        description="Manage customer accounts and information"
        action={
          <Button asChild>
            <Link href="/dashboard/customers/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Link>
          </Button>
        }
      />
      <div className="p-6">
        <CustomersTable customers={customers || []} />
      </div>
    </div>
  )
}
