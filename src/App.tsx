import { HashRouter, Routes, Route } from "react-router-dom";

import RootLayout from "./pages/layout";

import StudentsPage from "./pages/students/page";
import CreateStudentPage from "./pages/students/create/page";
import StudentDetailsPage from "./pages/students/[studentId]/page";
import EditStudentPage from "./pages/students/[studentId]/edit/page";

import ClassesPage from "./pages/classes/page";
import CreateClassPage from "./pages/classes/create/page";
import ClassDetailsPage from "./pages/classes/[classId]/page";
import EditClassPage from "./pages/classes/[classId]/edit/page";

import BatchesPage from "./pages/batches/page";
import CreateBatchPage from "./pages/batches/create/page";
import BatchDetailsPage from "./pages/batches/[batchId]/page";
import EditBatchPage from "./pages/batches/[batchId]/edit/page";

import PaymentsPage from "./pages/payments/page";
import { Toaster } from "./components/ui/toaster";
import HomePage from "./pages/page";
import AttendencePage from "./pages/attendence/page";

function App() {
  return (
    <div>
      <HashRouter future={{ v7_startTransition: true }}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="students">
              <Route index element={<StudentsPage />} />
              <Route path="create" element={<CreateStudentPage />} />
              <Route path=":studentId">
                <Route index element={<StudentDetailsPage />} />
                <Route path="edit" element={<EditStudentPage />} />
              </Route>
            </Route>
            <Route path="classes">
              <Route index element={<ClassesPage />} />
              <Route path="create" element={<CreateClassPage />} />
              <Route path=":classId">
                <Route index element={<ClassDetailsPage />} />
                <Route path="edit" element={<EditClassPage />} />
              </Route>
            </Route>
            <Route path="batches">
              <Route index element={<BatchesPage />} />
              <Route path="create" element={<CreateBatchPage />} />
              <Route path=":batchId">
                <Route index element={<BatchDetailsPage />} />
                <Route path="edit" element={<EditBatchPage />} />
              </Route>
            </Route>
            <Route path="payments" element={<PaymentsPage />} />
          </Route>
          <Route path="/attendence" element={<AttendencePage />} />
        </Routes>
      </HashRouter>
      <Toaster />
    </div>
  );
}

export default App;
