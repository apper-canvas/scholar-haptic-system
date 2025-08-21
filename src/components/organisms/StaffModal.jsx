import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Button from '@/components/atoms/Button'
import Input from '@/components/atoms/Input'
import Select from '@/components/atoms/Select'
import Label from '@/components/atoms/Label'
import FormField from '@/components/molecules/FormField'
import ApperIcon from '@/components/ApperIcon'

const StaffModal = ({ isOpen, onClose, onSave, staff = null }) => {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Department: '',
    Position: '',
    Status: 'Active',
    HireDate: '',
    Salary: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (staff) {
      setFormData({
        Name: staff.Name || '',
        Email: staff.Email || '',
        Phone: staff.Phone || '',
        Department: staff.Department || '',
        Position: staff.Position || '',
        Status: staff.Status || 'Active',
        HireDate: staff.HireDate || '',
        Salary: staff.Salary || ''
      })
    } else {
      setFormData({
        Name: '',
        Email: '',
        Phone: '',
        Department: '',
        Position: '',
        Status: 'Active',
        HireDate: '',
        Salary: ''
      })
    }
    setErrors({})
  }, [staff, isOpen])

  const departments = [
    'Administration',
    'Teaching',
    'IT Support',
    'Maintenance',
    'Security',
    'Library',
    'Cafeteria',
    'Medical',
    'Transportation',
    'Other'
  ]

  const positions = [
    'Principal',
    'Vice Principal',
    'Teacher',
    'Assistant Teacher',
    'Librarian',
    'IT Administrator',
    'Accountant',
    'Secretary',
    'Janitor',
    'Security Guard',
    'Nurse',
    'Driver',
    'Cook',
    'Other'
  ]

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'On Leave', label: 'On Leave' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.Name.trim()) {
      newErrors.Name = 'Name is required'
    }

    if (!formData.Email.trim()) {
      newErrors.Email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.Email)) {
      newErrors.Email = 'Please enter a valid email address'
    }

    if (!formData.Department.trim()) {
      newErrors.Department = 'Department is required'
    }

    if (!formData.Position.trim()) {
      newErrors.Position = 'Position is required'
}

    if (formData.Phone && !/^[+]?[1-9][\d]{0,15}$/.test(formData.Phone.replace(/\s/g, ''))) {
      newErrors.Phone = 'Please enter a valid phone number'
    }

    if (formData.Salary && isNaN(parseFloat(formData.Salary))) {
      newErrors.Salary = 'Please enter a valid salary amount'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onSave(formData)
    } catch (error) {
      console.error('Error saving staff member:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    if (!loading) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <ApperIcon name="UserCheck" className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {staff ? 'Edit Staff Member' : 'Add Staff Member'}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {staff ? 'Update staff member information' : 'Add a new staff member to your institution'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                disabled={loading}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Basic Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Full Name" required error={errors.Name}>
                      <Input
                        value={formData.Name}
                        onChange={(e) => handleInputChange('Name', e.target.value)}
                        placeholder="Enter full name"
                        disabled={loading}
                      />
                    </FormField>

                    <FormField label="Email Address" required error={errors.Email}>
                      <Input
                        type="email"
                        value={formData.Email}
                        onChange={(e) => handleInputChange('Email', e.target.value)}
                        placeholder="Enter email address"
                        disabled={loading}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Phone Number" error={errors.Phone}>
                      <Input
                        value={formData.Phone}
                        onChange={(e) => handleInputChange('Phone', e.target.value)}
                        placeholder="Enter phone number"
                        disabled={loading}
                      />
                    </FormField>

                    <FormField label="Status" required error={errors.Status}>
                      <Select
                        value={formData.Status}
                        onChange={(value) => handleInputChange('Status', value)}
                        options={statusOptions}
                        disabled={loading}
                      />
                    </FormField>
                  </div>
                </div>

                {/* Work Information */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900 border-b pb-2">Work Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Department" required error={errors.Department}>
                      <Select
                        value={formData.Department}
                        onChange={(value) => handleInputChange('Department', value)}
                        options={departments.map(dept => ({ value: dept, label: dept }))}
                        placeholder="Select department"
                        disabled={loading}
                      />
                    </FormField>

                    <FormField label="Position" required error={errors.Position}>
                      <Select
                        value={formData.Position}
                        onChange={(value) => handleInputChange('Position', value)}
                        options={positions.map(pos => ({ value: pos, label: pos }))}
                        placeholder="Select position"
                        disabled={loading}
                      />
                    </FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField label="Hire Date" error={errors.HireDate}>
                      <Input
                        type="date"
                        value={formData.HireDate}
                        onChange={(e) => handleInputChange('HireDate', e.target.value)}
                        disabled={loading}
                      />
                    </FormField>

                    <FormField label="Salary" error={errors.Salary}>
                      <Input
                        type="number"
                        value={formData.Salary}
                        onChange={(e) => handleInputChange('Salary', e.target.value)}
                        placeholder="Enter salary amount"
                        disabled={loading}
                      />
                    </FormField>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="min-w-[100px]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </div>
                  ) : (
                    staff ? 'Update' : 'Add'
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default StaffModal