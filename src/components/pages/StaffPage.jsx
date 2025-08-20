import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import StatCard from '@/components/molecules/StatCard';
import SearchBar from '@/components/molecules/SearchBar';
import StaffTable from '@/components/organisms/StaffTable';
import StaffModal from '@/components/organisms/StaffModal';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import { staffService } from '@/services/api/staffService';

function StaffPage({ onMobileMenuToggle }) {
  // State management
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  // Load staff data
  useEffect(() => {
    loadStaff();
  }, []);

  const loadStaff = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await staffService.getAll();
      setStaff(data);
    } catch (err) {
      setError(err.message || 'Failed to load staff');
      toast.error('Failed to load staff');
    } finally {
      setLoading(false);
    }
  };

  // Filter staff based on search term
  useEffect(() => {
    filterStaff();
  }, [staff, searchTerm]);

  const filterStaff = () => {
    if (!searchTerm) {
      setFilteredStaff(staff);
      return;
    }

    const filtered = staff.filter(member =>
      member.Name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.Email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.Department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.Position?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStaff(filtered);
  };

  // Modal handlers
  const handleAddStaff = () => {
    setEditingStaff(null);
    setIsModalOpen(true);
  };

  const handleEditStaff = (staffMember) => {
    setEditingStaff(staffMember);
    setIsModalOpen(true);
  };

  const handleSaveStaff = async (staffData) => {
    try {
      if (editingStaff) {
        // Update existing staff
        const updatedStaff = await staffService.update(editingStaff.Id, staffData);
        setStaff(prev => prev.map(member => 
          member.Id === editingStaff.Id ? updatedStaff : member
        ));
        toast.success('Staff member updated successfully');
      } else {
        // Create new staff
        const newStaff = await staffService.create(staffData);
        setStaff(prev => [...prev, newStaff]);
        toast.success('Staff member added successfully');
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error.message || 'Failed to save staff member');
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (!window.confirm('Are you sure you want to delete this staff member?')) {
      return;
    }

    try {
      await staffService.delete(staffId);
      setStaff(prev => prev.filter(member => member.Id !== staffId));
      toast.success('Staff member deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete staff member');
    }
  };

  // Statistics
  const getStatistics = () => {
    const totalStaff = staff.length;
    const activeStaff = staff.filter(member => member.Status === 'Active').length;
    const departments = [...new Set(staff.map(member => member.Department))].length;
    const avgExperience = staff.length > 0 ? 
      Math.round(staff.reduce((sum, member) => {
        const years = new Date().getFullYear() - new Date(member.HireDate).getFullYear();
        return sum + years;
      }, 0) / staff.length) : 0;

    return { totalStaff, activeStaff, departments, avgExperience };
  };

  const stats = getStatistics();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadStaff} />;

  return (
    <div className="flex-1 overflow-hidden bg-gray-50">
      <Header 
        title="Staff Management" 
        subtitle="Manage your teaching and administrative staff"
        onMobileMenuToggle={onMobileMenuToggle}
      />
      
      <div className="flex-1 overflow-auto px-6 py-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Staff"
            value={stats.totalStaff}
            icon="UserCheck"
            color="blue"
          />
          <StatCard
            title="Active Staff"
            value={stats.activeStaff}
            icon="UserCheck"
            color="green"
          />
          <StatCard
            title="Departments"
            value={stats.departments}
            icon="Building"
            color="purple"
          />
          <StatCard
            title="Avg Experience"
            value={`${stats.avgExperience} yrs`}
            icon="Clock"
            color="orange"
          />
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              placeholder="Search staff by name, email, department, or position..."
              value={searchTerm}
              onChange={setSearchTerm}
            />
          </div>
          <Button 
            onClick={handleAddStaff}
            className="flex items-center gap-2 whitespace-nowrap"
          >
            <ApperIcon name="Plus" size={18} />
            Add Staff Member
          </Button>
        </div>

        {/* Staff Table */}
        {filteredStaff.length === 0 && !loading ? (
          <Empty 
            title="No staff found"
            description={searchTerm ? 
              "No staff members match your search criteria." : 
              "Start by adding your first staff member."
            }
            action={!searchTerm ? {
              label: "Add Staff Member",
              onClick: handleAddStaff
            } : undefined}
          />
        ) : (
          <StaffTable
            staff={filteredStaff}
            onEditStaff={handleEditStaff}
            onDeleteStaff={handleDeleteStaff}
          />
        )}

        {/* Staff Modal */}
        <StaffModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveStaff}
          staff={editingStaff}
        />
      </div>
    </div>
  );
}

export default StaffPage;