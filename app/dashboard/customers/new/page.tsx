import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { CustomerForm } from "@/components/customer-form"

export default async function NewCustomerPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div>
      <DashboardHeader title="Add New Customer" description="Enter customer details" />
      <div className="p-6">
        <CustomerForm />
      </div>
    </div>
  )
}
