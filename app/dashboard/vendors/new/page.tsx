import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { DashboardHeader } from "@/components/dashboard-header"
import { VendorForm } from "@/components/vendor-form"

export default async function NewVendorPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div>
      <DashboardHeader title="Add New Vendor" description="Enter vendor details" />
      <div className="p-6">
        <VendorForm />
      </div>
    </div>
  )
}
