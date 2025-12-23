"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Trash2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface Part {
  id: string
  part_code: string
  part_name: string
  description: string | null
  unit_of_measurement: string
  current_stock: number
  minimum_stock_level: number
  reorder_level: number
  status: string
}

export function PartsTable({ parts }: { parts: Part[] }) {
  const router = useRouter()

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this part?")) return

    const supabase = createClient()
    const { error } = await supabase.from("parts").delete().eq("id", id)

    if (error) {
      alert("Error deleting part: " + error.message)
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
            <TableHead>Unit</TableHead>
            <TableHead>Current Stock</TableHead>
            <TableHead>Min Level</TableHead>
            <TableHead>Reorder Level</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {parts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No parts found. Add your first part to get started.
              </TableCell>
            </TableRow>
          ) : (
            parts.map((part) => {
              const isLowStock = part.current_stock <= part.reorder_level
              return (
                <TableRow key={part.id}>
                  <TableCell className="font-mono text-sm">{part.part_code}</TableCell>
                  <TableCell className="font-medium">{part.part_name}</TableCell>
                  <TableCell className="max-w-xs truncate">{part.description || "-"}</TableCell>
                  <TableCell>{part.unit_of_measurement}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isLowStock && <AlertTriangle className="h-4 w-4 text-destructive" />}
                      <span className={isLowStock ? "text-destructive font-medium" : ""}>{part.current_stock}</span>
                    </div>
                  </TableCell>
                  <TableCell>{part.minimum_stock_level}</TableCell>
                  <TableCell>{part.reorder_level}</TableCell>
                  <TableCell>
                    <Badge variant={part.status === "active" ? "default" : "secondary"}>{part.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/dashboard/parts/${part.id}`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(part.id)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
