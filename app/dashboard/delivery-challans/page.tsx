import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { DeliveryChallansTable } from "@/components/delivery-challans-table"

export default async function DeliveryChallansPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: deliveryChallans } = await supabase
    .from("delivery_challans")
    .select(
      `
      *,
      customers:customer_id (
        customer_code,
        company_name
      )
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div>
      <DashboardHeader
        title="Delivery Challans"
        description="Manage delivery challans and shipments"
        action={
          <Button asChild>
            <Link href="/dashboard/delivery-challans/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Delivery Challan
            </Link>
          </Button>
        }
      />
      <div className="p-6">
        <DeliveryChallansTable deliveryChallans={deliveryChallans || []} />
      </div>
    </div>
  )
}
