"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, DollarSign } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Invoice {
  id: string
  invoice_number: string
  invoice_date: string
  due_date: string
  total_amount: number
  amount_paid: number
  balance: number
  payment_status: string
  customers: {
    customer_code: string
    company_name: string
  } | null
}

export function InvoicesTable({ invoices }: { invoices: Invoice[] }) {
  const router = useRouter()

  const handleRecordPayment = async (id: string, balance: number) => {
    const amount = prompt(`Enter payment amount (Balance: ₹${balance}):`)
    if (!amount) return

    const paymentAmount = Number.parseFloat(amount)
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      alert("Invalid amount")
      return
    }

    const supabase = createClient()
    const { data: invoice } = await supabase.from("invoices").select("amount_paid, total_amount").eq("id", id).single()

    if (!invoice) return

    const newAmountPaid = Number(invoice.amount_paid) + paymentAmount
    const newBalance = Number(invoice.total_amount) - newAmountPaid

    let newStatus = "unpaid"
    if (newBalance <= 0) {
      newStatus = "paid"
    } else if (newAmountPaid > 0) {
      newStatus = "partially_paid"
    }

    const { error } = await supabase
      .from("invoices")
      .update({
        amount_paid: newAmountPaid,
        payment_status: newStatus,
      })
      .eq("id", id)

    if (error) {
      alert("Error recording payment: " + error.message)
    } else {
      router.refresh()
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "paid":
        return "default"
      case "partially_paid":
        return "secondary"
      case "unpaid":
        return "outline"
      case "overdue":
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
            <TableHead>Invoice #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Paid</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No invoices found. Create your first invoice to get started.
              </TableCell>
            </TableRow>
          ) : (
            invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono text-sm font-medium">{invoice.invoice_number}</TableCell>
                <TableCell>{invoice.customers?.company_name || "-"}</TableCell>
                <TableCell>{new Date(invoice.invoice_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(invoice.due_date).toLocaleDateString()}</TableCell>
                <TableCell>₹{Number(invoice.total_amount).toLocaleString()}</TableCell>
                <TableCell className="text-accent">₹{Number(invoice.amount_paid).toLocaleString()}</TableCell>
                <TableCell className="font-semibold">₹{Number(invoice.balance).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(invoice.payment_status)}>
                    {invoice.payment_status.replace("_", " ")}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/invoices/${invoice.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {invoice.payment_status !== "paid" && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRecordPayment(invoice.id, Number(invoice.balance))}
                      >
                        <DollarSign className="h-4 w-4 text-accent" />
                      </Button>
                    )}
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
