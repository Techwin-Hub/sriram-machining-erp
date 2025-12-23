"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit } from "lucide-react"
import Link from "next/link"

interface JobCard {
  id: string
  job_card_number: string
  quantity: number
  start_date: string
  target_date: string
  completion_date: string | null
  status: string
  priority: string
  customers: {
    customer_code: string
    company_name: string
  } | null
  parts: {
    part_code: string
    part_name: string
  } | null
}

export function JobCardsTable({ jobCards }: { jobCards: JobCard[] }) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "in_progress":
        return "default"
      case "completed":
        return "outline"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "destructive"
      case "high":
        return "default"
      case "normal":
        return "secondary"
      case "low":
        return "outline"
      default:
        return "default"
    }
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Job Card #</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Part</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>Target Date</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobCards.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center text-muted-foreground">
                No job cards found. Create your first job card to get started.
              </TableCell>
            </TableRow>
          ) : (
            jobCards.map((jobCard) => (
              <TableRow key={jobCard.id}>
                <TableCell className="font-mono text-sm font-medium">{jobCard.job_card_number}</TableCell>
                <TableCell>{jobCard.customers?.company_name || "-"}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{jobCard.parts?.part_name || "-"}</p>
                    <p className="text-xs text-muted-foreground">{jobCard.parts?.part_code}</p>
                  </div>
                </TableCell>
                <TableCell>{jobCard.quantity}</TableCell>
                <TableCell>{new Date(jobCard.start_date).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(jobCard.target_date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge variant={getPriorityVariant(jobCard.priority)}>{jobCard.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(jobCard.status)}>{jobCard.status.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/job-cards/${jobCard.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/job-cards/${jobCard.id}/edit`}>
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
