import mockStaff from '../mockData/staff.json';

class StaffService {
  constructor() {
    this.mockData = [...mockStaff];
    this.nextId = Math.max(...this.mockData.map(s => s.Id)) + 1;
  }

  // Initialize ApperClient when database becomes available
  initializeClient() {
    // This will be implemented when staff database table is available
    const { ApperClient } = window.ApperSDK;
    return new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }
}

// Add realistic delay for mock operations
async function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const staffService = new StaffService();

// Get all staff members
export async function getAll() {
  await delay();
  return [...staffService.mockData];
}

// Get staff member by ID
export async function getById(id) {
  await delay();
  const staff = staffService.mockData.find(s => s.Id === parseInt(id));
  if (!staff) {
    throw new Error('Staff member not found');
  }
  return { ...staff };
}

// Get staff by department
export async function getByDepartment(department) {
  await delay();
  return staffService.mockData
    .filter(staff => staff.Department === department)
    .map(staff => ({ ...staff }));
}

// Create new staff member
export async function create(staffData) {
  await delay();
  
  const newStaff = {
    Id: staffService.nextId++,
    Name: staffData.Name,
    Email: staffData.Email,
    Phone: staffData.Phone || null,
    Department: staffData.Department,
    Position: staffData.Position,
    HireDate: staffData.HireDate,
    Salary: staffData.Salary,
    Status: staffData.Status || 'Active'
  };
  
  staffService.mockData.push(newStaff);
  return { ...newStaff };
}

// Update staff member
export async function update(id, staffData) {
  await delay();
  
  const index = staffService.mockData.findIndex(s => s.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Staff member not found');
  }
  
  const updatedStaff = {
    ...staffService.mockData[index],
    Name: staffData.Name,
    Email: staffData.Email,
    Phone: staffData.Phone || null,
    Department: staffData.Department,
    Position: staffData.Position,
    HireDate: staffData.HireDate,
    Salary: staffData.Salary,
    Status: staffData.Status || 'Active'
  };
  
  staffService.mockData[index] = updatedStaff;
  return { ...updatedStaff };
}

// Delete staff member
export async function deleteStaff(id) {
  await delay();
  
  const index = staffService.mockData.findIndex(s => s.Id === parseInt(id));
  if (index === -1) {
    throw new Error('Staff member not found');
  }
  
  staffService.mockData.splice(index, 1);
  return true;
}

export { staffService };

// Export methods for easy importing
export default {
  getAll,
  getById,
  getByDepartment,
  create,
  update,
  delete: deleteStaff
};