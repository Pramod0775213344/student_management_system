# Role-Based Access Control (RBAC) & User Management Plan

This plan aims to implement a comprehensive Role-Based Access Control (RBAC) system for the Student Management System. It will ensure that Admins, Teachers, and Students only see and access the parts of the system relevant to their roles.

## User Roles & Permissions

| Role | Permissions |
| :--- | :--- |
| **Admin** | Full system access, User Management, Academic Setup, Fee Management, etc. |
| **Teacher** | Attendance marking, Exam marks entry, Class Timetable viewing, Subject management (assigned). |
| **Student** | Own Profile, Own Attendance, Results viewing, Fee payments/receipts, Class Timetables. |

## Proposed Changes

### [Backend] (Node.js/Express)

#### [MODIFY] [roleMiddleware.js](file:///d:/Projects%20for%20My%20Portfolio/Student%20Mnagemnt%20system/backend/middleware/roleMiddleware.js)
- Fix the middleware to handle both single role strings and arrays of roles.
- Ensure it correctly checks `req.user.role`.

#### [MODIFY] [authRoutes.js](file:///d:/Projects%20for%20My%20Portfolio/Student%20Mnagemnt%20system/backend/routes/authRoutes.js)
- Apply role-based protection to existing routes where necessary.

---

### [Frontend] (React/Vite)

#### [MODIFY] [AppSidebar.tsx](file:///d:/Projects%20for%20My%20Portfolio/Student%20Mnagemnt%20system/frontend/src/layout/AppSidebar.tsx)
- Define `roles` for each `NavItem`.
- Filter `navItems` and `othersItems` based on the logged-in user's role (retrieved from `localStorage`).

#### [MODIFY] [App.tsx](file:///d:/Projects%20for%20My%20Portfolio/Student%20Mnagemnt%20system/frontend/src/App.tsx)
- Update `ProtectedRoute` to optionally accept `allowedRoles`.
- Wrap administration and sensitive routes with role-specific protection.

#### [MODIFY] [CreateUser.tsx](file:///d:/Projects%20for%20My%20Portfolio/Student%20Mnagemnt%20system/frontend/src/pages/Administration/CreateUser.tsx)
- Improve UI/UX of the user registration form.
- Ensure only Admins can access this page.

## Verification Plan

### Automated Tests
- No automated tests currently exist, but I will perform manual browser testing.

### Manual Verification
- **Admin Login**: Verify all sidebar items are visible and all pages are accessible.
- **Teacher Login**: Verify only Staff, Academic, Attendance, and Exams (limited) are visible. Try to manually access `/administration/users` and ensure it's blocked.
- **Student Login**: Verify only Dashboard, Results, Fees, and Timetable are visible.
- **User Creation**: Test creating a Teacher account and linking it to a Teacher ID.
