const { ApperClient } = window.ApperSDK;

class StaffService {
  constructor() {
    this.client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    this.tableName = 'staff_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {
            field: {
              Name: "Id"
            }
          },
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "Email"
            }
          },
          {
            field: {
              Name: "Phone"
            }
          },
          {
            field: {
              Name: "Department"
            }
          },
          {
            field: {
              Name: "Position"
            }
          },
          {
            field: {
              Name: "Status"
            }
          },
          {
            field: {
              Name: "HireDate"
            }
          },
          {
            field: {
              Name: "Salary"
            }
          }
        ],
        orderBy: [
          {
            fieldName: "Name",
            sorttype: "ASC"
          }
        ],
        pagingInfo: {
          limit: 1000,
          offset: 0
        }
      };

      const response = await this.client.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data || [];
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error fetching staff from staff service:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error fetching staff from staff service:", error);
        throw error;
      }
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {
            field: {
              Name: "Id"
            }
          },
          {
            field: {
              Name: "Name"
            }
          },
          {
            field: {
              Name: "Email"
            }
          },
          {
            field: {
              Name: "Phone"
            }
          },
          {
            field: {
              Name: "Department"
            }
          },
          {
            field: {
              Name: "Position"
            }
          },
          {
            field: {
              Name: "Status"
            }
          },
          {
            field: {
              Name: "HireDate"
            }
          },
          {
            field: {
              Name: "Salary"
            }
          }
        ]
      };

      const response = await this.client.getRecordById(this.tableName, id, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      return response.data;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error(`Error fetching staff member with ID ${id} from staff service:`, error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error(`Error fetching staff member with ID ${id} from staff service:`, error);
        throw error;
      }
    }
  }

  async create(staffData) {
    try {
      const params = {
        records: [{
          Name: staffData.Name,
          Email: staffData.Email,
          Phone: staffData.Phone || '',
          Department: staffData.Department,
          Position: staffData.Position,
          Status: staffData.Status || 'Active',
          HireDate: staffData.HireDate || '',
          Salary: staffData.Salary ? parseFloat(staffData.Salary) : null
        }]
      };

      const response = await this.client.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);

        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} staff records:${JSON.stringify(failedRecords)}`);
          
          const errorMessages = [];
          failedRecords.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                errorMessages.push(`${error.fieldLabel}: ${error}`);
              });
            }
            if (record.message) errorMessages.push(record.message);
          });

          if (errorMessages.length > 0) {
            throw new Error(errorMessages.join(', '));
          }
        }

        return successfulRecords.length > 0 ? successfulRecords[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error creating staff member in staff service:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error creating staff member in staff service:", error);
        throw error;
      }
    }
  }

  async update(id, staffData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: staffData.Name,
          Email: staffData.Email,
          Phone: staffData.Phone || '',
          Department: staffData.Department,
          Position: staffData.Position,
          Status: staffData.Status || 'Active',
          HireDate: staffData.HireDate || '',
          Salary: staffData.Salary ? parseFloat(staffData.Salary) : null
        }]
      };

      const response = await this.client.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);

        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} staff records:${JSON.stringify(failedUpdates)}`);
          
          const errorMessages = [];
          failedUpdates.forEach(record => {
            if (record.errors) {
              record.errors.forEach(error => {
                errorMessages.push(`${error.fieldLabel}: ${error}`);
              });
            }
            if (record.message) errorMessages.push(record.message);
          });

          if (errorMessages.length > 0) {
            throw new Error(errorMessages.join(', '));
          }
        }

        return successfulUpdates.length > 0 ? successfulUpdates[0].data : null;
      }

      return null;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error updating staff member in staff service:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error updating staff member in staff service:", error);
        throw error;
      }
    }
  }

  async delete(recordIds) {
    try {
      const params = {
        RecordIds: Array.isArray(recordIds) ? recordIds : [recordIds]
      };

      const response = await this.client.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const successfulDeletions = response.results.filter(result => result.success);
        const failedDeletions = response.results.filter(result => !result.success);

        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} staff records:${JSON.stringify(failedDeletions)}`);
          
          const errorMessages = [];
          failedDeletions.forEach(record => {
            if (record.message) errorMessages.push(record.message);
          });

          if (errorMessages.length > 0) {
            throw new Error(errorMessages.join(', '));
          }
        }

        return successfulDeletions.length === params.RecordIds.length;
      }

      return false;
    } catch (error) {
      if (error?.response?.data?.message) {
        console.error("Error deleting staff members in staff service:", error.response.data.message);
        throw new Error(error.response.data.message);
      } else {
        console.error("Error deleting staff members in staff service:", error);
        throw error;
      }
    }
  }
}

export const staffService = new StaffService();