"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Edit } from "lucide-react"
import Link from "next/link"

interface PlatingJob {
  id: string
  plating_job_number: string
  plating_type: string
  quantity: number
  weight_kg: number | null
  tank_number: string | null
  duration_minutes: number | null
  status: string
  quality_check_status: string | null
  job_cards: {
    job_card_number: string
  } | null
  parts: {
    part_code: string
    part_name: string
  } | null
}

export function PlatingJobsTable({ platingJobs }: { platingJobs: PlatingJob[] }) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "in_process":
        return "default"
      case "completed":
        return "outline"
      case "failed":
        return "destructive"
      case "rework":
        return "secondary"
      default:
        return "default"
    }
  }

  const getQualityVariant = (status: string | null) => {
    switch (status) {
      case "passed":
        return "default"
      case "failed":
        return "destructive"
      case "pending":
        return "secondary"
      default:
        return "secondary"
    }
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Job #</TableHead>
            <TableHead>Job Card</TableHead>
            <TableHead>Part</TableHead>
            <TableHead>Plating Type</TableHead>
            <TableHead>Quantity</TableHead>
            <TableHead>Weight (kg)</TableHead>
            <TableHead>Tank</TableHead>
            <TableHead>Duration (min)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Quality</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {platingJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={11} className="text-center text-muted-foreground">
                No plating jobs found. Create your first plating job to get started.
              </TableCell>
            </TableRow>
          ) : (
            platingJobs.map((job) => (
              <TableRow key={job.id}>
                <TableCell className="font-mono text-sm font-medium">{job.plating_job_number}</TableCell>
                <TableCell className="font-mono text-sm">{job.job_cards?.job_card_number || "-"}</TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{job.parts?.part_name || "-"}</p>
                    <p className="text-xs text-muted-foreground">{job.parts?.part_code}</p>
                  </div>
                </TableCell>
                <TableCell className="capitalize">{job.plating_type}</TableCell>
                <TableCell>{job.quantity}</TableCell>
                <TableCell>{job.weight_kg || "-"}</TableCell>
                <TableCell>{job.tank_number || "-"}</TableCell>
                <TableCell>{job.duration_minutes || "-"}</TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(job.status)}>{job.status.replace("_", " ")}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={getQualityVariant(job.quality_check_status)}>
                    {job.quality_check_status || "pending"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/plating/${job.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/dashboard/plating/${job.id}/edit`}>
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
