"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Vendor {
  id: string
  vendor_code: string
  company_name: string
  contact_person: string | null
  phone: string | null
  email: string | null
  gst_number: string | null
  payment_terms: string | null
  status: string
}

export function VendorsTable({ vendors }: { vendors: Vendor[] }) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vendor?")) return

    const supabase = createClient()
    const { error } = await supabase.from("vendors").delete().eq("id", id)

    if (error) {
      alert("Error deleting vendor: " + error.message)
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
            <TableHead>Payment Terms</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vendors.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No vendors found. Add your first vendor to get started.
              </TableCell>
            </TableRow>
          ) : (
            vendors.map((vendor) => (
              <TableRow key={vendor.id}>
                <TableCell className="font-mono text-sm">{vendor.vendor_code}</TableCell>
                <TableCell className="font-medium">{vendor.company_name}</TableCell>
                <TableCell>{vendor.contact_person || "-"}</TableCell>
                <TableCell>{vendor.phone || "-"}</TableCell>
                <TableCell>{vendor.email || "-"}</TableCell>
                <TableCell className="font-mono text-sm">{vendor.gst_number || "-"}</TableCell>
                <TableCell>{vendor.payment_terms || "-"}</TableCell>
                <TableCell>
                  <Badge variant={vendor.status === "active" ? "default" : "secondary"}>{vendor.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/vendors/${vendor.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(vendor.id)}>
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
