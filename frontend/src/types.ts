export interface Availability {
    id: number;
    employee_id: number;
    date: string;
    start_hour: number;
    end_hour: number;
    priority: number;
};

export interface User {
    name: string; 
    is_admin: boolean; 
    email: string
};