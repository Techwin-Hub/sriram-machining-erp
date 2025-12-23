"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Operation {
  id: string
  operation_code: string
  operation_name: string
  description: string | null
  standard_time_minutes: number | null
  cost_per_operation: number | null
}

export function OperationsTable({ operations }: { operations: Operation[] }) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this operation?")) return

    const supabase = createClient()
    const { error } = await supabase.from("operations").delete().eq("id", id)

    if (error) {
      alert("Error deleting operation: " + error.message)
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
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Standard Time (min)</TableHead>
            <TableHead>Cost per Operation</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operations.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No operations found. Add your first operation to get started.
              </TableCell>
            </TableRow>
          ) : (
            operations.map((operation) => (
              <TableRow key={operation.id}>
                <TableCell className="font-mono text-sm">{operation.operation_code}</TableCell>
                <TableCell className="font-medium">{operation.operation_name}</TableCell>
                <TableCell className="max-w-xs truncate">{operation.description || "-"}</TableCell>
                <TableCell>{operation.standard_time_minutes || "-"}</TableCell>
                <TableCell>{operation.cost_per_operation ? `₹${operation.cost_per_operation}` : "-"}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/operations/${operation.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(operation.id)}>
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
