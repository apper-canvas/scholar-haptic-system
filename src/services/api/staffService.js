import mockStaff from "../mockData/staff.json";
import React from "react";
import Error from "@/components/ui/Error";

// Initialize ApperClient for database operations
function initializeApperClient() {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
}

const TABLE_NAME = 'staff_c';

// Add realistic delay for mock operations
async function delay(ms = 300) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Service object with database methods
const staffService = {
  getAll,
  getById,
  getByDepartment,
  create,
  update,
  delete: deleteStaff
};

// Get all staff members
// Get all staff members
export async function getAll() {
  try {
    const apperClient = initializeApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } },
        { field: { Name: "ModifiedOn" } },
        { field: { Name: "ModifiedBy" } },
        { field: { Name: "firstName_c" } },
        { field: { Name: "lastName_c" } },
        { field: { Name: "email_c" } },
        { field: { Name: "phone_c" } },
        { field: { Name: "jobTitle_c" } },
        { field: { Name: "department_c" } }
      ],
      orderBy: [
        { fieldName: "Name", sorttype: "ASC" }
      ],
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error fetching staff:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error fetching staff:", error);
      throw error;
    }
  }
}

// Get staff member by ID
export async function getById(id) {
  try {
    const apperClient = initializeApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "Owner" } },
        { field: { Name: "CreatedOn" } },
        { field: { Name: "CreatedBy" } },
        { field: { Name: "ModifiedOn" } },
        { field: { Name: "ModifiedBy" } },
        { field: { Name: "firstName_c" } },
        { field: { Name: "lastName_c" } },
        { field: { Name: "email_c" } },
        { field: { Name: "phone_c" } },
        { field: { Name: "jobTitle_c" } },
        { field: { Name: "department_c" } }
      ]
    };
    
    const response = await apperClient.getRecordById(TABLE_NAME, parseInt(id), params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (!response.data) {
      throw new Error('Staff member not found');
    }
    
    return response.data;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching staff with ID ${id}:`, error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error(`Error fetching staff with ID ${id}:`, error);
      throw error;
    }
  }
}

// Get staff by department
export async function getByDepartment(department) {
  try {
    const apperClient = initializeApperClient();
    
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { Name: "firstName_c" } },
        { field: { Name: "lastName_c" } },
        { field: { Name: "email_c" } },
        { field: { Name: "phone_c" } },
        { field: { Name: "jobTitle_c" } },
        { field: { Name: "department_c" } }
      ],
      where: [
        {
          FieldName: "department_c",
          Operator: "EqualTo",
          Values: [department],
          Include: true
        }
      ],
      orderBy: [
        { fieldName: "Name", sorttype: "ASC" }
      ]
    };
    
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    return response.data || [];
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error(`Error fetching staff by department ${department}:`, error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error(`Error fetching staff by department ${department}:`, error);
      throw error;
    }
  }
}

// Create new staff member
export async function create(staffData) {
  try {
    const apperClient = initializeApperClient();
    
    // Only include Updateable fields
    const params = {
      records: [
        {
          Name: staffData.Name,
          Tags: staffData.Tags || "",
          firstName_c: staffData.firstName_c || staffData.firstName,
          lastName_c: staffData.lastName_c || staffData.lastName,
          email_c: staffData.email_c || staffData.Email,
          phone_c: staffData.phone_c || staffData.Phone,
          jobTitle_c: staffData.jobTitle_c || staffData.Position,
          department_c: staffData.department_c || staffData.Department
        }
      ]
    };
    
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulRecords = response.results.filter(result => result.success);
      const failedRecords = response.results.filter(result => !result.success);
      
      if (failedRecords.length > 0) {
        console.error(`Failed to create staff ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
        
        failedRecords.forEach(record => {
          if (record.message) throw new Error(record.message);
        });
      }
      
      return successfulRecords.length > 0 ? successfulRecords[0].data : null;
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error creating staff:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error creating staff:", error);
      throw error;
    }
  }
}

// Update staff member
export async function update(id, staffData) {
  try {
    const apperClient = initializeApperClient();
    
    // Only include Updateable fields plus Id
    const params = {
      records: [
        {
          Id: parseInt(id),
          Name: staffData.Name,
          Tags: staffData.Tags || "",
          firstName_c: staffData.firstName_c || staffData.firstName,
          lastName_c: staffData.lastName_c || staffData.lastName,
          email_c: staffData.email_c || staffData.Email,
          phone_c: staffData.phone_c || staffData.Phone,
          jobTitle_c: staffData.jobTitle_c || staffData.Position,
          department_c: staffData.department_c || staffData.Department
        }
      ]
    };
    
    const response = await apperClient.updateRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulUpdates = response.results.filter(result => result.success);
      const failedUpdates = response.results.filter(result => !result.success);
      
      if (failedUpdates.length > 0) {
        console.error(`Failed to update staff ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
        
        failedUpdates.forEach(record => {
          if (record.message) throw new Error(record.message);
        });
      }
      
      return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
    }
    
    return null;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error updating staff:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error updating staff:", error);
      throw error;
    }
  }
}

// Delete staff member
export async function deleteStaff(id) {
  try {
    const apperClient = initializeApperClient();
    
    const params = {
      RecordIds: [parseInt(id)]
    };
    
    const response = await apperClient.deleteRecord(TABLE_NAME, params);
    
    if (!response.success) {
      console.error(response.message);
      throw new Error(response.message);
    }
    
    if (response.results) {
      const successfulDeletions = response.results.filter(result => result.success);
      const failedDeletions = response.results.filter(result => !result.success);
      
      if (failedDeletions.length > 0) {
        console.error(`Failed to delete staff ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
        
        failedDeletions.forEach(record => {
          if (record.message) throw new Error(record.message);
        });
      }
      
      return successfulDeletions.length > 0;
    }
    
    return false;
  } catch (error) {
    if (error?.response?.data?.message) {
      console.error("Error deleting staff:", error?.response?.data?.message);
      throw new Error(error?.response?.data?.message);
    } else {
      console.error("Error deleting staff:", error);
      throw error;
    }
  }
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