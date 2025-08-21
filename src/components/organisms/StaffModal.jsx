import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';

const departments = [
  'Mathematics',
  'Science',
  'English',
  'History',
  'Physical Education',
  'Art',
  'Music',
  'Computer Science',
  'Administration',
  'Support'
];

const positions = [
  'Teacher',
  'Principal',
  'Vice Principal',
  'Department Head',
  'Counselor',
  'Librarian',
  'Nurse',
  'Administrative Assistant',
  'IT Support',
  'Custodian'
];

const statusOptions = [
  'Active',
  'Inactive',
  'OnLeave'
];

function StaffModal({ isOpen, onClose, onSave, staff = null }) {
  const [formData, setFormData] = useState({
    Name: '',
    Email: '',
    Phone: '',
    Department: '',
    Position: '',
    HireDate: '',
    Salary: '',
    Status: 'Active'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (staff) {
      setFormData({
        Name: staff.Name || '',
        Email: staff.Email || '',
        Phone: staff.Phone || '',
        Department: staff.Department || '',
        Position: staff.Position || '',
        HireDate: staff.HireDate ? staff.HireDate.split('T')[0] : '',
        Salary: staff.Salary || '',
        Status: staff.Status || 'Active'
      });
    } else {
      setFormData({
        Name: '',
        Email: '',
        Phone: '',
        Department: '',
        Position: '',
        HireDate: '',
        Salary: '',
        Status: 'Active'
      });
    }
    setErrors({});
  }, [staff, isOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.Name.trim()) {
      newErrors.Name = 'Name is required';
    }

    if (!formData.Email.trim()) {
      newErrors.Email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.Email)) {
      newErrors.Email = 'Please enter a valid email address';
    }

    if (!formData.Department.trim()) {
      newErrors.Department = 'Department is required';
    }

    if (!formData.Position.trim()) {
      newErrors.Position = 'Position is required';
    }

    if (!formData.HireDate) {
      newErrors.HireDate = 'Hire date is required';
    }

    if (!formData.Salary || parseFloat(formData.Salary) <= 0) {
      newErrors.Salary = 'Please enter a valid salary amount';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        Salary: parseFloat(formData.Salary),
        HireDate: formData.HireDate
      };

      await onSave(submitData);
    } catch (error) {
      console.error('Failed to save staff member:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {staff ? 'Edit Staff Member' : 'Add Staff Member'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              disabled={isSubmitting}
            >
              <ApperIcon name="X" size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col max-h-[calc(90vh-120px)]">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Personal Information */}
                <div className="md:col-span-2">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                </div>

                <FormField
                  label="Full Name"
                  name="Name"
                  type="text"
                  value={formData.Name}
                  onChange={handleInputChange}
                  error={errors.Name}
                  placeholder="Enter full name"
                  required
                />

                <FormField
                  label="Email Address"
                  name="Email"
                  type="email"
                  value={formData.Email}
                  onChange={handleInputChange}
                  error={errors.Email}
                  placeholder="Enter email address"
                  required
                />

                <FormField
                  label="Phone Number"
                  name="Phone"
                  type="tel"
                  value={formData.Phone}
                  onChange={handleInputChange}
                  error={errors.Phone}
                  placeholder="Enter phone number"
                />

                {/* Professional Information */}
                <div className="md:col-span-2 mt-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Professional Information</h3>
                </div>

                <FormField
                  label="Department"
                  name="Department"
                  type="select"
                  value={formData.Department}
                  onChange={handleInputChange}
                  error={errors.Department}
                  options={[
                    { value: '', label: 'Select department' },
                    ...departments.map(dept => ({ value: dept, label: dept }))
                  ]}
                  required
                />

                <FormField
                  label="Position"
                  name="Position"
                  type="select"
                  value={formData.Position}
                  onChange={handleInputChange}
                  error={errors.Position}
                  options={[
                    { value: '', label: 'Select position' },
                    ...positions.map(pos => ({ value: pos, label: pos }))
                  ]}
                  required
                />
<FormField
                  label="Status"
                  name="Status"
                  type="select"
                  value={formData.Status}
                  onChange={handleInputChange}
                  error={errors.Status}
                  options={statusOptions.map(status => ({ 
                    value: status, 
                    label: status === 'OnLeave' ? 'On Leave' : status 
                  }))}
                  required
                />

                <FormField
                  label="Hire Date"
                  name="HireDate"
                  type="date"
                  value={formData.HireDate}
                  onChange={handleInputChange}
                  error={errors.HireDate}
                  required
                />

                <FormField
                  label="Annual Salary"
                  name="Salary"
                  type="number"
                  value={formData.Salary}
                  onChange={handleInputChange}
                  error={errors.Salary}
                  placeholder="Enter annual salary"
                  min="0"
                  step="1000"
                  required
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                {isSubmitting && <ApperIcon name="Loader2" size={16} className="animate-spin" />}
                {staff ? 'Update Staff Member' : 'Add Staff Member'}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default StaffModal;