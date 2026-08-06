/**
 * Customers feature exports.
 */

// API
export { CustomerApi } from "./api/customer.api";

// Components
export { CustomerCard } from "./components/CustomerCard";
export { CustomerFilters } from "./components/CustomerFilters";
export { CustomerForm } from "./components/CustomerForm";
export type {
  CustomerFormValues,
} from "./components/CustomerForm";
export { CustomerTable } from "./components/CustomerTable";
export { DeleteCustomerDialog } from "./components/DeleteCustomerDialog";

// Hooks
export {
  customerQueryKeys,
  useCustomers,
} from "./hooks/useCustomers";
export { useCustomer } from "./hooks/useCustomer";

// Pages
export { CreateCustomerPage } from "./pages/CreateCustomerPage";
export { CustomerDetailsPage } from "./pages/CustomerDetailsPage";
export { CustomersPage } from "./pages/CustomersPage";
export { EditCustomerPage } from "./pages/EditCustomerPage";

// Schemas
export {
  createCustomerSchema,
  customerListResponseSchema,
  customerResponseSchema,
  customerSchema,
  updateCustomerSchema,
} from "./schemas/customer.schema";

export type {
  CreateCustomerSchema,
  CustomerListResponseSchema,
  CustomerResponseSchema,
  CustomerSchema,
  UpdateCustomerSchema,
} from "./schemas/customer.schema";

// Services
export { CustomerService } from "./services/customer.service";

// Types
export type {
  CreateCustomerRequest,
  Customer,
  CustomerListResponse,
  CustomerResponse,
  UpdateCustomerRequest,
} from "./types/customer.types";