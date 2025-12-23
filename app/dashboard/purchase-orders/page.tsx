import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { PurchaseOrdersTable } from "@/components/purchase-orders-table"

export default async function PurchaseOrdersPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  const { data: purchaseOrders } = await supabase
    .from("purchase_orders")
    .select(
      `
      *,
      vendors:vendor_id (
        vendor_code,
        company_name
      )
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <div>
      <DashboardHeader
        title="Purchase Orders"
        description="Manage purchase orders and vendor orders"
        action={
          <Button asChild>
            <Link href="/dashboard/purchase-orders/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Purchase Order
            </Link>
          </Button>
        }
      />
      <div className="p-6">
        <PurchaseOrdersTable purchaseOrders={purchaseOrders || []} />
      </div>
    </div>
  )
}
