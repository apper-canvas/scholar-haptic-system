import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import StatCard from '@/components/molecules/StatCard'
import SearchBar from '@/components/molecules/SearchBar'
import StaffTable from '@/components/organisms/StaffTable'
import StaffModal from '@/components/organisms/StaffModal'
import Loading from '@/components/ui/Loading'
import Error from '@/components/ui/Error'
import Empty from '@/components/ui/Empty'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
import { staffService } from '@/services/api/staffService'

function StaffPage({ onMobileMenuToggle }) {
  const [staff, setStaff] = useState([])
  const [filteredStaff, setFilteredStaff] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState(null)

  useEffect(() => {
    loadStaff()
  }, [])

  useEffect(() => {
    filterStaff()
  }, [staff, searchTerm])

  async function loadStaff() {
    try {
      setLoading(true)
      setError(null)
      const data = await staffService.getAll()
      setStaff(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error loading staff:', err)
    } finally {
      setLoading(false)
    }
  }

  function filterStaff() {
    if (!searchTerm.trim()) {
      setFilteredStaff(staff)
      return
    }

    const filtered = staff.filter(member => 
      member.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.Department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.Position?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredStaff(filtered)
  }

  function handleAddStaff() {
    setEditingStaff(null)
    setIsModalOpen(true)
  }

  function handleEditStaff(staffMember) {
    setEditingStaff(staffMember)
    setIsModalOpen(true)
  }

  async function handleSaveStaff(staffData) {
    try {
      if (editingStaff) {
        await staffService.update(editingStaff.Id, staffData)
        toast.success('Staff member updated successfully')
      } else {
        await staffService.create(staffData)
        toast.success('Staff member added successfully')
      }
      
      setIsModalOpen(false)
      setEditingStaff(null)
      await loadStaff()
    } catch (error) {
      console.error('Error saving staff member:', error)
      toast.error(error.message || 'Failed to save staff member')
    }
  }

  async function handleDeleteStaff(staffId) {
    if (!confirm('Are you sure you want to delete this staff member?')) {
      return
    }

    try {
      await staffService.delete([staffId])
      toast.success('Staff member deleted successfully')
      await loadStaff()
    } catch (error) {
      console.error('Error deleting staff member:', error)
      toast.error(error.message || 'Failed to delete staff member')
    }
  }

  function getStatistics() {
    const total = staff.length
    const departments = [...new Set(staff.map(s => s.Department).filter(Boolean))].length
    const positions = [...new Set(staff.map(s => s.Position).filter(Boolean))].length
    const activeStaff = staff.filter(s => s.Status === 'Active').length

    return [
      {
        title: 'Total Staff',
        value: total,
        icon: 'UserCheck',
        description: 'Total staff members'
      },
      {
        title: 'Departments',
        value: departments,
        icon: 'Building2',
        description: 'Different departments'
      },
      {
        title: 'Positions',
        value: positions,
        icon: 'Briefcase',
        description: 'Different positions'
      },
      {
        title: 'Active Staff',
        value: activeStaff,
        icon: 'CheckCircle',
        description: 'Currently active'
      }
    ]
  }

  const statistics = getStatistics()

  return (
    <div className="flex-1 flex flex-col bg-gray-50 min-h-screen">
      <Header 
        title="Staff Management" 
        subtitle="Manage your institution's staff members"
        onMobileMenuToggle={onMobileMenuToggle}
      />
      
      <main className="flex-1 p-6 space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statistics.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex-1 max-w-md">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search staff by name, email, department, or position..."
            />
          </div>
          <Button onClick={handleAddStaff} className="whitespace-nowrap">
            <ApperIcon name="Plus" className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>

        {/* Staff Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <Loading message="Loading staff members..." />
          ) : error ? (
            <Error 
              message={error}
              onRetry={loadStaff}
            />
          ) : filteredStaff.length === 0 ? (
            <Empty 
              title="No staff members found"
              description={searchTerm ? "Try adjusting your search criteria" : "Start by adding your first staff member"}
              actionLabel="Add Staff Member"
              onAction={handleAddStaff}
            />
          ) : (
            <StaffTable
              staff={filteredStaff}
              onEdit={handleEditStaff}
              onDelete={handleDeleteStaff}
            />
          )}
        </div>
      </main>

      {/* Staff Modal */}
      <StaffModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setEditingStaff(null)
        }}
        onSave={handleSaveStaff}
        staff={editingStaff}
      />
    </div>
  )
}

export default StaffPage