"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

// Mock data - later vervangen door echte data
const initialCourses = [
  {
    id: 1,
    title: "Basis Cybersecurity",
    description: "Essentiële cybersecurity training voor alle medewerkers",
    status: "published",
    modules: 4,
    duration: "2 uur",
    tags: ["NIS2", "AVG", "Verplicht"]
  },
  {
    id: 2,
    title: "Phishing Herkenning",
    description: "Leer phishing e-mails en aanvallen herkennen",
    status: "draft",
    modules: 3,
    duration: "1.5 uur",
    tags: ["Phishing", "E-mail"]
  },
  {
    id: 3,
    title: "AVG Fundamentals",
    description: "Basisprincipes van de Algemene Verordening Gegevensbescherming",
    status: "published",
    modules: 5,
    duration: "2.5 uur",
    tags: ["AVG", "Privacy"]
  }
]

export default function ContentManagementPage() {
  const [courses, setCourses] = useState(initialCourses)
  const [newCourseTitle, setNewCourseTitle] = useState("")

  const addCourse = () => {
    if (newCourseTitle.trim()) {
      const newCourse = {
        id: courses.length + 1,
        title: newCourseTitle,
        description: "Nieuwe cursus - beschrijving toevoegen",
        status: "draft",
        modules: 0,
        duration: "0 uur",
        tags: ["Nieuw"]
      }
      setCourses([...courses, newCourse])
      setNewCourseTitle("")
    }
  }

  const toggleStatus = (id: number) => {
    setCourses(courses.map(course => 
      course.id === id 
        ? { ...course, status: course.status === "published" ? "draft" : "published" }
        : course
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Content Beheer</h1>
          <p className="text-gray-600">Beheer cursussen, modules en lessen</p>
        </div>
        <div className="flex space-x-4">
          <Input 
            placeholder="Nieuwe cursus naam..."
            value={newCourseTitle}
            onChange={(e) => setNewCourseTitle(e.target.value)}
            className="w-64"
          />
          <Button onClick={addCourse}>Cursus Toevoegen</Button>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{course.title}</CardTitle>
                <Badge variant={course.status === "published" ? "default" : "secondary"}>
                  {course.status === "published" ? "Gepubliceerd" : "Concept"}
                </Badge>
              </div>
              <CardDescription>{course.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Course Info */}
              <div className="flex justify-between text-sm text-gray-600">
                <span>{course.modules} modules</span>
                <span>{course.duration}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1">
                {course.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Actions */}
              <div className="flex space-x-2 pt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  Bewerken
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleStatus(course.id)}
                >
                  {course.status === "published" ? "Archiveren" : "Publiceren"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Statistieken</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
              <div className="text-sm text-gray-600">Totaal Cursussen</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">
                {courses.filter(c => c.status === "published").length}
              </div>
              <div className="text-sm text-gray-600">Gepubliceerd</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {courses.filter(c => c.status === "draft").length}
              </div>
              <div className="text-sm text-gray-600">Concept</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">
                {courses.reduce((total, course) => total + course.modules, 0)}
              </div>
              <div className="text-sm text-gray-600">Totaal Modules</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}