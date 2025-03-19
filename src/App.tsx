import { HashRouter, Routes, Route, BrowserRouter } from "react-router";

import { Toaster } from "./components/ui/toaster";

import HomePage from "./pages/page";
import RootLayout from "./pages/layout";

import StudentsPage from "./pages/students/page";
import CreateStudentPage from "./pages/students/create/page";
import StudentDetailsPage from "./pages/students/[studentId]/page";
import EditStudentPage from "./pages/students/[studentId]/edit/page";

import ContentsPage from "./pages/[content]/page";
import CreateContentPage from "./pages/[content]/create/page";
import ContentDetailsPage from "./pages/[content]/[contentId]/page";
import EditContentPage from "./pages/[content]/[contentId]/edit/page";
import AttendencePage from "./pages/attendence/page";

function App() {
  return (
    <div>
      <BrowserRouter>
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
            <Route path=":content">
              <Route index element={<ContentsPage />} />
              <Route path="create" element={<CreateContentPage />} />
              <Route path=":contentId">
                <Route index element={<ContentDetailsPage />} />
                <Route path="edit" element={<EditContentPage />} />
              </Route>
            </Route>
          </Route>
          <Route path="/attendence" element={<AttendencePage />} />
          {/* <Route path="*" element={<h1>Not Found</h1>} /> */}
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
