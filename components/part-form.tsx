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

interface PartFormProps {
  part?: {
    id: string
    part_code: string
    part_name: string
    description: string | null
    unit_of_measurement: string
    minimum_stock_level: number
    current_stock: number
    reorder_level: number
    status: string
  }
}

export function PartForm({ part }: PartFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    part_code: part?.part_code || "",
    part_name: part?.part_name || "",
    description: part?.description || "",
    unit_of_measurement: part?.unit_of_measurement || "pieces",
    minimum_stock_level: part?.minimum_stock_level?.toString() || "0",
    current_stock: part?.current_stock?.toString() || "0",
    reorder_level: part?.reorder_level?.toString() || "0",
    status: part?.status || "active",
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
      minimum_stock_level: Number.parseInt(formData.minimum_stock_level),
      current_stock: Number.parseInt(formData.current_stock),
      reorder_level: Number.parseInt(formData.reorder_level),
    }

    let error
    if (part) {
      const result = await supabase.from("parts").update(data).eq("id", part.id)
      error = result.error
    } else {
      const result = await supabase.from("parts").insert([data])
      error = result.error
    }

    if (error) {
      alert("Error saving part: " + error.message)
      setIsLoading(false)
    } else {
      router.push("/dashboard/parts")
      router.refresh()
    }
  }

  return (
    <Card className="max-w-2xl">
      <CardHeader>
        <CardTitle>{part ? "Edit Part" : "New Part"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="part_code">Part Code *</Label>
              <Input
                id="part_code"
                required
                value={formData.part_code}
                onChange={(e) => setFormData({ ...formData, part_code: e.target.value })}
                placeholder="PART-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="part_name">Part Name *</Label>
              <Input
                id="part_name"
                required
                value={formData.part_name}
                onChange={(e) => setFormData({ ...formData, part_name: e.target.value })}
                placeholder="Steel Bracket"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter part description"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="unit_of_measurement">Unit of Measurement *</Label>
              <Select
                value={formData.unit_of_measurement}
                onValueChange={(value) => setFormData({ ...formData, unit_of_measurement: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pieces">Pieces</SelectItem>
                  <SelectItem value="kg">Kilograms (kg)</SelectItem>
                  <SelectItem value="liters">Liters</SelectItem>
                  <SelectItem value="meters">Meters</SelectItem>
                  <SelectItem value="boxes">Boxes</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="current_stock">Current Stock *</Label>
              <Input
                id="current_stock"
                type="number"
                required
                value={formData.current_stock}
                onChange={(e) => setFormData({ ...formData, current_stock: e.target.value })}
                placeholder="100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minimum_stock_level">Minimum Stock Level *</Label>
              <Input
                id="minimum_stock_level"
                type="number"
                required
                value={formData.minimum_stock_level}
                onChange={(e) => setFormData({ ...formData, minimum_stock_level: e.target.value })}
                placeholder="50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorder_level">Reorder Level *</Label>
              <Input
                id="reorder_level"
                type="number"
                required
                value={formData.reorder_level}
                onChange={(e) => setFormData({ ...formData, reorder_level: e.target.value })}
                placeholder="75"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : part ? "Update Part" : "Create Part"}
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
