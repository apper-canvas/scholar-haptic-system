import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import StatCard from '@/components/molecules/StatCard';
import SearchBar from '@/components/molecules/SearchBar';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

function ParentsPage({ onMobileMenuToggle }) {
  const [children, setChildren] = useState([]);
  const [filteredChildren, setFilteredChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock parent-child data - in a real app, this would come from a parent service
  const mockParentChildren = [
    {
      id: 1,
      name: 'Emma Johnson',
      grade: '10th Grade',
      class: 'Mathematics Advanced',
      gradeAverage: 92,
      attendance: 98,
      pendingAssignments: 2,
      lastActivity: '2024-01-15',
      subjects: ['Math', 'Science', 'English', 'History']
    },
    {
      id: 2,
      name: 'Liam Johnson',
      grade: '8th Grade', 
      class: 'General Studies',
      gradeAverage: 87,
      attendance: 95,
      pendingAssignments: 1,
      lastActivity: '2024-01-14',
      subjects: ['Math', 'Science', 'English', 'Social Studies']
    },
    {
      id: 3,
      name: 'Sophia Johnson',
      grade: '12th Grade',
      class: 'AP Biology',
      gradeAverage: 95,
      attendance: 97,
      pendingAssignments: 0,
      lastActivity: '2024-01-15',
      subjects: ['Biology', 'Chemistry', 'Physics', 'Calculus']
    }
  ];

  useEffect(() => {
    loadChildren();
  }, []);

  useEffect(() => {
    filterChildren();
  }, [children, searchTerm]);

  async function loadChildren() {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setChildren(mockParentChildren);
    } catch (err) {
      setError('Failed to load children information');
      toast.error('Failed to load children information');
    } finally {
      setLoading(false);
    }
  }

  function filterChildren() {
    if (!searchTerm.trim()) {
      setFilteredChildren(children);
      return;
    }

    const filtered = children.filter(child =>
      child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.grade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      child.class.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredChildren(filtered);
  }

  function getStatistics() {
    if (children.length === 0) {
      return {
        totalChildren: 0,
        averageGrade: 0,
        averageAttendance: 0,
        totalPendingAssignments: 0
      };
    }

    const totalGrades = children.reduce((sum, child) => sum + child.gradeAverage, 0);
    const totalAttendance = children.reduce((sum, child) => sum + child.attendance, 0);
    const totalPending = children.reduce((sum, child) => sum + child.pendingAssignments, 0);

    return {
      totalChildren: children.length,
      averageGrade: Math.round(totalGrades / children.length),
      averageAttendance: Math.round(totalAttendance / children.length),
      totalPendingAssignments: totalPending
    };
  }

  const stats = getStatistics();

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadChildren} />;

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header title="Parents Dashboard" onMenuToggle={onMobileMenuToggle} />
      
      <main className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              title="Total Children"
              value={stats.totalChildren}
              icon="Users"
              color="blue"
            />
            <StatCard
              title="Average Grade"
              value={`${stats.averageGrade}%`}
              icon="Award"
              color="green"
            />
            <StatCard
              title="Average Attendance"
              value={`${stats.averageAttendance}%`}
              icon="Calendar"
              color="purple"
            />
            <StatCard
              title="Pending Assignments"
              value={stats.totalPendingAssignments}
              icon="Clock"
              color="orange"
            />
          </div>

          {/* Search and Filters */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">My Children</h2>
              <div className="w-full sm:w-auto">
                <SearchBar
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  placeholder="Search by name, grade, or class..."
                />
              </div>
            </div>
          </div>

          {/* Children Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {filteredChildren.length === 0 ? (
              <Empty
                title="No children found"
                description="No children match your current search criteria."
                icon="Users"
              />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Class
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Grade Average
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attendance
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Pending
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredChildren.map((child) => (
                      <tr key={child.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                                <ApperIcon name="User" size={20} className="text-primary-600" />
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{child.name}</div>
                              <div className="text-sm text-gray-500">{child.subjects.join(', ')}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            {child.grade}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {child.class}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${
                              child.gradeAverage >= 90 ? 'text-green-600' :
                              child.gradeAverage >= 80 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {child.gradeAverage}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`text-sm font-medium ${
                              child.attendance >= 95 ? 'text-green-600' :
                              child.attendance >= 90 ? 'text-yellow-600' : 'text-red-600'
                            }`}>
                              {child.attendance}%
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {child.pendingAssignments > 0 ? (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                              {child.pendingAssignments} pending
                            </span>
                          ) : (
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                              Up to date
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default ParentsPage;