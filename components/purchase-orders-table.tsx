"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit } from "lucide-react"
import Link from "next/link"

interface PurchaseOrder {
  id: string
  po_number: string
  po_date: string
  expected_delivery_date: string | null
  total_amount: number | null
  status: string
  vendors: {
    vendor_code: string
    company_name: string
  } | null
}

export function PurchaseOrdersTable({ purchaseOrders }: { purchaseOrders: PurchaseOrder[] }) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "draft":
        return "outline"
      case "sent":
        return "secondary"
      case "acknowledged":
        return "default"
      case "partially_received":
        return "secondary"
      case "received":
        return "default"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>PO Number</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>PO Date</TableHead>
            <TableHead>Expected Delivery</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {purchaseOrders.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No purchase orders found. Create your first purchase order to get started.
              </TableCell>
            </TableRow>
          ) : (
            purchaseOrders.map((po) => (
              <TableRow key={po.id}>
                <TableCell className="font-mono text-sm font-medium">{po.po_number}</TableCell>
                <TableCell>{po.vendors?.company_name || "-"}</TableCell>
                <TableCell>{new Date(po.po_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {po.expected_delivery_date ? new Date(po.expected_delivery_date).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell>{po.total_amount ? `₹${Number(po.total_amount).toLocaleString()}` : "-"}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(po.status)}>{po.status.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/purchase-orders/${po.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/purchase-orders/${po.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
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
