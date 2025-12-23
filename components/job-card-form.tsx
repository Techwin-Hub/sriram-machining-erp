"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface Customer {
  id: string
  customer_code: string
  company_name: string
}

interface Part {
  id: string
  part_code: string
  part_name: string
}

interface JobCardFormProps {
  customers: Customer[]
  parts: Part[]
  jobCard?: {
    id: string
    job_card_number: string
    customer_id: string | null
    part_id: string | null
    quantity: number
    start_date: string
    target_date: string
    status: string
    priority: string
    notes: string | null
  }
}

export function JobCardForm({ customers, parts, jobCard }: JobCardFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const today = new Date().toISOString().split("T")[0]

  const [formData, setFormData] = useState({
    job_card_number: jobCard?.job_card_number || "",
    customer_id: jobCard?.customer_id || "",
    part_id: jobCard?.part_id || "",
    quantity: jobCard?.quantity.toString() || "1",
    start_date: jobCard?.start_date || today,
    target_date: jobCard?.target_date || "",
    status: jobCard?.status || "pending",
    priority: jobCard?.priority || "normal",
    notes: jobCard?.notes || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      alert("You must be logged in")
      return
    }

    const data = {
      ...formData,
      user_id: user.id,
      quantity: Number.parseInt(formData.quantity),
    }

    let error
    if (jobCard) {
      const result = await supabase.from("job_cards").update(data).eq("id", jobCard.id)
      error = result.error
    } else {
      const result = await supabase.from("job_cards").insert([data])
      error = result.error
    }

    if (error) {
      alert("Error saving job card: " + error.message)
      setIsLoading(false)
    } else {
      router.push("/dashboard/job-cards")
      router.refresh()
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{jobCard ? "Edit Job Card" : "New Job Card"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="job_card_number">Job Card Number *</Label>
              <Input
                id="job_card_number"
                required
                value={formData.job_card_number}
                onChange={(e) => setFormData({ ...formData, job_card_number: e.target.value })}
                placeholder="JOB-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customer_id">Customer</Label>
              <Select
                value={formData.customer_id}
                onValueChange={(value) => setFormData({ ...formData, customer_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.company_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="part_id">Part</Label>
              <Select value={formData.part_id} onValueChange={(value) => setFormData({ ...formData, part_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select part" />
                </SelectTrigger>
                <SelectContent>
                  {parts.map((part) => (
                    <SelectItem key={part.id} value={part.id}>
                      {part.part_name} ({part.part_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                required
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                placeholder="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Start Date *</Label>
              <Input
                id="start_date"
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="target_date">Target Date *</Label>
              <Input
                id="target_date"
                type="date"
                required
                value={formData.target_date}
                onChange={(e) => setFormData({ ...formData, target_date: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => setFormData({ ...formData, priority: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional notes"
              rows={3}
            />
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : jobCard ? "Update Job Card" : "Create Job Card"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
