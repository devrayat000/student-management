import { HashRouter, Routes, Route, Link } from "react-router-dom";

import StudentsPage from "./pages/students/page";
import ClassesPage from "./pages/classes/page";
import BatchesPage from "./pages/batches/page";
import PaymentsPage from "./pages/payments/page";
import RootLayout from "./pages/layout";
import CreateStudentPage from "./pages/students/create/page";
import CreateClassPage from "./pages/classes/create/page";
import ClassDetailsPage from "./pages/classes/[classId]/page";
import EditClassPage from "./pages/classes/[classId]/edit/page";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div>
      <HashRouter future={{ v7_startTransition: true }}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route
              index
              element={
                <div>
                  <p>sweet</p>
                  <Link to="students">Students</Link>
                </div>
              }
            />
            <Route path="students">
              <Route index element={<StudentsPage />} />
              <Route path="create" element={<CreateStudentPage />} />
            </Route>
            <Route path="classes">
              <Route index element={<ClassesPage />} />
              <Route path="create" element={<CreateClassPage />} />
              <Route path=":classId">
                <Route index element={<ClassDetailsPage />} />
                <Route path="edit" element={<EditClassPage />} />
              </Route>
            </Route>
            <Route path="batches" element={<BatchesPage />} />
            <Route path="payments" element={<PaymentsPage />} />
          </Route>
        </Routes>
      </HashRouter>
      <Toaster />
    </div>
  );
}

export default App;
