// AdminAuthProvider
import { AdminContext } from './AdminContext';

export default function ProductProvider({ children }) {
  // while loading, value is , then switches to the product name string
  return (
    <AdminContext.Provider>
      {children}
    </AdminContext.Provider>
  );
}
