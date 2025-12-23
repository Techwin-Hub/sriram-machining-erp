"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface OperationFormProps {
  operation?: {
    id: string
    operation_code: string
    operation_name: string
    description: string | null
    standard_time_minutes: number | null
    cost_per_operation: number | null
  }
}

export function OperationForm({ operation }: OperationFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    operation_code: operation?.operation_code || "",
    operation_name: operation?.operation_name || "",
    description: operation?.description || "",
    standard_time_minutes: operation?.standard_time_minutes?.toString() || "",
    cost_per_operation: operation?.cost_per_operation?.toString() || "",
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
      standard_time_minutes: formData.standard_time_minutes ? Number.parseInt(formData.standard_time_minutes) : null,
      cost_per_operation: formData.cost_per_operation ? Number.parseFloat(formData.cost_per_operation) : null,
    }

    let error
    if (operation) {
      const result = await supabase.from("operations").update(data).eq("id", operation.id)
      error = result.error
    } else {
      const result = await supabase.from("operations").insert([data])
      error = result.error
    }

    if (error) {
      alert("Error saving operation: " + error.message)
      setIsLoading(false)
    } else {
      router.push("/dashboard/operations")
      router.refresh()
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{operation ? "Edit Operation" : "New Operation"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="operation_code">Operation Code *</Label>
              <Input
                id="operation_code"
                required
                value={formData.operation_code}
                onChange={(e) => setFormData({ ...formData, operation_code: e.target.value })}
                placeholder="OP-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="operation_name">Operation Name *</Label>
              <Input
                id="operation_name"
                required
                value={formData.operation_name}
                onChange={(e) => setFormData({ ...formData, operation_name: e.target.value })}
                placeholder="Cutting"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter operation description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="standard_time_minutes">Standard Time (minutes)</Label>
              <Input
                id="standard_time_minutes"
                type="number"
                value={formData.standard_time_minutes}
                onChange={(e) => setFormData({ ...formData, standard_time_minutes: e.target.value })}
                placeholder="15"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost_per_operation">Cost per Operation (₹)</Label>
              <Input
                id="cost_per_operation"
                type="number"
                step="0.01"
                value={formData.cost_per_operation}
                onChange={(e) => setFormData({ ...formData, cost_per_operation: e.target.value })}
                placeholder="50.00"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : operation ? "Update Operation" : "Create Operation"}
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
