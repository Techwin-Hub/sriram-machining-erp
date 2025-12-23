"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, FileText } from "lucide-react"
import Link from "next/link"

interface DeliveryChallan {
  id: string
  dc_number: string
  dc_date: string
  vehicle_number: string | null
  driver_name: string | null
  transport_mode: string | null
  total_quantity: number | null
  status: string
  customers: {
    customer_code: string
    company_name: string
  } | null
}

export function DeliveryChallansTable({ deliveryChallans }: { deliveryChallans: DeliveryChallan[] }) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "dispatched":
        return "default"
      case "delivered":
        return "outline"
      case "returned":
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
            <TableHead>DC Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>DC Date</TableHead>
            <TableHead>Vehicle Number</TableHead>
            <TableHead>Driver</TableHead>
            <TableHead>Transport Mode</TableHead>
            <TableHead>Total Qty</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveryChallans.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No delivery challans found. Create your first delivery challan to get started.
              </TableCell>
            </TableRow>
          ) : (
            deliveryChallans.map((dc) => (
              <TableRow key={dc.id}>
                <TableCell className="font-mono text-sm font-medium">{dc.dc_number}</TableCell>
                <TableCell>{dc.customers?.company_name || "-"}</TableCell>
                <TableCell>{new Date(dc.dc_date).toLocaleDateString()}</TableCell>
                <TableCell>{dc.vehicle_number || "-"}</TableCell>
                <TableCell>{dc.driver_name || "-"}</TableCell>
                <TableCell className="capitalize">{dc.transport_mode || "-"}</TableCell>
                <TableCell>{dc.total_quantity || 0}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(dc.status)}>{dc.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/delivery-challans/${dc.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/invoices/new?dc_id=${dc.id}`}>
                        <FileText className="h-4 w-4" />
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
