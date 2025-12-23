"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Customer {
  id: string
  customer_code: string
  company_name: string
  contact_person: string | null
  phone: string | null
  email: string | null
  gst_number: string | null
  credit_limit: number | null
  status: string
}

export function CustomersTable({ customers }: { customers: Customer[] }) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer?")) return

    const supabase = createClient()
    const { error } = await supabase.from("customers").delete().eq("id", id)

    if (error) {
      alert("Error deleting customer: " + error.message)
    } else {
      router.refresh()
    }
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Code</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Contact Person</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>GST Number</TableHead>
            <TableHead>Credit Limit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No customers found. Add your first customer to get started.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell className="font-mono text-sm">{customer.customer_code}</TableCell>
                <TableCell className="font-medium">{customer.company_name}</TableCell>
                <TableCell>{customer.contact_person || "-"}</TableCell>
                <TableCell>{customer.phone || "-"}</TableCell>
                <TableCell>{customer.email || "-"}</TableCell>
                <TableCell className="font-mono text-sm">{customer.gst_number || "-"}</TableCell>
                <TableCell>{customer.credit_limit ? `₹${customer.credit_limit.toLocaleString()}` : "-"}</TableCell>
                <TableCell>
                  <Badge variant={customer.status === "active" ? "default" : "secondary"}>{customer.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/customers/${customer.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(customer.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
